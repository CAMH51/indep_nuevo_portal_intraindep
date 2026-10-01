const {campaniaInternaModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getCampaniasInternas =async(scope = null,whereOptions={}) =>{
    try {
        const campaniasInternas = scope ? await campaniaInternaModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await campaniaInternaModel.findAll(whereOptions);
        console.log(campaniasInternas);
        return campaniasInternas;
    } catch (error) {
        return error;
    }
}

const getCampaniasInternasByUser =async(id) =>{
    try {
        const campaniasInternas = await campaniaInternaModel.findAll({where:{fk_id_user:id}});
        console.log(campaniasInternas);
        return campaniasInternas;
    } catch (error) {
        return error;
    }
}

const getCampaniaInternaById = async(id, scope=null) =>{
    try {
        

        const campania = scope ? await campaniaInternaModel.scope(['defaultScope', scope]).findOne({where:{id_campania_interna:id}})
        : await campaniaInternaModel.findOne({where:{id_campania_interna:id}});

        return campania;
    } catch (error) {
        return error;
    }
}

const createCampaniaInterna = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const campania = await campaniaInternaModel.create(data,{transaction:t});
        await t.commit();
        return campania;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateCampaniaInterna = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const campania = await campaniaInternaModel.update(data,{where:{id_campania_interna:id}},{transaction:t});
        await t.commit();
        return campania;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarCampaniaInterna = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await campaniaInternaModel.update({activo:estatus},{where:{id_campania_interna:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getCampaniaInternaById,
    getCampaniasInternas,
    getCampaniasInternasByUser,
    createCampaniaInterna,
    updateCampaniaInterna,
    activarCampaniaInterna
}