const express = require('express');
const router = express.Router();

const homeCtrl = require('../controllers/home.controller');
const {uploadMiddleware} = require('../middleware/upload');


router.get('prueba',homeCtrl.viewHomePrincipal);
router.get('/dos',homeCtrl.viewHome2);
router.get('/',homeCtrl.viewHomePrincipal)

module.exports = router;


