const {createUpload} = require('../config/multer');
// NUEVO: Middleware dinámico que procesa el upload
exports.uploadMiddleware = (req, res, next) => {
    console.log('=== UPLOAD MIDDLEWARE ===');
    console.log('Query params:', req.query);
    console.log('URL params:', req.params);
    

    try {
        
        // Obtener la ruta del query param o usar default
        const uploadPath = req.query.uploadPath || '/home/default';
        const fieldName = req.query.fieldName || 'file';
        
        console.log('Upload path:', uploadPath);
        
        // Crear el upload dinámicamente
        const upload = createUpload(uploadPath);
        console.log('Upload ', upload);
        // Ejecutar multer
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                console.error('Error en multer:', err);
                
                if (err instanceof require('multer').MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({
                            success: false,
                            msg: 'El archivo es demasiado grande. Máximo 5MB'
                        });
                    }
                    return res.status(400).json({
                        success: false,
                        msg: `Error de Multer: ${err.message}`
                    });
                }
                
                return res.status(400).json({
                    success: false,
                    msg: err.message
                });
            }
            
            next();
        });
    } catch (error) {
        console.log(error.message);
    }
};