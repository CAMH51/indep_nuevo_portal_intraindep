const {rolModel} = require('../../models/associations');
const dbConnection = require('../../config/dbPostgres');

const getRoles =async(scope = null,whereOptions={}) =>{
    try {
        const roles = scope ? await rolModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await rolModel.findAll(whereOptions);

        return roles;
    } catch (error) {
        return error;
    }
}

const getRolById = async (id, scope=null) =>{
    try {
        
        const rol = scope ? await rolModel.scope(['defaultScope', scope]).findOne({where:{id_rol:id}})
        : await rolModel.findOne({where:{id_rol:id}});

        return rol;
    } catch (error) {
        return error;
    }
}

const createRol = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const rol = await rolModel.create(data,{transaction:t});
        await t.commit();
        return rol;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateRol = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const rol = await rolModel.update(data,{where:{id_rol:id}},{transaction:t});
        await t.commit();
        return rol;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarRol = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await rolModel.update({activo:estatus},{where:{id_rol:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}

module.exports = {
    getRoles,
    getRolById,
    createRol,
    updateRol,
    activarRol
}