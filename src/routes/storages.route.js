const express = require('express');
const router = express.Router();
const {uploadNone, upload} = require('../middleware/formData');   


const storagesCtrl = require('../controllers/catalogos/storages.controller');


router.get('/',storagesCtrl.viewStorages);
router.get('/all',storagesCtrl.getStorages);
router.get('/:id',storagesCtrl.getStorage);
router.post('/',uploadNone,storagesCtrl.createStorage);
router.put('/:id',uploadNone,storagesCtrl.updateStorage);
router.put('/activar/:id',uploadNone,storagesCtrl.activarStorage);


// ÁRBOL COMPLETO
router.get('/:storageId/tree',storagesCtrl.getTree);

// CONTENIDO DE UN DIRECTORIO
router.get('/:storageId/browse',storagesCtrl.browseDirectory);

// CREAR DIRECTORIO
router.post('/:storageId/directory',storagesCtrl.createDirectory);
router.delete('/:storageId/directory',storagesCtrl.deleteDirectory);

// PÁGINAS EJS  
router.post('/:storageId/page',   storagesCtrl.savePage);
router.get('/:storageId/page',    storagesCtrl.readPage);
router.delete('/:storageId/page', storagesCtrl.deletePage);
router.post('/:id/upload', upload.single('file'), (req, res) => {
  const dirPath = req.body.dirPath || '';
  const publicPath = `/imagenes/${dirPath}/${req.file.filename}`;
  res.json({ path: publicPath });
});

router.get('/dashboard',storagesCtrl.renderDashboard);
router.get('/explorer',storagesCtrl.renderExplorer);
router.get('/editor',storagesCtrl.renderEditor);

module.exports = router;


