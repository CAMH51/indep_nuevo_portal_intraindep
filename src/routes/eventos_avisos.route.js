const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');   


const eventosAvisosCtrl = require('../controllers/eventos_avisos.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',eventosAvisosCtrl.viewEventosAvisos);
router.get('/all',eventosAvisosCtrl.getEventosAvisos);
router.get('/:id',eventosAvisosCtrl.getEventoAvisoById);
router.get('/user/:id',eventosAvisosCtrl.getEventosAvisosByUser);
router.post('/',uploadMiddleware,eventosAvisosCtrl.createEventoAviso);

router.put('/activar/:id',uploadNone,eventosAvisosCtrl.activarEventoAviso);
router.put('/:id',uploadMiddleware,eventosAvisosCtrl.updateEventoAviso);


module.exports = router;


