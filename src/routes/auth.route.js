const express= require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');    

const {generateToken, doubleCsrfProtection } = require('../config/csrf');

const authCtrl = require('../controllers/auth.controller');

router.post('/login',doubleCsrfProtection,uploadNone,authCtrl.login);
router.post('/refresh',uploadNone,authCtrl.refreshAD);
router.post('/logout',uploadNone,authCtrl.logout);
//router.post('/verificar-otp',upload.none(),authCtrl.verificarOTP);


module.exports = router;