const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');     


const ligasCtrl = require('../controllers/ligas.controller');


router.get('/',ligasCtrl.viewLigas);
router.get('/all',ligasCtrl.getLigas);
router.get('/:id',ligasCtrl.getLigaById);
router.get('/user/:id',ligasCtrl.getLigasByUser);
router.post('/',uploadNone,ligasCtrl.createLiga);

router.put('/activar/:id',uploadNone,ligasCtrl.activarLiga);
router.put('/:id',uploadNone,ligasCtrl.updateLiga);


module.exports = router;


