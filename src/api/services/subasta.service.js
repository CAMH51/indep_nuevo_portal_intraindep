const {subastaModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getSubastas =async(scope = null,whereOptions={}) =>{
    try {
        const subastas = scope ? await subastaModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await subastaModel.findAll(whereOptions);
        console.log(subastas);
        return subastas;
    } catch (error) {
        return error;
    }
}

const getSubastasByUser =async(id) =>{
    try {
        const subastas = await subastaModel.findAll({where:{fk_id_user:id}});
        console.log(subastas);
        return subastas;
    } catch (error) {
        return error;
    }
}

const getSubastaById = async(id, scope=null) =>{
    try {
        const subasta = scope ? await subastaModel.scope(['defaultScope', scope]).findOne({where:{id_subasta:id}})
        : await subastaModel.findOne({where:{id_subasta:id}});

        return subasta;
    } catch (error) {
        return error;
    }
}

const createSubasta = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const subasta = await subastaModel.create(data,{transaction:t});
        await t.commit();
        return subasta;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateSubasta = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const subasta = await subastaModel.update(data,{where:{id_subasta:id}},{transaction:t});
        await t.commit();
        return subasta;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarSubasta = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await subastaModel.update({activo:estatus},{where:{id_subasta:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getSubastas,
    getSubastasByUser,
    getSubastaById,
    createSubasta,
    updateSubasta,
    activarSubasta
}