const servicio = require('../services/postgres.services');
const  storageModel = require('../models/stogares.model');

const setUploadPath = (path) =>{
    return async (req, res, next) =>{
        const storage = await servicio.getData(storageModel,"",{activo:true});
        req.uploadPath = storage.data[0].base_path + path;
        next();
    }
}

module.exports = setUploadPath;