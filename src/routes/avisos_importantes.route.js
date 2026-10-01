const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');   


const avisosCtrl = require('../controllers/avisos_importantes.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('/',avisosCtrl.viewavisos);
router.get('/all',avisosCtrl.getAvisos);
router.get('/:id',avisosCtrl.getAvisoById);
router.get('/user/:id',avisosCtrl.getAvisosByUser);
router.post('/',uploadNone,avisosCtrl.createAviso);

router.put('/activar/:id',uploadNone,avisosCtrl.activarAviso);
router.put('/:id',uploadNone,avisosCtrl.updateAviso);


module.exports = router;


