const {moduloModel,relRolModuloModel,relUserModuloModel} = require('../../models/associations');
const dbConnection = require('../../config/dbPostgres');


const getModulos =async(scope = null,whereOptions={}) =>{
    try {
        const modulos = scope ? await moduloModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await moduloModel.findAll(whereOptions);

        return modulos;
    } catch (error) {
        return error;
    }
}

const getModuloById = async (id, scope=null) =>{
    try {
        
        const modulo = scope ? await moduloModel.scope(['defaultScope', scope]).findOne({where:{id_modulo:id}})
        : await moduloModel.findOne({where:{id_modulo:id}});

        return modulo;
    } catch (error) {
        return error;
    }
}

const createModulo = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const modulo = await moduloModel.create(data,{transaction:t});
        await t.commit();
        return modulo;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateModulo = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const modulo = await moduloModel.update(data,{where:{id_modulo:id}},{transaction:t});
        await t.commit();
        return modulo;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarModulo = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await moduloModel.update({activo:estatus},{where:{id_modulo:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}


const getModulosUser = async (scope = null, whereOptions = {}) =>{
    try {
        const modulos = scope ? await relUserModuloModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await relUserModuloModel.findAll(whereOptions);

        return modulos;
    } catch (error) {
        return error;
    }
}

const createModuloUser = async(data) =>{
    const t = await dbConnection.transaction();
    try {
        const modulo = await relUserModuloModel.bulkCreate(data,{transaction:t});
        await t.commit();
        return modulo;
    } catch (error) {
        await t.rollback();
        return error;
    }
} 

const updateModuloUser = async(id,data) =>{
    const t = await dbConnection.transaction();
    try {
        const modulo = await relUserModuloModel.update(data,{where:{id_rel_user_modulo:id}},{transaction:t});
        await t.commit();
        return modulo;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarModuloUser = async(id,estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await relUserModuloModel.update({estatus:estatus},{where:{id_rel_user_modulo:id}},{transaction:t});
        await t.commit();
        return activar;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const getModulosRol = async (scope = null, whereOptions = {}) =>{
    try {
        const modulos = scope ? await relRolModuloModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await relRolModuloModel.findAll(whereOptions);

        return modulos;
    } catch (error) {
        return error;
    }
}

const getModulosRolById = async (id,scope = null) =>{
    try {
        const modulos = scope ? await relRolModuloModel.scope(['defaultScope', scope]).findAll({where:{fk_id_rol:id}})
        : await relRolModuloModel.findAll({where:{fk_id_rol:id}});

        return modulos;
    } catch (error) {
        return error;
    }
}

const createModuloRol = async(data) =>{
    const t = await dbConnection.transaction();
    try {
        const modulo = await relRolModuloModel.create(data,{transaction:t});
        await t.commit();
        return modulo;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateModuloRol = async(id,data) =>{
    const t = await dbConnection.transaction();
    try {
        const modulo = await relRolModuloModel.update(data,{where:{id_rel_rol_modulo:id}},{transaction:t});
        await t.commit();
        return modulo;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarModuloRol = async(id,estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await relRolModuloModel.update({estatus:estatus},{where:{id_rel_rol_modulo:id}},{transaction:t});
        await t.commit();
        return activar;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const deleteModulosByUser = async(id_user) =>{
    const t = await dbConnection.transaction();
    try {
        const deleted = await relUserModuloModel.destroy({where:{fk_id_user:id_user},transaction:t});
        await t.commit();
        return deleted;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

module.exports = {
    getModulos,
    getModuloById,
    createModulo,
    updateModulo,
    activarModulo,
    getModulosUser,
    createModuloUser,
    updateModuloUser,
    activarModuloUser,
    getModulosRol,
    getModulosRolById,
    createModuloRol,
    updateModuloRol,
    activarModuloRol,
    deleteModulosByUser
}