const {ligaModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getLigas =async(scope = null,whereOptions={}) =>{
    try {
        const ligas = scope ? await ligaModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await ligaModel.findAll(whereOptions);
        console.log(ligas);
        return ligas;
    } catch (error) {
        return error;
    }
}

const getLigasByUser =async(id) =>{
    try {
        const ligas = await ligaModel.findAll({where:{fk_id_user:id}});
        console.log(ligas);
        return ligas;
    } catch (error) {
        return error;
    }
}

const getLigaById = async(id, scope=null) =>{
    try {
        

        const liga = scope ? await ligaModel.scope(['defaultScope', scope]).findOne({where:{id_liga:id}})
        : await ligaModel.findOne({where:{id_liga:id}});

        return liga;
    } catch (error) {
        return error;
    }
}

const createLiga = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const liga = await ligaModel.create(data,{transaction:t});
        await t.commit();
        return liga;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateLiga = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const liga = await ligaModel.update(data,{where:{id_liga:id}},{transaction:t});
        await t.commit();
        return liga;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarLiga = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await ligaModel.update({activo:estatus},{where:{id_liga:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getLigas,
    getLigaById,
    getLigasByUser,
    createLiga,
    updateLiga,
    activarLiga
}