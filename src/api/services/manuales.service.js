const {manualesSistemas} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getManuales =async(scope = null,whereOptions={}) =>{
    try {
        const manuales = scope ? await manualesSistemas.scope(['defaultScope', scope]).findAll(whereOptions)
        : await manualesSistemas.findAll(whereOptions);
        console.log(manuales);
        return manuales;
    } catch (error) {
        return error;
    }
}

const getManuelasByUser =async(id) =>{
    try {
        const manuales = await manualesSistemas.findAll({where:{fk_id_user:id}});
        console.log(manuales);
        return manuales;
    } catch (error) {
        return error;
    }
}

const getManualesBySistema =async(id) =>{
    try {
        const manuales = await manualesSistemas.findAll({where:{fk_id_sistema:id, activo:true}});
        console.log(manuales);
        return manuales;
    } catch (error) {
        throw error;
    }
}

const getManualById = async(id, scope=null) =>{
    try {
        const manual = scope ? await manualesSistemas.scope(['defaultScope', scope]).findOne({where:{id_manual_sistema:id}})
        : await manualesSistemas.findOne({where:{id_manual_sistema:id}});

        return manual;
    } catch (error) {
        return error;
    }
}

const createManual = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const manual = await manualesSistemas.create(data,{transaction:t});
        await t.commit();
        return manual;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateManual = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const manual = await manualesSistemas.update(data,{where:{id_manual_sistema:id}},{transaction:t});
        await t.commit();
        return manual;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarManual = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await manualesSistemas.update({activo:estatus},{where:{id_manual_sistema:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getManuales,
    getManualById,
    getManuelasByUser,
    getManualesBySistema,
    createManual,
    updateManual,
    activarManual
}