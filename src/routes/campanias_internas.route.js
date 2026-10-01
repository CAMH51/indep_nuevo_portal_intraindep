const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');   


const campaniasInternasCtrl = require('../controllers/campanias_internas.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',campaniasInternasCtrl.viewCampaniasInterna);
router.get('/all',campaniasInternasCtrl.getCampaniasInternas);
router.get('/:id',campaniasInternasCtrl.getCampaniaInternaById);
router.get('/user/:id',campaniasInternasCtrl.getCampaniasInternasByUser);
router.post('/',uploadMiddleware,campaniasInternasCtrl.createCampaniaInterna);

router.put('/activar/:id',uploadNone,campaniasInternasCtrl.activarCampañaInterna);
router.put('/:id',uploadMiddleware,campaniasInternasCtrl.updateCampaniaInterna);


module.exports = router;


