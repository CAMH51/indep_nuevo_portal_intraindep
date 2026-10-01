const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');  


const cumpleaniosCtrl = require('../controllers/cumpleanios.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',cumpleaniosCtrl.viewCumpleanios);
router.get('/all',cumpleaniosCtrl.getCumpleanios);
router.get('/:id',cumpleaniosCtrl.getCumpleanioById);
router.get('/user/:id',cumpleaniosCtrl.getCumpleaniosByUser);
router.post('/',uploadMiddleware,cumpleaniosCtrl.createCumpleanio);

router.put('/activar/:id',uploadNone,cumpleaniosCtrl.activarCumpleanio);
router.put('/:id',uploadMiddleware,cumpleaniosCtrl.updateCumpleanio);


module.exports = router;


