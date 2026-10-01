const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');  

const fotogaleriasCtrl = require('../controllers/fotogalerias.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',fotogaleriasCtrl.viewFotogalerias);
router.get('/all',fotogaleriasCtrl.getFotogalerias);
router.get('/:id',fotogaleriasCtrl.getFotogaleriaById);
router.get('/user/:id',fotogaleriasCtrl.getFotogaleriasByUser);
router.post('/',uploadMiddleware,fotogaleriasCtrl.createFotogaleria);

router.put('/activar/:id',uploadNone,fotogaleriasCtrl.activarFotogaleria);
router.put('/:id',uploadMiddleware,fotogaleriasCtrl.updateFotogaleria);


module.exports = router;


