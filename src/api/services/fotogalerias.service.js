const {fotogaleriaModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getFotografias =async(scope = null,whereOptions={}) =>{
    try {
        const fotografias = scope ? await fotogaleriaModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await fotogaleriaModel.findAll(whereOptions);
        console.log(fotografias);
        return fotografias;
    } catch (error) {
        return error;
    }
}

const getFotografiasByUser =async(id) =>{
    try {
        const fotografias = await fotogaleriaModel.findAll({where:{fk_id_user:id}});
        console.log(fotografias);
        return fotografias;
    } catch (error) {
        return error;
    }
}

const getFotografiaById = async(id, scope=null) =>{
    try {
        

        const fotografia = scope ? await fotogaleriaModel.scope(['defaultScope', scope]).findOne({where:{id_fotogaleria:id}})
        : await fotogaleriaModel.findOne({where:{id_fotogaleria:id}});

        return fotografia;
    } catch (error) {
        return error;
    }
}

const createFotografia = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const fotografia = await fotogaleriaModel.create(data,{transaction:t});
        await t.commit();
        return fotografia;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateFotografia = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const fotografia = await fotogaleriaModel.update(data,{where:{id_fotogaleria:id}},{transaction:t});
        await t.commit();
        return fotografia;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarFotografia = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await fotogaleriaModel.update({activo:estatus},{where:{id_fotogaleria:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getFotografias,
    getFotografiaById,
    getFotografiasByUser,
    createFotografia,
    updateFotografia,
    activarFotografia
}