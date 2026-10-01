const {avisoImportanteModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');
const {Op,Sequelize} = require('sequelize');
const day = require('dayjs');


const getAvisos =async(scope = null,whereOptions={}) =>{
    try {
        const avisos = scope ? await avisoImportanteModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await avisoImportanteModel.findAll(whereOptions);
        console.log(avisos);
        return avisos;
    } catch (error) {
        return error;
    }
}

const getAvisosVigentes =async() =>{
    try {
        const hoy = day().format('YYYY-MM-DD');
        const avisos = await avisoImportanteModel.findAll({
            where:{
                activo:true,
                [Op.and]:[
                    { f_inicio: { [Op.lte]: hoy } },     // f_inicio <= hoy
                    { f_termino: { [Op.gte]: hoy } },    // f_termino >= hoy
                    Sequelize.where(
                        Sequelize.col('f_inicio'),
                        Op.lte,
                        Sequelize.col('f_termino')
                    )
                ]
        },
        order:[
            ['f_registro','DESC']
        ]
    });
        console.log(avisos);
        return avisos;
    } catch (error) {
        return error;
    }
}

const getAvisosByUser =async(id) =>{
    try {
        const avisos = await avisoImportanteModel.findAll({where:{fk_id_user:id}});
        console.log(avisos);
        return avisos;
    } catch (error) {
        return error;
    }
}

const getAvisoById = async(id, scope=null) =>{
    try {
        

        const aviso = scope ? await avisoImportanteModel.scope(['defaultScope', scope]).findOne({where:{id_aviso:id}})
        : await avisoImportanteModel.findOne({where:{id_aviso:id}});

        return aviso;
    } catch (error) {
        return error;
    }
}

const createAviso = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const aviso = await avisoImportanteModel.create(data,{transaction:t});
        await t.commit();
        return aviso;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateAviso = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const aviso = await avisoImportanteModel.update(data,{where:{id_aviso:id}},{transaction:t});
        await t.commit();
        return aviso;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarAviso = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await avisoImportanteModel.update({activo:estatus},{where:{id_aviso:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getAvisos,
    getAvisoById,
    getAvisosByUser,
    createAviso,
    updateAviso,
    activarAviso,
    getAvisosVigentes
}