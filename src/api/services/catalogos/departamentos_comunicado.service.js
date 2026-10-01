const {departamentosComunicados} = require('../../models/associations');
const dbConnection = require('../../config/dbPostgres');



const getDepartamentos = async (scope = null,whereOptions={}) =>{
    try {
        const departamentos = scope ? await departamentosComunicados.scope(['defaultScope', scope]).findAll(whereOptions)
        : await departamentosComunicados.findAll(whereOptions);

        return departamentos;
    } catch (error) {
        return error;
    }
}

const getDepartamentoById = async (id, scope=null) =>{
    try {
        const departamento = scope ? await departamentosComunicados.scope(['defaultScope', scope]).findOne({where:{id_departamento_comunicado:id}})
        : await departamentosComunicados.findOne({where:{id_departamento_comunicado:id}});

        return departamento;
    } catch (error) {
        return error;
    }
}

const createDepartamento = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const departamento = await departamentosComunicados.create(data,{transaction:t});
        await t.commit();
        return departamento;    
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateDepartamento = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const departamento = await departamentosComunicados.update(data,{where:{id_departamento_comunicado:id}},{transaction:t});
        await t.commit();
        return departamento;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarDepartamento = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await departamentosComunicados.update({activo:estatus},{where:{id_departamento_comunicado:id}},{transaction:t});
        await t.commit();
        return activar;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

module.exports = {
    getDepartamentos,
    getDepartamentoById,
    getDepartamentoById,
    createDepartamento,
    updateDepartamento,
    activarDepartamento
}