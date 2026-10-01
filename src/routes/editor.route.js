const express= require('express');
const router = express.Router();
const {uploadNone} = require('../middleware/formData');      

const editorServices = require('../controllers/editor.controller');

router.get('/',uploadNone,editorServices.viewEditor);


module.exports = router;