const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');     


const modulosCtrl = require('../controllers/catalogos/modulos.controller');


router.get('/',modulosCtrl.viewModulos);
router.get('/all',modulosCtrl.getModulos);
router.get('/rol/:id',modulosCtrl.getModuloByRol);
router.get('/user/:id',modulosCtrl.getModulosByUser);
router.get('/:id',modulosCtrl.getModulo);
router.post('/',uploadNone,modulosCtrl.createModulo);
router.put('/:id',uploadNone,modulosCtrl.updateModulo);
router.put('/activar/:id',uploadNone,modulosCtrl.activarModulo);


module.exports = router;



