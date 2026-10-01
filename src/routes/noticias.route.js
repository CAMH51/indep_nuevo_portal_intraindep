const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');  

const noticiasCtrl = require('../controllers/noticias.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',noticiasCtrl.viewNoticias);
router.get('/all',noticiasCtrl.getNoticias);
router.get('/:id',noticiasCtrl.getNoticiaById);
router.get('/user/:id',noticiasCtrl.getNoticiaByUser);
router.post('/',uploadMiddleware,noticiasCtrl.createNoticia);

router.put('/activar/:id',uploadNone,noticiasCtrl.activarNoticia);
router.put('/:id',uploadMiddleware,noticiasCtrl.updateNoticia);


module.exports = router;


