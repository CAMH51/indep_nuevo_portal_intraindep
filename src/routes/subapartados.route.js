const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');       


const subapartadosCtrl = require('../controllers/catalogos/subapartados.controller');


router.get('/',subapartadosCtrl.viewSubapartados);
router.get('/all',subapartadosCtrl.getSubapartados);
router.get('/:id',subapartadosCtrl.getSubapartado);
router.post('/',uploadNone,subapartadosCtrl.createSubapartado);
router.put('/:id',uploadNone,subapartadosCtrl.updateSubapartado);
router.put('/activar/:id',uploadNone,subapartadosCtrl.activarSubapartado);


module.exports = router;


