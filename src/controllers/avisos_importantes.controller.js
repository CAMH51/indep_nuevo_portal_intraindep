
const avisosServices = require('../api/services/avisos_importantes.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');


const viewavisos = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/avisos_importantes/index'
    })
}

const getAvisos = async(req, res)=>{
    try {
        const registros = await avisosServices.getAvisos();;
        console.log(registros);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getAvisosByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await avisosServices.getAvisosByUser(id);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getAvisoById = async(req, res)=>{
    try {
        const {id} = req.params;
        const registro = await avisosServices.getAvisoById(id);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createAviso = async(req, res)=>{
    try {

        console.log('req.body',req.body);
        const {titulo,descripcion,pagina,url_pagina,f_inicio,f_termino} = req.body;
        const dataAviso = {
            titulo,
            descripcion,
            f_inicio,
            f_termino,
            fk_id_pagina:pagina || null,
            url_pagina:url_pagina || null,
            fk_id_user: req.session.user.id_user
        }
        
        const registro = await avisosServices.createAviso(dataAviso);

        await createBitacora('NUEVA/AVISOS IMPORTANTES',`${JSON.stringify(registro)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateAviso = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataAviso = {
            titulo:req.body.editTitulo,
            descripcion:req.body.editDescripcion,
            f_inicio:req.body.editFInicio,
            f_termino:req.body.editFTermino,
            fk_id_pagina:req.body.editPagina || null,
            url_pagina:req.body.editUrlPagina || null,
            f_modificacion: new Date()
        }

        const registro = await avisosServices.updateAviso(id,dataAviso);
        await createBitacora('EDITAR/AVISOS IMPORTANTES',`${JSON.stringify(registro)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarAviso = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('ACTIVAR/AVISO IMPORTANTE',`Aviso Importante Id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await avisosServices.activarAviso(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewavisos,
    getAvisos,
    getAvisosByUser,
    getAvisoById,
    createAviso,
    updateAviso,
    activarAviso
};