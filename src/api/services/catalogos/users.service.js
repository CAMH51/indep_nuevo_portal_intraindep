const {userModel} = require('../../models/associations');
const dbConnection = require('../../config/dbPostgres');

const PK = 'id_modulo';

const getUsers =async(scope = null,whereOptions={}) =>{
    try {
        const users = scope ? await userModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await userModel.findAll(whereOptions);

        return users;
    } catch (error) {
        return error;
    }
}

const getUserByEmail =async(email, userActual) =>{
    try {
        if(email === userActual){
            return {success:false,msg:"No se puede compartir paginas al mismo usuario logueado", data:[] }
        }
        const users = await userModel.findAll({where:{email:email}});

        if (users.length > 0){
            return {success:true,msg:"Usuario Correcto",data:users}
        }else{
            return {success:false,msg:"El usuario no existe",data:users}
        }
    } catch (error) {
        return error;
    }
}

const getUserById = async (id, scope=null) =>{
    try {
        
        const user = scope ? await userModel.scope(['defaultScope', scope]).findOne({where:{id_user:id}})
        : await userModel.findOne({where:{id_user:id}});

        return user;
    } catch (error) {
        return error;
    }
}

const getUserByuser = async (id, scope=null) =>{
    try {
        
        const user = scope ? await userModel.scope(['defaultScope', scope]).findAll({where:{created_by:id}})
        : await userModel.findAll({where:{created_by:id}});

        return user;
    } catch (error) {
        return error;
    }
}

const createUser = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const user = await userModel.create(data,{transaction:t});
        await t.commit();
        return user;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateUser = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const user = await userModel.update(data,{where:{id_user:id}},{transaction:t});
        await t.commit();
        return user;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarUser = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await userModel.update({activo:estatus},{where:{id_user:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}

module.exports = {
    getUsers,
    getUserByEmail,
    getUserByuser,
    getUserById,
    createUser,
    updateUser,
    activarUser
}