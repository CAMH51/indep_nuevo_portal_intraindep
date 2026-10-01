const {comunicadosModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getComunicados =async(scope = null,whereOptions={}) =>{
    try {
        const comunicados = scope ? await comunicadosModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await comunicadosModel.findAll(whereOptions);
        console.log(comunicados);
        return comunicados;
    } catch (error) {
        return error;
    }
}

const getComunicadosByUser =async(id) =>{
    try {
        const comunicados = await comunicadosModel.findAll({where:{fk_id_user:id}});
        console.log(comunicados);
        return comunicados;
    } catch (error) {
        return error;
    }
}

const getComunicadosByDepartamento =async(id) =>{
    try {
        const comunicados = await comunicadosModel.findAll({where:{fk_id_departamento_comunicado:id}});
        console.log(comunicados);
        return comunicados;
    } catch (error) {
        return error;
    }
}

const getComunicadoById = async(id, scope=null) =>{
    try {
        const comunicado = scope ? await comunicadosModel.scope(['defaultScope', scope]).findOne({where:{id_comunicado:id}})
        : await comunicadosModel.findOne({where:{id_comunicado:id}});

        return comunicado;
    } catch (error) {
        return error;
    }
}

const createComunicado = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const comunicado = await comunicadosModel.create(data,{transaction:t});
        await t.commit();
        return comunicado;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateComunicado = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const comunicado = await comunicadosModel.update(data,{where:{id_comunicado:id}},{transaction:t});
        await t.commit();
        return comunicado;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarComunicado = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await comunicadosModel.update({activo:estatus},{where:{id_comunicado:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getComunicados,
    getComunicadoById,
    getComunicadosByUser,
    createComunicado,
    updateComunicado,
    activarComunicado
}