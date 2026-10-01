const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');   


const etiquetasCtrl = require('../controllers/catalogos/etiquetas.controller');


router.get('/',etiquetasCtrl.viewEtiquetas);
router.get('/all',etiquetasCtrl.getEtiquetas);
router.get('/:id',etiquetasCtrl.getEtiqueta);
router.post('/',uploadNone,etiquetasCtrl.createEtiquetas);
router.put('/:id',uploadNone,etiquetasCtrl.updateEtiqueta);
router.put('/activar/:id',uploadNone,etiquetasCtrl.activarEtiqueta);


module.exports = router;


