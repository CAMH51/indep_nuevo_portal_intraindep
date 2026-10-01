const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');  


const rolesCtrl = require('../controllers/catalogos/roles.controller');


router.get('/',rolesCtrl.viewRoles);
router.get('/all',rolesCtrl.getRoles);
router.get('/:id',rolesCtrl.getRol);
router.post('/',uploadNone,rolesCtrl.createRol);
router.put('/:id',uploadNone,rolesCtrl.updateRol);
router.put('/activar/:id',uploadNone,rolesCtrl.activarRol);


module.exports = router;


