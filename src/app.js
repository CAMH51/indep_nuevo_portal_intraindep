const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const fs = require('fs');
const crypto = require('crypto');
const db = require('./api/config/dbPostgres');
const { connectDB } = require('./api/config/dbSQLServer');
const session = require('express-session');
const modulosMiddleware = require('./middleware/modulosMiddleware');
const dataByuserMiddleware = require('./middleware/dataByUserMiddleware');
const storageService = require('./api/services/catalogos/storages.service');


const nonceMiddleware = require('./middleware/nonceMiddleware');
// ✅ Validar variables de entorno ANTES de todo
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.error('FATAL: SESSION_SECRET no está definido en .env');
  process.exit(1);
}

const storageState = require('./state/storage.state');
const app = express();
app.use(cookieParser());
const port = process.env.PORT || 3310;

const webRoute = require('./routes/web.route');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://cdn.datatables.net",
        "https://unpkg.com"
      ],
      scriptSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://cdn.datatables.net",
        "https://unpkg.com"
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://cdn.datatables.net",
        "https://unpkg.com"
      ],
      styleSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://cdn.datatables.net",
        "https://unpkg.com"
      ],
      styleSrcAttr: ["'unsafe-inline'"],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "data:"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",
        "http:"
      ],
      connectSrc: [
        "'self'",
        "https://qa-api-multifactor.indep.gob.mx",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://cdn.datatables.net",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com"
      ],
      frameSrc: [
        "'self'",
        "https:",
        "blob:",
        "data:"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xXssProtection: true,
  xDnsPrefetchControl: { allow: true },
  xDownloadOptions: true,
  xContentTypeOptions: true,
  xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
  xFrameOptions: { action: "sameorigin" }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: SESSION_SECRET,
  name: process.env.APP_COOKIE_NAME,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));



let basePath = null;

app.use('/imagenes', (req, res, next) => {
   console.log('[/imagenes] ➡️  Entró:', req.method, req.url);
  console.log('[/imagenes] basePath:', basePath);
  if (!basePath) {
    console.log('[/imagenes] ❌ Sin basePath → 503');
    return res.status(503).send('Storage no disponible aún');
    
  }

  const fullPath = path.join(basePath, req.url);
  console.log('[/imagenes] 🔍 Buscando archivo en:', fullPath);
  console.log('[/imagenes] 📁 Existe:', fs.existsSync(fullPath));
  express.static(basePath, {
    index: false,
    redirect: false,
    fallthrough: true,
  })(req, res, (err)=>{
    console.log('[/imagenes] ⚠️  No encontrado, pasando a next. err:', err?.message);
    next(err);
  });
});

async function getStorage(){
  let storages = [];
  const storage = await iniciarPollingStorage();
  try {
    // Normaliza siempre a array
    storages = Array.isArray(storage) ? storage : (storage ? [storage] : []);
  } catch (error) {
    console.error('Error al obtener storages:', error.message);
  }

  if (storages.length > 0) {
  console.log('Storage recibido:', JSON.stringify(storage, null, 2));

  storageState.setStorages(storages);
  app.locals.storages = storages;
  
  basePath = path.resolve(storages[0].base_path); 
  
    
    startServer();
  } else {
  console.warn('No hay storage activo');
  }

}
getStorage();

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(modulosMiddleware);
app.use(dataByuserMiddleware);

app.use('/', webRoute);

// ✅ Manejo de errores globales — evita que el proceso muera silenciosamente
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err);
  // No hagas process.exit() aquí a menos que sea crítico
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection en:', promise, 'razón:', reason);
});

async function iniciarPollingStorage() {
  const MAX_INTENTOS = 10;        // máximo de reintentos
  const INTERVALO_BASE_MS = 5000; // 5 segundos base
  const BACKOFF = false;          // true = duplica el tiempo cada intento

  let intento = 0;

  while (intento < MAX_INTENTOS) {
    const result =await storageService.getStorages({where:{activo:true}});

    if (result) {
      
      return result; // ✅ encontrado, detiene el polling
    }

    intento++;
    

    if (intento >= MAX_INTENTOS) break;

    const espera = BACKOFF
      ? INTERVALO_BASE_MS * Math.pow(2, intento - 1) // 5s, 10s, 20s, 40s…
      : INTERVALO_BASE_MS;                            // siempre 5s

    await new Promise(resolve => setTimeout(resolve, espera));
  }

  console.warn('No se encontró storage activo después de todos los intentos.');
  return null; // o lanzar un error según tu lógica
}

// ✅ Función de inicio async para manejar errores de conexión correctamente
async function startServer() {
  try {
    await connectDB();
    console.log('✅ SQL Server conectado');
  } catch (err) {
    console.error('❌ Error conectando SQL Server:', err.message);
    // Decide si quieres continuar sin SQL Server o detener el proceso
  }

  try {
    await db.authenticate();
    console.log('✅ PostgreSQL conectado');
  } catch (err) {
    console.error('❌ Error conectando PostgreSQL:', err.message);
  }

  app.listen(port, async() => {
    console.log(`🚀 Server corriendo en puerto ${port}`);
  });
}
