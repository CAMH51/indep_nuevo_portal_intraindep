const {noticiaModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');


const getNoticias =async(scope = null,whereOptions={}) =>{
    try {
        const noticias = scope ? await noticiaModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await noticiaModel.findAll(whereOptions);
        console.log(noticias);
        return noticias;
    } catch (error) {
        return error;
    }
}

const getNoticiasByUser =async(id) =>{
    try {
        const noticias = await noticiaModel.findAll({where:{fk_id_user:id}});
        console.log(noticias);
        return noticias;
    } catch (error) {
        return error;
    }
}

const getNoticiaById = async(id, scope=null) =>{
    try {
        

        const noticia = scope ? await noticiaModel.scope(['defaultScope', scope]).findOne({where:{id_noticia:id}})
        : await noticiaModel.findOne({where:{id_noticia:id}});

        return noticia;
    } catch (error) {
        return error;
    }
}

const createNoticia = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const noticia = await noticiaModel.create(data,{transaction:t});
        await t.commit();
        return noticia;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateNoticia = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const noticia = await noticiaModel.update(data,{where:{id_noticia:id}},{transaction:t});
        await t.commit();
        return noticia;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarNoticia = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await noticiaModel.update({activo:estatus},{where:{id_noticia:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getNoticias,
    getNoticiaById,
    createNoticia,
    updateNoticia,
    activarNoticia,
    getNoticiasByUser
}