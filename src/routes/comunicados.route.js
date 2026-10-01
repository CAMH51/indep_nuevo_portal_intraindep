const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');  


const comunicadosCtrl = require('../controllers/comunicados.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',comunicadosCtrl.viewComunicado);
router.get('/all',comunicadosCtrl.getComunicados);
router.get('/:id',comunicadosCtrl.getComunicadoById);
router.get('/departamento/:id',comunicadosCtrl.getComunicadosByDepartamento);
router.post('/',uploadMiddleware,comunicadosCtrl.createComunicado);
router.put('/:id',uploadMiddleware,comunicadosCtrl.updateComunicado);
router.put('/activar/:id',uploadMiddleware,comunicadosCtrl.activarComunicado);


module.exports = router;


