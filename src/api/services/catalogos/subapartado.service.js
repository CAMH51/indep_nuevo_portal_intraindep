const {subapartadoModel} = require('../../models/associations');
const dbConnection = require('../../config/dbPostgres');

const PK = 'id_subapartado';

const getSubapartados =async(scope = null,whereOptions={}) =>{
    try {
        const subapartados = scope ? await subapartadoModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await subapartadoModel.findAll(whereOptions);

        return subapartados;
    } catch (error) {
        return error;
    }
}

const getSubapartadoById = async (id, scope=null) =>{
    try {
        
        const subapartado = scope ? await subapartadoModel.scope(['defaultScope', scope]).findOne({where:{id_subapartado:id}})
        : await subapartadoModel.findOne({where:{id_subapartado:id}});

        return subapartado;
    } catch (error) {
        return error;
    }
}

const createSubapartado = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const subapartado = await subapartadoModel.create(data,{transaction:t});
        await t.commit();
        return subapartado;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateSubapartado = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const subapartado = await subapartadoModel.update(data,{where:{id_subapartado:id}},{transaction:t});
        await t.commit();
        return subapartado;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarSubapartado = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await subapartadoModel.update({activo:estatus},{where:{id_subapartado:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}

module.exports = {
    getSubapartados,
    getSubapartadoById,
    createSubapartado,
    updateSubapartado,
    activarSubapartado
}