const {ventanaEmergenteModel} = require('../models/associations');
const dbConnection = require('../config/dbPostgres');
const {Op,Sequelize} = require('sequelize');
const day = require('dayjs');



const getVentanas =async(scope = null,whereOptions={}) =>{
    try {
        const ventanas = scope ? await ventanaEmergenteModel.scope(['defaultScope', scope]).findAll(whereOptions)
        : await ventanaEmergenteModel.findAll(whereOptions);
        console.log(ventanas);
        return ventanas;
    } catch (error) {
        return error;
    }
}

const getVentanaVigente =async() =>{
    try {
        const hoy = day().format('YYYY-MM-DD');
        const ventanas = await ventanaEmergenteModel.findAll({
            where:{
                activo:true,
                f_inicio:{[Op.lte]:hoy},
                f_termino:{[Op.gte]:hoy},
            },
            order:[
                ['f_registro','DESC']
            ]
        });
        console.log(ventanas);
        return ventanas;
    } catch (error) {
        return error;
    }
}

const getVentanasByUser =async(id) =>{
    try {
        const ventanas = await ventanaEmergenteModel.findAll({where:{fk_id_user:id}});
        console.log(ventanas);
        return ventanas;
    } catch (error) {
        return error;
    }
}

const getVentanaById = async(id, scope=null) =>{
    try {
        

        const ventana = scope ? await ventanaEmergenteModel.scope(['defaultScope', scope]).findOne({where:{id_ventana_emergente:id}})
        : await ventanaEmergenteModel.findOne({where:{id_ventana_emergente:id}});

        return ventana;
    } catch (error) {
        return error;
    }
}

const createVentana = async (data) =>{
    const t = await dbConnection.transaction();
    try {
        const ventana = await ventanaEmergenteModel.create(data,{transaction:t});
        await t.commit();
        return ventana;
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const updateVentana = async (id, data) =>{
    const t = await dbConnection.transaction();
    try {
        const ventana = await ventanaEmergenteModel.update(data,{where:{id_ventana_emergente:id}},{transaction:t});
        await t.commit();
        return ventana;  
    } catch (error) {
        await t.rollback();
        return error;
    }
}

const activarVentana = async (id, estatus) =>{
    const t = await dbConnection.transaction();
    try {
        const activar = await ventanaEmergenteModel.update({activo:estatus},{where:{id_ventana_emergente:id}},{transaction:t});
        await t.commit();
        return activar; 
    } catch (error) {
        await t.rollback();
        return error;
    }
}




module.exports = {
    getVentanas,
    getVentanaById,
    getVentanasByUser,
    createVentana,
    updateVentana,
    activarVentana,
    getVentanaVigente
}