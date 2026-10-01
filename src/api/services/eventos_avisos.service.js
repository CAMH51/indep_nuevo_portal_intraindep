const {eventoAvisoModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getEventosAvisos =async(scope = null,whereOptions={}) =>{
    try {
        const eventosAvisos = scope ? await eventoAvisoModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await eventoAvisoModel.findAll(whereOptions);
        console.log(eventosAvisos);
        return eventosAvisos;
    } catch (error) {
        return error;
    }
}

const getEventosAvisosByUser =async(id) =>{
    try {
        const eventosAvisos = await eventoAvisoModel.findAll({where:{fk_id_user:id}});
        console.log(eventosAvisos);
        return eventosAvisos;
    } catch (error) {
        return error;
    }
}

const getEventoAvisoById = async(id, scope=null) =>{
    try {
        

        const evento = scope ? await eventoAvisoModel.scope(['defaultScope', scope]).findOne({where:{id_evento_aviso:id}})
        : await eventoAvisoModel.findOne({where:{id_evento_aviso:id}});

        return evento;
    } catch (error) {
        return error;
    }
}

const createEventoAviso = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const evento = await eventoAvisoModel.create(data,{transaction:t});
        await t.commit();
        return evento;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateEventoAviso = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const evento = await eventoAvisoModel.update(data,{where:{id_evento_aviso:id}},{transaction:t});
        await t.commit();
        return evento;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarEventoAviso = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await eventoAvisoModel.update({activo:estatus},{where:{id_evento_aviso:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getEventosAvisos,
    getEventoAvisoById,
    getEventosAvisosByUser,
    createEventoAviso,
    updateEventoAviso,
    activarEventoAviso
}