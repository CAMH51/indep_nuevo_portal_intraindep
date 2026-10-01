const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');  


const documentoCtrl = require('../controllers/documentos.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',documentoCtrl.viewDocumentos);
router.get('/all',documentoCtrl.getDocumentos);
router.get('/:id',documentoCtrl.getDocumentoById);
router.get('/user/:id',documentoCtrl.getDocumentosByUser);
router.post('/',uploadMiddleware,documentoCtrl.createDocumento);

router.put('/activar/:id',uploadNone,documentoCtrl.activarDocumento);
router.put('/:id',uploadMiddleware,documentoCtrl.updateDocumento);


module.exports = router;

