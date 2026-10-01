const {etiquetaModel} = require('../../models/associations');
const dbConnection = require('../../config/dbPostgres');



const getEtiquetas = async (scope = null,whereOptions={}) =>{
    try {
        const etiquetas = scope ? await etiquetaModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await etiquetaModel.findAll(whereOptions);

        return etiquetas;
    } catch (error) {
        return error;
    }
}

const getEtiquetaById = async (id, scope=null) =>{
    try {
        const etiqueta = scope ? await etiquetaModel.scope(['defaultScope', scope]).findOne({where:{id_etiqueta:id}})
        : await etiquetaModel.findOne({where:{id_etiqueta:id}});

        return etiqueta;
    } catch (error) {
        return error;
    }
}

const createEtiqueta = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const etiqueta = await etiquetaModel.create(data,{transaction:t});
        await t.commit();
        return etiqueta;    
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateEtiqueta = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const etiqueta = await etiquetaModel.update(data,{where:{id_etiqueta:id}},{transaction:t});
        await t.commit();
        return etiqueta;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarEtiqueta = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await etiquetaModel.update({activo:estatus},{where:{id_etiqueta:id}},{transaction:t});
        await t.commit();
        return activar;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

module.exports = {
    getEtiquetas,
    getEtiquetaById,
    createEtiqueta,
    updateEtiqueta,
    activarEtiqueta
}