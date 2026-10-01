const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData'); 

const serviciosPromocionesCtrl = require('../controllers/servicios_promociones.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',serviciosPromocionesCtrl.viewServiciosPromociones);
router.get('/all',serviciosPromocionesCtrl.getServiciosPromociones);
router.get('/:id',serviciosPromocionesCtrl.getServicioPromocionById);
router.get('/user/:id',serviciosPromocionesCtrl.getServiciosPromocionesByUser);
router.post('/',uploadMiddleware,serviciosPromocionesCtrl.createServicioPromocion);

router.put('/activar/:id',uploadNone,serviciosPromocionesCtrl.activarServicioPromocion);
router.put('/:id',uploadMiddleware,serviciosPromocionesCtrl.updateServicioPromocion);


module.exports = router;


