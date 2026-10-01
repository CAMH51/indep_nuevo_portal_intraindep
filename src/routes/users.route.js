const express = require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');   


const usersCtrl = require('../controllers/catalogos/users.controller');


router.get('/',usersCtrl.viewUsers);
router.get('/all',usersCtrl.getUsers);
router.get('/user',usersCtrl.getUsersByUser);
router.get('/:id',usersCtrl.getUser);
router.post('/email',uploadNone,usersCtrl.getUserByEmail);
router.post('/',uploadNone,usersCtrl.createUser);
router.put('/:id',uploadNone,usersCtrl.updateUser);
router.put('/activar/:id',uploadNone,usersCtrl.activarUser);


module.exports = router;


