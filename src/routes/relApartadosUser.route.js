const express = require('express');
const router = express.Router();  


const relApartadoUserCtrl = require('../controllers/relApartadosUser.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/user/:id',relApartadoUserCtrl.getApartadosUser);


module.exports = router;
