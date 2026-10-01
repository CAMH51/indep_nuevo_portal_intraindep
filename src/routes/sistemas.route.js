const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');    


const sistemasCtrl = require('../controllers/sistemas.controller');


router.get('/',sistemasCtrl.viewSistema);
router.get('/all',sistemasCtrl.getSistemas);
router.get('/:id',sistemasCtrl.getSistemaById);
router.post('/',uploadNone,sistemasCtrl.createSistema);
router.put('/:id',uploadNone,sistemasCtrl.updateSistema);
router.put('/activar/:id',uploadNone,sistemasCtrl.activarSistema);


module.exports = router;


