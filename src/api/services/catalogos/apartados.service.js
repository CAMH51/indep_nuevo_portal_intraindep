const {apartadoModel, subapartadoModel, relApartadoUser} = require('../../models/associations');
const dbConnection = require('../../config/dbPostgres');
const { Op } = require('sequelize');

const getApartados =async(scope = null,whereOptions={}) =>{
    try {
        const apartados = scope ? await apartadoModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await apartadoModel.findAll(whereOptions);

        return apartados;
    } catch (error) {
        return error;
    }
}

const getApartadoById = async (id, scope=null) =>{
    try {
        
        const apartado = scope ? await apartadoModel.scope(['defaultScope', scope]).findOne({where:{id_apartado:id}})
        : await apartadoModel.findOne({where:{id_apartado:id}});

        return apartado;
    } catch (error) {
        return error;
    }
}


const getBySubapartados = async(scope=null,whereOptions={})=>{
    const apartados = scope ? await apartadoModel.scope(['defaultScope', scope]).findAll(whereOptions)
    : await apartadoModel.findAll(whereOptions);

    const subapartados = scope ? await subapartadoModel.scope(['defaultScope', scope]).findAll(whereOptions)
    : await subapartadoModel.findAll(whereOptions);

    const jsonData = apartados.map(apartado =>{
        return {
            apartado:apartado,
            subapartado:subapartados.filter(sub =>sub.fk_id_apartado === apartado.id_apartado)
        }
    });

    return jsonData;
}

const getByApartadosAsignadosSubapartados = async(scope=null,whereOptions={},apartadosIds=null)=>{


    const apartadosConSubapartados = await subapartadoModel.findAll({
        where: {
            fk_id_apartado:{
                [Op.in]: apartadosIds
            }
        },
    });


    return apartadosConSubapartados;
}

const createApartado = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const apartado = await apartadoModel.create(data,{transaction:t});
        await t.commit();
        return apartado;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateApartado = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const apartado = await apartadoModel.update(data,{where:{id_apartado:id}},{transaction:t});
        await t.commit();
        return apartado;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarApartado = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await apartadoModel.update({activo:estatus},{where:{id_apartado:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const createApartadoByUser = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const apartados = await relApartadoUser.bulkCreate(data,{transaction:t});
        await t.commit();
        return apartados;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const getApartadosUserById = async (id, scope=null) =>{
    try {
        
        const apartados = await relApartadoUser.findAll({where:{fk_id_user:id}});

        return apartados;
    } catch (error) {
        return error;
    }
}

const getApartadosByUserAndAsignados = async (id, scope=null) =>{
    try {
        
        const asignados = await relApartadoUser.findAll({where:{fk_id_user:id}});
        const apartadosAsignados = asignados.map(asignado => asignado.apartado);
        console.log('apartadosAsignados',apartadosAsignados);
        const apartados = await apartadoModel.findAll({where:{fk_id_user:id}});
        const totalApartados = [...apartados,...apartadosAsignados];

        return totalApartados;
    } catch (error) {
        return error;
    }
}

const deleteApartadosByUser = async (id_user) =>{
    const t = await dbConnection.transaction();
    try {
        const deleted = await relApartadoUser.destroy({where:{fk_id_user:id_user},transaction:t});
        await t.commit();
        return deleted;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

module.exports = {
    getApartados,
    getApartadoById,
    createApartado,
    updateApartado,
    activarApartado,
    getBySubapartados,
    createApartadoByUser,
    getApartadosUserById,
    getApartadosByUserAndAsignados,
    getByApartadosAsignadosSubapartados,
    deleteApartadosByUser
}