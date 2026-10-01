
const noticiasServices = require('../api/services/noticias.service');
const etiquetasServices = require('../api/services/catalogos/etiquetas.service');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');
const noticia = require('../api/models/noticia.model');

const viewNoticias = async(req, res)=>{
    const etiquetas = await etiquetasServices.getEtiquetas();
    res.render('admin/dashboard',{
        etiquetas,
        page:'/noticias/index'
    })
}

const getNoticias = async(req, res)=>{
    try {
        const noticias = await noticiasServices.getNoticias();;
        console.log(noticias);
        res.status(200).json({success:true,data:noticias});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getNoticiaByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const noticia = await noticiasServices.getNoticiasByUser(id);
        res.status(200).json({success:true,data:noticia});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getNoticiaById = async(req, res)=>{
    try {
        const {id} = req.params;
        const noticia = await noticiasServices.getNoticiaById(id);
        res.status(200).json({success:true,data:noticia});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createNoticia = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataNoticia = {
            titulo:req.body.titulo,
            descripcion:req.body.descripcion,
            fk_id_archivo:null,
            fk_id_pagina:req.body.pagina || null,
            fk_id_etiqueta:req.body.etiqueta,
            fk_id_user: req.session.user.id_user,
            url_pagina:req.body.url_externa || null,
            f_modificacion: new Date()
        }
        
        const noticia = await noticiasServices.createNoticia(dataNoticia);
        console.log('noticia',noticia.dataValues.id_noticia);

        await createBitacora('NUEVO/NOTICIAS',`${JSON.stringify(noticia)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await noticiasServices.updateNoticia(noticia.dataValues.id_noticia,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:noticia});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateNoticia = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataNoticia = {
            titulo:req.body.editTitulo,
            descripcion:req.body.editDescripcion,
            fk_id_etiqueta:req.body.editEtiqueta,
            fk_id_pagina:req.body.editPagina || null,
            url_pagina:req.body.editUrlExterna || null,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await noticiasServices.updateNoticia(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        const noticia = await noticiasServices.updateNoticia(id,dataNoticia);
        await createBitacora('EDITAR/NOTICIA',`${JSON.stringify(noticia)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:noticia});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarNoticia = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('EDITAR/NOTICIA',`Noticia id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await noticiasServices.activarNoticia(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewNoticias,
    getNoticiaByUser,
    getNoticias,
    getNoticiaById,
    createNoticia,
    updateNoticia,
    activarNoticia
};