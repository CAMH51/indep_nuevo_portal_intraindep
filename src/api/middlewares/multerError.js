const multer = require('multer');

class FileUploadError extends Error{
    constructor(message, statusCode = 400, code='FILE_ERROR'){
        super(message);
        this.name = 'FileUploadError';
        this.statusCode = statusCode;
        this.code = code;
    }
}

const manejarMulterError = (err, req, res, next)=>{
    console.log('Error:', err);
    if(!err){
        return next();
    }

    if(err instanceof multer.MulterError){
        switch(err.code){
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    success:false,
                    error:'LIMIT_FILE_SIZE',
                    msg:"El archivo excede el tamaño máximo permitido",
                    details:"Tamaño máximo: 5MB"
                });
            case 'LIMIT_PART_COUNT':
                return res.status(400).json({
                    success:false,
                    error:'LIMIT_PART_COUNT',
                    msg:"Demasiadas partes en la solicitud",
                });
            case 'LIMIT_FIELD_VALUE':
                return res.status(400).json({
                    success:false,
                    error:'LIMIT_FIELD_VALUE',
                    msg:"El valor del campo es demasiado largo",
                });
            default:
                return  res.status(400).json({
                    success:false,
                    error:err.code,
                    msg:"Error al procesar el archivo",
                    details:err.message
                });
        }
    }

    if(err.message && err.message.includes('Tipo de archivo')){
        return res.status(400).json({
            success:false,
            error:'INVALID_FILE_TYPE',
            message:err.message
        })
    }
}

module.exports = {
    manejarMulterError,
    FileUploadError
}