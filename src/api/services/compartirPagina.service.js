const {compartirPagina} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');

const validarPaginaCompartida = async(id_pagina, id_user) =>{
    try {
        const validar = await compartirPagina.findAll({where:{fk_id_pagina:id_pagina,fk_id_user:id_user}})
        return validar;
    } catch (error) {
        return error;
    }
}

const getPaginasCompartidasByUser =async(id) =>{
    try {
        const paginas = await compartirPagina.findAll({where:{fk_id_user:id}});
        //console.log(paginas);
        return paginas;
    } catch (error) {
        return error;
    }
}


const createCompartirPagina = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const pagina = await compartirPagina.create(data,{transaction:t});
        await t.commit();
        return pagina;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateCompartirPagina = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const pagina = await compartirPagina.update(data,{where:{id_compartir_pagina:id}},{transaction:t});
        await t.commit();
        return pagina;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarCompartirPagina = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await compartirPagina.update({activo:estatus},{where:{id_compartir_pagina:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    validarPaginaCompartida,
    getPaginasCompartidasByUser,
    createCompartirPagina,
    updateCompartirPagina,
    activarCompartirPagina
}