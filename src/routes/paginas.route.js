const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');   


const paginasCtrl = require('../controllers/paginas.controller');


router.get('/',paginasCtrl.viewPaginas);
router.get('/user',paginasCtrl.getPaginasByUser);
router.get('/all',paginasCtrl.getPaginas);
router.get('/:id',paginasCtrl.getPaginaById);
router.post('/',uploadNone,paginasCtrl.createPagina);
router.put('/:id',uploadNone,paginasCtrl.updatePagina);
router.put('/activar/:id',uploadNone,paginasCtrl.activarPagina);


module.exports = router;


