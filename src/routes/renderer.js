/**
 * renderer.js
 * Sirve páginas guardadas. Detecta si son HTML del editor o EJS template.
 * Las páginas EJS del storage se envuelven en el layout de home.
 */
const router     = require('express').Router();
const path       = require('path');
const fs         = require('fs');
const ejs        = require('ejs');

const ventanasService = require('../api/services/ventanas_emergentes.service');
const apartadosService = require('../api/services/catalogos/apartados.service');
const avisosService = require('../api/services/avisos_importantes.service');
const ligasService = require('../api/services/ligas.service');

//const catalogs   = require('../controllers/catalogs.controller');
//const homeServices = require('../services/home.services'); // ajusta el path si es necesario

const storageService = require('../api/services/catalogos/storages.service');

router.get('{*path}', async (req, res) => {
  try {
    const storages = await storageService.getStorages({where:{activo:true}});
    

    if (!storages.length) {
      return res.status(404).send('No hay storages configurados');
    }

    // URL path limpio: /blog/posts/pagina → blog/posts/pagina
    let urlPath = req.path.replace(/^\/+/, '');
    if (!urlPath) urlPath = 'index';

    console.log(`[renderer] Buscando página para: ${req.path} (urlPath: ${urlPath})`);

    for (const storage of storages) {
      const basePath = path.resolve(storage.base_path);
      const nativePath = urlPath.split('/').join(path.sep);
      
      console.log(`[renderer] Probando storage: ${storage.name} (${storage.id_storage})`);
      console.log(`[renderer] Base path: ${basePath}`);
      console.log(`[renderer] Native path: ${nativePath}`);

      // Estrategia de búsqueda:
      // 1. Archivo directo: ruta.ejs
      // 2. Carpeta con mismo nombre: ruta/ruta.ejs (Nueva estructura)
      // 3. Índice: ruta/index.ejs

      let filePath = path.join(basePath,'/home/', nativePath + '.ejs');
      let isDirectoryBased = false;
      
      console.log(`[renderer] Verificando archivo directo: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        console.log(`[renderer] Archivo directo NO encontrado`);
        const parts = nativePath.split(path.sep);
        const filename = parts[parts.length - 1];
        const nestedPath = path.join(basePath, nativePath, filename + '.ejs');
        const indexPath  = path.join(basePath, nativePath, 'index.ejs');

        console.log(`[renderer] Verificando nestedPath: ${nestedPath}`);
        console.log(`[renderer] Verificando indexPath: ${indexPath}`);

        if (fs.existsSync(nestedPath)) {
          filePath = nestedPath;
          isDirectoryBased = true;
          console.log(`[renderer] ✓ Encontrado nestedPath: ${filePath}`);
        } else if (fs.existsSync(indexPath)) {
          filePath = indexPath;
          isDirectoryBased = true;
          console.log(`[renderer] ✓ Encontrado indexPath: ${filePath}`);
        } else {
          console.log(`[renderer] ✗ No encontrado en este storage`);
        }
      } else {
        console.log(`[renderer] ✓ Encontrado archivo directo: ${filePath}`);
      }

      // Seguridad: no escapar del basePath
      const resolvedBase = basePath.endsWith(path.sep) ? basePath : basePath + path.sep;
      if (!filePath.startsWith(resolvedBase)) {
        console.log(`[renderer] ⚠ Archivo fuera del basePath: ${filePath}`);
        continue;
      }

      if (!fs.existsSync(filePath)) continue;



      // Si es estructura de carpeta y la URL no termina en /, redirigir.
      if (isDirectoryBased && !req.path.endsWith('/') && req.path !== '/') {
        const q = req.url.indexOf('?');
        const search = q !== -1 ? req.url.substring(q) : '';
        console.log(`[renderer] Redirigiendo a: ${req.path + '/' + search}`);
        return res.redirect(301, req.path + '/' + search);
      }

      const raw     = fs.readFileSync(filePath, 'utf8');
      const trimmed = raw.trimStart();

      // HTML completo del editor visual → servir directo sin layout
      if (/^<!doctype\s/i.test(trimmed) || /^<html[\s>]/i.test(trimmed)) {
        console.log(`[renderer] Sirviendo como HTML directo (editor visual)`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(raw);
      }



      // EJS del storage → renderizar a string y envolver en layout de home
      const urlParts = urlPath.split('/');
      const slug     = urlParts[urlParts.length - 1] || '';
      const apartado = urlParts.length > 1 ? urlParts[urlParts.length - 2] : '';

      // Cargar datos que necesita el layout de home
       const [apartadosSubapartados, ventanaEmergente,avisosImportantes, ligas] = await Promise.all([
        apartadosService.getBySubapartados(),
        ventanasService.getVentanaVigente(),
        avisosService.getAvisosVigentes(),
        ligasService.getLigas()
      ]) ;

      // Renderizar el EJS externo a HTML string
      // { views: [path.dirname(filePath)] } permite que el EJS del storage
      // use includes relativos a su propia carpeta
      const pageHtml = await ejs.renderFile(filePath, {
        query:   req.query,
        params:  req.params,
        url:     req.originalUrl,
        storage: { id: storage.id_storage, name: storage.name },
      }, {
        views: [path.dirname(filePath)],
      });

      console.log(`[renderer] EJS renderizado exitosamente, entregando página`);

      // Entregar el HTML procesado dentro del layout de home
      return res.render('home/home', {
        pageHtml,
        apartado,
        slug,
        query:   req.query,
        params:  req.params,
        url:     req.originalUrl,
        storage: { id: storage.id_storage, name: storage.name },
        apartadosSubapartados,
        ventanaEmergente,
        avisosImportantes,
        ligas,
        isHome:  false,
      });
    }

    console.log(`[renderer] ❌ No se encontró el archivo en ningún storage`);
    
   const [apartadosSubapartados, ventanaEmergente,avisosImportantes, ligas] = await Promise.all([
        apartadosService.getBySubapartados(),
        ventanasService.getVentanaVigente(),
        avisosService.getAvisosVigentes(),
        ligasService.getLigas()
      ]) ;


    const pageHtml = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;color:#555;text-align:center">
      <h1 style="font-size:5rem;margin:0;color:#222">404</h1>
      <p style="color:#888;margin:8px 0 24px">La página <code style="background:#eee;padding:2px 6px;border-radius:4px">${req.path}</code> no existe.</p>
      <a href="/home" style="";font-weight:600">← Home</a>
    </div>
  `;

    return res.status(201).render('home/home', {
      pageHtml,
      apartado: '',
      slug: '404',
      query:   req.query,
      params:  req.params,
      url:     req.originalUrl,
      storage: null,
      apartadosSubapartados,
      ventanaEmergente,
      avisosImportantes,
      ligas,
      isHome:  false,
    });


  } catch (err) {
    console.error('[renderer]', err);
    res.status(500).send('Error: ' + err.message);
  }
});

module.exports = router;