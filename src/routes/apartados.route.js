const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');

const apartadosCtrl = require('../controllers/catalogos/apartados.controller');


router.get('/',apartadosCtrl.viewApartados);
router.get('/all',apartadosCtrl.getApartados);
router.get('/:id',apartadosCtrl.getApartado);
router.post('/',uploadNone,apartadosCtrl.createApartado);
router.put('/:id',uploadNone,apartadosCtrl.updateApartado);
router.put('/activar/:id',uploadNone,apartadosCtrl.activarApartado);
router.get('/asignados/:id',apartadosCtrl.getApartadosByUserAndAsignados);
router.get('/subapartados/:id',apartadosCtrl.getSubapartadosApartadosAsignados);




module.exports = router;


