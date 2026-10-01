const express = require('express');
const router = express.Router();


const subastasCtrl = require('../controllers/subastas.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',subastasCtrl.viewSubasta);
router.get('/all',subastasCtrl.getSubastas);
router.get('/:id',subastasCtrl.getSubastaById);
router.post('/',uploadMiddleware,subastasCtrl.createSubasta);
router.put('/:id',uploadMiddleware,subastasCtrl.updateSubasta);
router.put('/activar/:id',uploadMiddleware,subastasCtrl.activarSubasta);


module.exports = router;


