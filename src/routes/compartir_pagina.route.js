const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData'); 


const compartirPaginaCtrl = require('../controllers/compartir_pagina.controller');



router.get('/user/:id',compartirPaginaCtrl.getCompartirPaginaByUser);
router.post('/',uploadNone,compartirPaginaCtrl.createCompartirPagina);
//router.put('/:id',upload.none(),apartadosCtrl.updateApartado);
//router.put('/activar/:id',upload.none(),apartadosCtrl.activarApartado);


module.exports = router;

