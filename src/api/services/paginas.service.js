const {paginaModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');

const getPaginas =async(scope = null,whereOptions={}) =>{
    try {
        const paginas = scope ? await paginaModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await paginaModel.findAll(whereOptions);

        return paginas;
    } catch (error) {
        return error;
    }
}

const getPaginaById = async (id, scope=null) =>{
    try {
        
        const pagina = scope ? await paginaModel.scope(['defaultScope', scope]).findOne({where:{id_pagina:id}})
        : await paginaModel.findOne({where:{id_pagina:id}});

        return pagina;
    } catch (error) {
        return error;
    }
}

const createPagina = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const pagina = await paginaModel.create(data,{transaction:t});
        await t.commit();
        return pagina;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updatePagina = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const pagina = await paginaModel.update(data,{where:{id_pagina:id}},{transaction:t});
        await t.commit();
        return pagina;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarPagina = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await paginaModel.update({activo:estatus},{where:{id_pagina:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}

module.exports = {
    getPaginas,
    getPaginaById,
    createPagina,
    updatePagina,
    activarPagina
}