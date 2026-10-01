const {cumpleanioModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getCumpleanios =async(scope = null,whereOptions={}) =>{
    try {
        const cumpleanios = scope ? await cumpleanioModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await cumpleanioModel.findAll(whereOptions);
        console.log(cumpleanios);
        return cumpleanios;
    } catch (error) {
        return error;
    }
}

const getCumpleaniosByUser =async(id) =>{
    try {
        const cumpleanios = await cumpleanioModel.findAll({where:{fk_id_user:id}});
        console.log(cumpleanios);
        return cumpleanios;
    } catch (error) {
        return error;
    }
}

const getCumpleanioById = async(id, scope=null) =>{
    try {
        

        const cumpleanio = scope ? await cumpleanioModel.scope(['defaultScope', scope]).findOne({where:{id_cumpleanio:id}})
        : await cumpleanioModel.findOne({where:{id_cumpleanio:id}});

        return cumpleanio;
    } catch (error) {
        return error;
    }
}

const createCumpleanio = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const cumpleanio = await cumpleanioModel.create(data,{transaction:t});
        await t.commit();
        return cumpleanio;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateCumpleanio = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const cumpleanio = await cumpleanioModel.update(data,{where:{id_cumpleanio:id}},{transaction:t});
        await t.commit();
        return cumpleanio;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarCumpleanio = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await cumpleanioModel.update({activo:estatus},{where:{id_cumpleanio:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getCumpleanios,
    getCumpleanioById,
    getCumpleaniosByUser,
    createCumpleanio,
    updateCumpleanio,
    activarCumpleanio
}