const express = require('express');
const router = express.Router();
 

const {generateToken} = require('../config/csrf');

const {authMiddleware} = require('../middleware/authMiddleware');
const {uploadMiddleware} = require('../middleware/upload');

router.get('/admin', (req, res) => {
   const csrfToken = generateToken(req, res);
  res.render('login',{ csrfToken });
});

router.get('/mfa',authMiddleware, (req, res) => {
  res.render('mfa');
});


router.use('/',                                         require('../routes/home.route'));
router.use('/auth',                                         require('../routes/auth.route'));
router.use('/etiquetas',                authMiddleware,     require('../routes/etiquetas.route'));
router.use('/roles',                    authMiddleware,     require('../routes/roles.route'));
router.use('/apartados',                authMiddleware,     require('../routes/apartados.route'));
router.use('/subapartados',             authMiddleware,     require('../routes/subapartados.route'));
router.use('/modulos',                  authMiddleware,     require('../routes/modulos.route'));
router.use('/storages',                 authMiddleware,     require('../routes/storages.route'));
router.use('/users',                    authMiddleware,     require('../routes/users.route'));
router.use('/paginas',                  authMiddleware,     require('../routes/paginas.route'));
router.use('/editor',                   authMiddleware,     require('../routes/editor.route'));
router.use('/noticias',                 authMiddleware,     require('../routes/noticias.route'));
router.use('/campanias_internas',       authMiddleware,     require('../routes/campanias_internas.route'));
router.use('/eventos_avisos',           authMiddleware,     require('../routes/eventos_avisos.route'));
router.use('/servicios_promociones',    authMiddleware,     require('../routes/servicios_promociones.route'));
router.use('/cumpleanios',              authMiddleware,     require('../routes/cumpleanios.route'));
router.use('/ligas',                    authMiddleware,     require('../routes/ligas.route'));
router.use('/fotogalerias',             authMiddleware,     require('../routes/fotogalerias.route'));
router.use('/ventanas_emergentes',      authMiddleware,     require('../routes/ventanas_emergentes.route'));
router.use('/avisos_importantes',       authMiddleware,     require('../routes/avisos_importantes.route'));
router.use('/rel_apartado_user',                            require('../routes/relApartadosUser.route'));
router.use('/compartir_pagina',                             require('../routes/compartir_pagina.route'));
router.use('/subastas',                 authMiddleware,     require('./subastas.route'));
router.use('/departamentos',            authMiddleware,     require('./departamentos_comunicado.route'));
router.use('/comunicados',              authMiddleware,     require('./comunicados.route'));
router.use('/sistemas',                 authMiddleware,     require('./sistemas.route'));
router.use('/manuales',                 authMiddleware,     require('./manuales.route'));
router.use('/documentos',               authMiddleware,     require('./documentos.route'));


router.use('/home', require('../routes/renderer'));

router.get('/dashboard', authMiddleware, (req, res) => {
  console.log('req.session.user', req.session.user)
  res.render('admin/dashboard',{
    page:'inicio'
  });
});

router.post('/upload',uploadMiddleware,(req, res)=>{

});

module.exports = router;