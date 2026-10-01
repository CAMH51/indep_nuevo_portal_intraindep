
const serviciosPromocionesServices = require('../api/services/servicios_promociones.service');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');


const viewServiciosPromociones = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/servicios_promociones/index'
    })
}

const getServiciosPromociones = async(req, res)=>{
    try {
        const registros = await serviciosPromocionesServices.getServiciosPromociones();;
        console.log(registros);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getServiciosPromocionesByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await serviciosPromocionesServices.getServiciosPromocionesByUser(id);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getServicioPromocionById = async(req, res)=>{
    try {
        const {id} = req.params;
        const registro = await serviciosPromocionesServices.getServicioPromocionById(id);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createServicioPromocion = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataServicioPromocion = {
            titulo:req.body.titulo,
            descripcion:req.body.descripcion,
            fk_id_archivo:null,
            fk_id_pagina:req.body.pagina || null,
            url_pagina:req.body.url_externa || null,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const registro = await serviciosPromocionesServices.createServicioPromocion(dataServicioPromocion);

        await createBitacora('NUEVO/SERVICIO Y PROMOCIÓN',`${JSON.stringify(registro)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await serviciosPromocionesServices.updateServicioPromocion(registro.dataValues.id_servicio_promocion,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateServicioPromocion = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataServicioPromocion = {
            titulo:req.body.editTitulo,
            descripcion:req.body.editDescripcion,
            fk_id_pagina:req.body.editPagina || null,
            url_pagina:req.body.editUrlExterna || null,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await serviciosPromocionesServices.updateServicioPromocion(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        const registro = await serviciosPromocionesServices.updateServicioPromocion(id,dataServicioPromocion);
        await createBitacora('EDITAR/SERVICIO Y PROMOCIÓN',`${JSON.stringify(registro)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarServicioPromocion = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('ACTIVAR/SERVICIO Y PROMOCIÓN',`Servicio y promoción Id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await serviciosPromocionesServices.activarServicioPromocion(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewServiciosPromociones,
    getServiciosPromociones,
    getServiciosPromocionesByUser,
    getServicioPromocionById,
    createServicioPromocion,
    updateServicioPromocion,
    activarServicioPromocion

};