const {sistemasModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getSistemas =async(scope = null,whereOptions={}) =>{
    try {
        const sistemas = scope ? await sistemasModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await sistemasModel.findAll(whereOptions);
        console.log(sistemas);
        return sistemas;
    } catch (error) {
        return error;
    }
}

const getSistemasByUser =async(id) =>{
    try {
        const sistemas = await sistemasModel.findAll({where:{fk_id_user:id}});
        console.log(sistemas);
        return sistemas;
    } catch (error) {
        return error;
    }
}

const getSistemaById = async(id, scope=null) =>{
    try {
        const sistema = scope ? await sistemasModel.scope(['defaultScope', scope]).findOne({where:{id_sistema:id}})
        : await sistemasModel.findOne({where:{id_sistema:id}});

        return sistema;
    } catch (error) {
        return error;
    }
}

const createSistema = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const sistema = await sistemasModel.create(data,{transaction:t});
        await t.commit();
        return sistema;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateSistema = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const sistema = await sistemasModel.update(data,{where:{id_sistema:id}},{transaction:t});
        await t.commit();
        return sistema;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarSistema = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await sistemasModel.update({activo:estatus},{where:{id_sistema:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getSistemas,
    getSistemaById,
    getSistemasByUser,
    createSistema,
    updateSistema,
    activarSistema
}