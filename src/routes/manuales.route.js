const express = require('express');
const router = express.Router();

const manualesCtrl = require('../controllers/manuales.controller');
const {uploadMiddleware} = require('../middleware/upload');
const {authMiddleware} = require('../middleware/authMiddleware');

// Ruta pública para el portal de inicio
router.get('/sistema/:id', manualesCtrl.getManualesBySistema);

// Rutas protegidas para administración
router.get('/', authMiddleware, manualesCtrl.viewManual);
router.get('/all', authMiddleware, manualesCtrl.getManuales);
router.get('/:id', authMiddleware, manualesCtrl.getManualById);
router.post('/', authMiddleware, uploadMiddleware, manualesCtrl.createManual);
router.put('/:id', authMiddleware, uploadMiddleware, manualesCtrl.updateManual);
router.put('/activar/:id', authMiddleware, uploadMiddleware, manualesCtrl.activarManual);

module.exports = router;

