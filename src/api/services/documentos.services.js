const {documentosModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getDocumentos =async(scope = null,whereOptions={}) =>{
    try {
        const documentos = scope ? await documentosModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await documentosModel.findAll(whereOptions);
        console.log(documentos);
        return documentos;
    } catch (error) {
        return error;
    }
}

const getDocumentosByUser =async(id) =>{
    try {
        const documentos = await documentosModel.findAll({where:{fk_id_user:id}});
        console.log(documentos);
        return documentos;
    } catch (error) {
        return error;
    }
}

const getDocumentoById = async(id, scope=null) =>{
    try {
        

        const documento = scope ? await documentosModel.scope(['defaultScope', scope]).findOne({where:{id_documento:id}})
        : await documentosModel.findOne({where:{id_documento:id}});

        return documento;
    } catch (error) {
        return error;
    }
}

const createDocumento = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const documento = await documentosModel.create(data,{transaction:t});
        await t.commit();
        return documento;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateDocumento = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const documento = await documentosModel.update(data,{where:{id_documento:id}},{transaction:t});
        await t.commit();
        return documento;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarDocumento = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await documentosModel.update({activo:estatus},{where:{id_documento:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getDocumentos,
    getDocumentosByUser,
    getDocumentoById,
    createDocumento,
    updateDocumento,
    activarDocumento
}