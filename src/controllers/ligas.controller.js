
const ligasServices = require('../api/services/ligas.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');


const viewLigas = async(req, res)=>{
    const ligas = await ligasServices.getLigas();
    res.render('admin/dashboard',{
        page:'/ligas/index',
    })
}

const getLigas = async(req, res)=>{
    try {
        const registros = await ligasServices.getLigas();;
        console.log(registros);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getLigasByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await ligasServices.getLigasByUser(id);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getLigaById = async(req, res)=>{
    try {
        const {id} = req.params;
        const registro = await ligasServices.getLigaById(id);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createLiga = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataLiga = {
            nombre_liga:req.body.nombre_liga,
            url_liga:req.body.url_liga,
            fk_id_pagina:req.body.pagina || null,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const registro = await ligasServices.createLiga(dataLiga);

        await createBitacora('NUEVO/LINK',`${JSON.stringify(registro)}`,req.session.user.id_user);

        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateLiga = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataLiga = {
            nombre_liga:req.body.editNombreLiga,
            url_liga:req.body.editUrlLiga,
            fk_id_pagina:req.body.editPagina || null,
            f_modificacion: new Date()
        }
        const registro = await ligasServices.updateLiga(id,dataLiga);
        await createBitacora('EDITAR/LINK',`${JSON.stringify(registro)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarLiga = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('ACTIVAR/LINK',`Liga Id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await ligasServices.activarLiga(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewLigas,
    getLigas,
    getLigasByUser,
    getLigaById,
    createLiga,
    updateLiga,
    activarLiga
};