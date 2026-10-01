const {servicioPromocionModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getServiciosPromociones =async(scope = null,whereOptions={}) =>{
    try {
        const serviciosPromociones = scope ? await servicioPromocionModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await servicioPromocionModel.findAll(whereOptions);
        console.log(serviciosPromociones);
        return serviciosPromociones;
    } catch (error) {
        return error;
    }
}

const getServiciosPromocionesByUser =async(id) =>{
    try {
        const serviciosPromociones = await servicioPromocionModel.findAll({where:{fk_id_user:id}});
        console.log(serviciosPromociones);
        return serviciosPromociones;
    } catch (error) {
        return error;
    }
}

const getServicioPromocionById = async(id, scope=null) =>{
    try {
        

        const servicio = scope ? await servicioPromocionModel.scope(['defaultScope', scope]).findOne({where:{id_servicio_promocion:id}})
        : await servicioPromocionModel.findOne({where:{id_servicio_promocion:id}});

        return servicio;
    } catch (error) {
        return error;
    }
}

const createServicioPromocion = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const servicio = await servicioPromocionModel.create(data,{transaction:t});
        await t.commit();
        return servicio;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateServicioPromocion = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const servicio = await servicioPromocionModel.update(data,{where:{id_servicio_promocion:id}},{transaction:t});
        await t.commit();
        return servicio;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarServicioPromocion = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await servicioPromocionModel.update({activo:estatus},{where:{id_servicio_promocion:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getServiciosPromociones,
    getServicioPromocionById,
    getServiciosPromocionesByUser,
    createServicioPromocion,
    updateServicioPromocion,
    activarServicioPromocion
}