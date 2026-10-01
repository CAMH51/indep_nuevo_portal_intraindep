const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/global');
const { randomUUID } = require('crypto');

const createStorage = (basePath) =>{
    return multer.diskStorage({
        destination: async function(req, file, cb){
            try {
                console.log('req.body:', req.body.uploadPath);
                console.log('file:', file);
                let dir =  path.join( await config.storagePath() + basePath);
                console.log('Ruta final:', dir);
                if(!fs.existsSync(dir)){
                    fs.mkdirSync(dir,{recursive:true});
                }
    
                cb(null,dir);
            } catch (error) {
                cb(error)
            }
        },
        filename: function(req, file, cb){
            cb(null, file.fieldname + '-' + randomUUID() + path.extname(file.originalname));
        }
        /* filename: function(req, file, cb){
            console.log('=== MULTER FILENAME ===');
            console.log('file.originalname:', file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null,file.fieldname  + '-' + uniqueSuffix + path.extname(file.originalname));
    
        } */
    });

}

const fileFilter = (req, file, cd)=>{
    console.log('file.mimetype:', file.mimetype);
    console.log('file.originalname:', file.originalname);
    const allowedTypes = /(jpeg|jpg|png|gif|pdf|doc|docx|webp|ppt|pptx|xls|xlsx|mp4|avi|txt)/i;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    console.log('Extension válida:', extname);
    console.log('Mimetype válido:', mimetype);
    if(mimetype && extname){
        return cd(null, true);
    }else{
        cd(new Error('Tipo de archivo no permitido'));
    }
};
const createUpload = (uploadPath)=>{
    return multer({
        storage:createStorage(uploadPath),
        limits:{
            fileSize:20 * 1024 * 1024   //20MB
        },
        fileFilter:fileFilter
    });
}

module.exports = {createUpload};