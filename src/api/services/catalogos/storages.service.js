const {storageModel} = require('../../models/associations');
const dbConnection = require('../../config/dbPostgres');
const path = require('path');
const fs = require('fs').promises;
const { validatePath, sanitizeName } = require('../../middlewares/validatePath');


const getStorages =async(whereOptions={},scope = null) =>{
    try {
        const storages = scope ? await storageModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await storageModel.findAll(whereOptions);

        return storages;
    } catch (error) {
        return error;
    }
}

const getStorageById = async (id, scope=null) =>{
    try {
        
        const storage = scope ? await storageModel.scope(['defaultScope', scope]).findOne({where:{id_storage:id}})
        : await storageModel.findOne({where:{id_storage:id}});

        return storage;
    } catch (error) {
        return error;
    }
}

const createStorage = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const storage = await storageModel.create(data,{transaction:t});
        await t.commit();
        return storage;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateStorage = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const storage = await storageModel.update(data,{where:{id_storage:id}},{transaction:t});
        await t.commit();
        return storage;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarStorage = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await storageModel.update({activo:estatus},{where:{id_storage:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const getStorage = async(storageId = 1)=> {
  const storage = await storageModel.findByPk(storageId);
  if (!storage) throw new Error(`Storage con id ${storageId} no encontrado`);
  if (!storage.activo) throw new Error(`Storage con id ${storageId} está inactivo`);
  return storage;
}


const  buildTree = async (basePath, relPath = '', depth = 0, maxDepth = 5)=> {
  const absPath = path.join(basePath, relPath);
  const entries = await fs.readdir(absPath, { withFileTypes: true });

  const children = [];
  const pages = [];

  for (const entry of entries) {
    const entryRel = relPath ? `${relPath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (depth < maxDepth) {
        const subtree = await buildTree(basePath, entryRel, depth + 1, maxDepth);
        children.push(subtree);
      } else {
        children.push({ name: entry.name, path: entryRel, children: [], pages: [] });
      }
    } else if (entry.isFile() && entry.name.endsWith('.ejs')) {
      pages.push({
        filename: entry.name.replace('.ejs', ''),
        fullName: entry.name,
        dirPath: relPath,
        relPath: entryRel
      });
    }
  }

  return {
    name: relPath ? path.basename(relPath) : '/',
    path: relPath,       // ruta relativa al basePath
    isRoot: relPath === '',
    children,
    pages
  };
}

// Cuenta todas las páginas recursivamente
const countPages = (tree)=> {
  let count = tree.pages.length;
  for (const child of tree.children) count += countPages(child);
  return count;
}

// Cuenta todos los directorios recursivamente
const  countDirs = (tree)=> {
  let count = tree.children.length;
  for (const child of tree.children) count += countDirs(child);
  return count;
}


const getTree = async(req, res)=> {
  try {
     const storage = await getStorage(req.params.storageId);
    const tree = await buildTree(storage.base_path);

    return{
        storage: { id: storage.id, name: storage.name, base_path: storage.base_path, directorio_principal: storage.directorio_principal},
        tree,
        totalPages: countPages(tree),
        totalDirs: countDirs(tree)
    }
  } catch (err) {
    return err;
  }
}


// ─────────────────────────────────────────────────────────
// CONTENIDO DE UN DIRECTORIO
// GET /api/storages/:storageId/browse?dirPath=blog/posts
// ─────────────────────────────────────────────────────────

const  browseDirectory = async(req, res)=> {
  try {
    const { dirPath = '' } = req.query;
    const storage = await getStorage(req.params.storageId);

    const cleanDir = sanitizeName(dirPath);
    const absPath = cleanDir
      ? validatePath(storage.base_path, cleanDir)
      : storage.base_path;

    const entries = await fs.readdir(absPath, { withFileTypes: true });

    const directories = [];
    const pages = [];

    for (const e of entries) {
      if (e.isDirectory()) {
        directories.push({
          name: e.name,
          path: cleanDir ? `${cleanDir}/${e.name}` : e.name
        });
      } else if (e.isFile() && e.name.endsWith('.ejs')) {
        pages.push({
          filename: e.name.replace('.ejs', ''),
          dirPath: cleanDir,
          accessUrl: '/' + (cleanDir ? `${cleanDir}/${e.name.replace('.ejs','')}` : e.name.replace('.ejs',''))
        });
      }
    }

    // Breadcrumb: descomponer el path en segmentos
    const segments = cleanDir ? cleanDir.split('/') : [];
    const breadcrumb = segments.map((seg, i) => ({
      name: seg,
      path: segments.slice(0, i + 1).join('/')
    }));

    return {
        currentPath: cleanDir,
        breadcrumb,
        directories,
        pages
    }

  } catch (err) {
    return err;
  }
}

// ─────────────────────────────────────────────────────────
// CREAR DIRECTORIO
// POST /api/storages/:storageId/directory
// body: { dirPath: "blog/posts" }
// ─────────────────────────────────────────────────────────

const createDirectory = async(req, res)=> {
  try {
    const { dirPath } = req.body;
    if (!dirPath) return res.status(400).json({ error: 'dirPath es requerido' });

    const storage = await getStorage(req.params.storageId);
    const cleanPath = sanitizeName(dirPath);
    const fullPath = validatePath(storage.base_path, cleanPath);

    await fs.mkdir(fullPath, { recursive: true });
    return { message: 'Directorio creado', dirPath: cleanPath }
    //res.status(201).json({ message: 'Directorio creado', dirPath: cleanPath });
  } catch (err) {
    //res.status(500).json({ error: err.message });
    return err;
  }
}

const deleteDirectory= async(req, res)=> {
  try {
   const { dirPath } = req.body;
    const storage = await getStorage(req.params.storageId);
    const cleanPath = sanitizeName(dirPath);
    const fullPath = validatePath(storage.base_path, cleanPath);

    // No permitir borrar la raíz
    if (fullPath === path.resolve(storage.base_path)) {
      return res.status(400).json({ error: 'No se puede eliminar el directorio raíz' });
    }

    await fs.rm(fullPath, { recursive: true, force: true });
    return { message: 'Directorio eliminado' }
    //res.json({ message: 'Directorio eliminado' });
  } catch (err) {
    return err;
    //res.status(500).json({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────
// PÁGINAS EJS
// ─────────────────────────────────────────────────────────

/* const savePage = async(req, res)=> {
  try {
    //console.log('req.body savePage',req.body)
    const { dirPath = '', filename, content, images, files } = req.body;
    if (!filename || content === undefined) {
      return res.status(400).json({ error: 'filename y content son requeridos' });
    }

    const storage   = await getStorage(req.params.storageId);
    const basePath  = path.resolve(storage.base_path);
    // Limpiar inputs — sanitizeName preserva las /
    const cleanDir  = sanitizeName(dirPath);
    const cleanFile = sanitizeName(filename).replace(/\.ejs$/i, '').replace(/\//g, '');

    // Directorio base donde el usuario está navegando
    const currentBaseDir = cleanDir ? path.join(basePath, cleanDir) : basePath;

    // Definir rutas: Preferimos carpeta, pero soportamos archivo plano legacy
    const flatPath = path.join(currentBaseDir, cleanFile + '.ejs');
    let finalDir   = path.join(currentBaseDir, cleanFile);
    let targetPath = path.join(finalDir, cleanFile + '.ejs');

    // Verificar si ya existe como archivo plano
    try {
      await fs.access(flatPath);
      // Si existe plano, mantenemos esa estructura
      targetPath = flatPath;
      finalDir   = currentBaseDir;
    } catch (e) {
      // Si no existe plano, usamos la estructura de carpeta (creándola si es necesario)
      await fs.mkdir(finalDir, { recursive: true });
    }

    // Seguridad: verificar que sigue dentro del basePath
    if (!targetPath.startsWith(basePath + path.sep) && !targetPath.startsWith(basePath + '/')) {
      return res.status(400).json({ error: 'Ruta inválida' });
    }

    // Guardar imágenes si vienen en la petición
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.filename && img.base64) {
          const safeImgName = sanitizeName(img.filename);
          const imgPath = path.join(finalDir, safeImgName);
          
          // Decodificar base64 y guardar archivo
          const matches = img.base64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (matches) {
            const buffer = Buffer.from(matches[2], 'base64');
            await fs.writeFile(imgPath, buffer);
          }
        }
      }
    }

    // Guardar archivos si vienen en la petición
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if (file.filename && file.base64) {
          const safeFileName = sanitizeName(file.filename);
          const filePath = path.join(finalDir, safeFileName);

          // Decodificar base64 y guardar archivo
          const matches = file.base64.match(/^data:.+\/(.+);base64,(.+)$/);
          if (matches) {
            const buffer = Buffer.from(matches[2], 'base64');
            await fs.writeFile(filePath, buffer);
          }
        }
      }
    }

    await fs.writeFile(targetPath, content, 'utf8');

    //console.log('[savePage] Guardado:', targetPath);

    const relativeFinalDir = path.relative(basePath, finalDir); // → 'home/paginax'
    const accessUrl = '/' + [relativeFinalDir, cleanFile].filter(Boolean).join('/');
    //const accessUrl = '/' + [cleanDir, cleanFile].filter(Boolean).join('/');
    return {
        message: 'Página guardada',
        filename: cleanFile,
        dirPath:  relativeFinalDir,
        accessUrl
    }
  } catch (err) {
    console.error('[savePage] Error:', err);
    return err;
    //res.status(500).json({ error: err.message });
  }
} */

const savePage = async (req) => {
    const { dirPath = '', filename, content } = req.body;

    if (!filename || content === undefined) {
        const e = new Error('filename y content son requeridos');
        e.status = 400;
        throw e;
    }

    const storage   = await getStorage(req.params.storageId);
    const basePath  = path.resolve(storage.base_path);
    const cleanDir  = sanitizeName(dirPath);
    const cleanFile = sanitizeName(filename).replace(/\.ejs$/i, '').replace(/\//g, '');

    const currentBaseDir = cleanDir ? path.join(basePath, cleanDir) : basePath;
    const flatPath = path.join(currentBaseDir, cleanFile + '.ejs');
    let finalDir   = path.join(currentBaseDir, cleanFile);
    let targetPath = path.join(finalDir, cleanFile + '.ejs');

    try {
        await fs.access(flatPath);
        targetPath = flatPath;
        finalDir   = currentBaseDir;
    } catch (e) {
        await fs.mkdir(finalDir, { recursive: true });
    }

    if (!targetPath.startsWith(basePath + path.sep) && !targetPath.startsWith(basePath + '/')) {
        const e = new Error('Ruta inválida');
        e.status = 400;
        throw e;
    }

    // Ya no se procesan images[] ni files[] — el base64 vive dentro de `content`
    await fs.writeFile(targetPath, content, 'utf8');

    const relativeFinalDir = path.relative(basePath, finalDir);
    const accessUrl = '/' + [relativeFinalDir, cleanFile].filter(Boolean).join('/');

    return {
        message: 'Página guardada',
        filename: cleanFile,
        dirPath: relativeFinalDir,
        accessUrl
    };
}

const readPage = async(req, res)=> {
  try {
    const { filePath } = req.query;
    if (!filePath) return res.status(400).json({ error: 'filePath es requerido' });

    const storage = await getStorage(storageId);
    const cleanPath = sanitizeName(filePath).replace(/\.ejs$/, '');
    const fullPath  = validatePath(storage.base_path, `${cleanPath}.ejs`);

    const content = await fs.readFile(fullPath, 'utf8');
    res.json({ filePath: cleanPath, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const deletePage = async(req, res)=> {
  try {
    const { filePath } = req.body;
    const storage = await getStorage(req.params.storageId);
    const cleanPath = sanitizeName(filePath).replace(/\.ejs$/, '');
    const fullPath  = validatePath(storage.base_path, `${cleanPath}.ejs`);

    await fs.unlink(fullPath);
    return { message: 'Página eliminada' }
    //res.json({ message: 'Página eliminada' });
  } catch (err) {
    return err;
    
    //res.status(500).json({ error: err.message });
  }
}


// ─────────────────────────────────────────────────────────
// SERVIR ARCHIVOS ESTÁTICOS (Imágenes, assets)
// ─────────────────────────────────────────────────────────

const serveStatic = async(req, res, next)=> {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();

  // Ignorar rutas del sistema y API
  if (req.path.startsWith('/api/') || ['/dashboard', '/explorer', '/editor'].includes(req.path)) {
    return next();
  }

  try {
    const storages = await storageModel.findAll({ where: { activo: true } });
    const relPath = req.path.replace(/^\/+/, ''); // "/img.png" -> "img.png"

    for (const storage of storages) {
      try {
        const absPath = validatePath(storage.base_path, relPath);
        const stats = await fs.stat(absPath);
        if (stats.isFile() && !absPath.endsWith('.ejs')) {
          return res.sendFile(absPath);
        }
      } catch (_) { /* No encontrado en este storage, probar siguiente */ }
    }
    next();
  } catch (err) { next(); }
}


// ─────────────────────────────────────────────────────────
// VISTAS (render EJS del servidor)
// ─────────────────────────────────────────────────────────

const  renderDashboard = async(req, res)=> {
  try {
    const storagesFromDB = await storageModel.findAll({ where: { activo: true } });
    const storagesForView = [];
    console.log("storagesFromDB",storagesFromDB)
    let totalPages = 0, totalDirs = 0, recentPages = [];

    for (const s of storagesFromDB) {
      const storageData = {
        id: s.id_storage,
        name: s.name,
        tree: null
      };

      try {
        const tree = await buildTree(s.base_path);
        totalPages += countPages(tree);
        totalDirs  += countDirs(tree);
        storageData.tree = tree;

        // Recolectar páginas recientes (hasta 5 por storage)
        function collectPages(node) {
          for (const p of node.pages) {
            const accessUrl = '/' + [p.dirPath, p.filename].filter(Boolean).join('/');
            recentPages.push({ ...p, storageName: s.name, storageId: s.id_storage, accessUrl });
          }
          for (const c of node.children) collectPages(c);
        }
        collectPages(tree);
      } catch (_) { /* storage vacío o sin acceso */ }

      storagesForView.push(storageData);
    }

    recentPages = recentPages.slice(0, 6);


    return {
        storages: storagesForView,
      totalPages,
      totalDirs,
      totalStorages: storagesForView.length,
      recentActivity: totalPages + totalDirs,
      recentPages
    }
   /*  res.status(200).json({success:true,
      storages: storagesForView,
      totalPages,
      totalDirs,
      totalStorages: storagesForView.length,
      recentActivity: totalPages + totalDirs,
      recentPages
    }); */
  } catch (err) {
    return err;
    //res.status(500).send('Error: ' + err.message);
  }
}


const renderExplorer = async(req, res)=> {
  try {
    const storages = await storageModel.findAll({ where: { activo: true } });

    // Primer storage por defecto, o el que venga en query
    const storageId = req.query.storageId || (storages[0] && storages[0].id_storage) || 1;
    const dirPath   = req.query.dirPath || '';
    const action    = req.query.action || '';

    const currentStorage = storages.find(s => s.id_storage == storageId) || storages[0];

    let tree = { name: '/', path: '', children: [], pages: [] };
    let currentDir = { currentPath: dirPath, breadcrumb: [], directories: [], pages: [] };

    if (currentStorage) {
      try {
        tree = await buildTree(currentStorage.base_path);

        // Leer el contenido del directorio actual
        const cleanDir = sanitizeName(dirPath);
        const absPath  = cleanDir
          ? validatePath(currentStorage.base_path, cleanDir)
          : currentStorage.base_path;

        const entries = await fs.readdir(absPath, { withFileTypes: true });
        const dirs = [], pages = [];

        for (const e of entries) {
          if (e.isDirectory()) {
            dirs.push({ name: e.name, path: cleanDir ? `${cleanDir}/${e.name}` : e.name });
          } else if (e.isFile() && e.name.endsWith('.ejs')) {
            pages.push({
              filename: e.name.replace('.ejs', ''),
              dirPath: cleanDir,
              accessUrl: '/' + [cleanDir, e.name.replace('.ejs','')].filter(Boolean).join('/')
            });
          }
        }

        const segments = cleanDir ? cleanDir.split('/') : [];
        currentDir = {
          currentPath: cleanDir,
          breadcrumb: segments.map((seg, i) => ({
            name: seg,
            path: segments.slice(0, i + 1).join('/')
          })),
          directories: dirs,
          pages
        };
      } catch (_) {}
    }

    return {
        storages,
      currentStorage,
      currentStorageId: storageId,
      tree,
      currentDir,
      action,
      totalPages: countPages(tree),
      totalDirs: countDirs(tree)
    }
    /* res.status(200).json({success:true,
      storages,
      currentStorage,
      currentStorageId: storageId,
      tree,
      currentDir,
      action,
      totalPages: countPages(tree),
      totalDirs: countDirs(tree)
    }); */
  } catch (err) {
    return err;
    //res.status(500).send('Error: ' + err.message);
  }
}


//─────────────────────────────────────────────────────────
// VISTA EDITOR VISUAL
// GET /editor?storageId=1&dirPath=blog/posts&filename=mi-pagina
// ─────────────────────────────────────────────────────────

/* async function renderEditor(req, res) {
  try {
    const { storageId = 1, dirPath = '', filename } = req.query;

    console.log("query",req.query)

    if (!filename) return res.status(400).json({msg:'filename es requerido'});

    const storage  = await getStorage(storageId);
    const basePath = path.resolve(storage.base_path);
    const cleanDir  = sanitizeName(dirPath);
    const cleanFile = sanitizeName(filename).replace(/\.ejs$/i, '').replace(/\//g, '');

    const fullDir  = cleanDir ? path.join(basePath, cleanDir) : basePath;
    const fullPath = path.join(fullDir, cleanFile + '.ejs');

    // Seguridad
    if (!fullPath.startsWith(basePath)) {
      return res.status(400).json({msg:'Ruta inválida'});
    }

    // Leer contenido existente — puede ser HTML puro o EJS template
    let ejsContent = '';
    try {
      ejsContent = await fs.readFile(fullPath, 'utf8');
    } catch (_) {
      // Archivo nuevo
    }

    // Renderizar el editor (que es un EJS real del sistema)
    res.status(200).json({success:true,
      storageId,
      dirPath:    cleanDir,
      filename:   cleanFile,
      ejsContent              // se pasa como JSON.stringify en el template
    });
  } catch (err) {
    console.error('[renderEditor]', err);
    res.status(500).send('Error: ' + err.message);
  }
} */


  async function renderEditor(storageId,dirPath,filename) {
  try {

    if (!filename) return res.status(400).json({msg:'filename es requerido'});

    const storage  = await getStorage(storageId);
    const basePath = path.resolve(storage.base_path);
    const cleanDir  = sanitizeName(dirPath);
    const cleanFile = sanitizeName(filename).replace(/\.ejs$/i, '').replace(/\//g, '');

    const fullDir  = cleanDir ? path.join(basePath, cleanDir) : basePath;
    const fullPath = path.join(fullDir, cleanFile + '.ejs');

    // Seguridad
    if (!fullPath.startsWith(basePath)) {
      return res.status(400).json({msg:'Ruta inválida'});
    }

    // Leer contenido existente — puede ser HTML puro o EJS template
    let ejsContent = '';
    try {
      ejsContent = await fs.readFile(fullPath, 'utf8');
    } catch (_) {
      // Archivo nuevo
    }

    // Renderizar el editor (que es un EJS real del sistema)
    return {
      storageId,
      dirPath:    cleanDir,
      filename:   cleanFile,
      ejsContent 
    }
    
  } catch (err) {
    console.error('[renderEditor]', err);
    return err;
    //res.status(500).send('Error: ' + err.message);
  }
}

module.exports = {
    getStorages,
    getStorageById,
    createStorage,
    updateStorage,
    activarStorage,
    buildTree,
    getTree,
    browseDirectory,
    createDirectory,
    deleteDirectory,
    savePage,
    readPage,
    deletePage,
    serveStatic,
    renderDashboard,
    renderExplorer,
    renderEditor,
    getStorage
}