const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');   


const ventanasEmergentesCtrl = require('../controllers/ventanas_emergentes.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',ventanasEmergentesCtrl.viewVentanas);
router.get('/all',ventanasEmergentesCtrl.getVentanas);
router.get('/:id',ventanasEmergentesCtrl.getVentanaById);
router.get('/user/:id',ventanasEmergentesCtrl.getVentanasByUser);
router.post('/',uploadMiddleware,ventanasEmergentesCtrl.createVentana);

router.put('/activar/:id',uploadNone,ventanasEmergentesCtrl.activarVentana);
router.put('/:id',uploadMiddleware,ventanasEmergentesCtrl.updateVentana);


module.exports = router;


