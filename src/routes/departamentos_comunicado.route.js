const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');    


const departamentoCtrl = require('../controllers/catalogos/departamentos_comunicado.controller');


router.get('/',departamentoCtrl.viewDepartamento);
router.get('/all',departamentoCtrl.getDepartamentos);
router.get('/:id',departamentoCtrl.getDepartamentoById);
router.post('/',uploadNone,departamentoCtrl.createDepartamento);
router.put('/:id',uploadNone,departamentoCtrl.updateDepartamento);
router.put('/activar/:id',uploadNone,departamentoCtrl.activarDepartamento);


module.exports = router;


