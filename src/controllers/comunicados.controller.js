
const comunicadosServices = require('../api/services/comunicados.service');
const archivosServices = require('../api/services/archivo.service');
const departamentosServices = require('../api/services/catalogos/departamentos_comunicado.service')
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');




const viewComunicado = async(req, res)=>{
    const departamentos = await departamentosServices.getDepartamentos();

    console.log('departamentos',departamentos);
    res.render('admin/dashboard',{
        departamentos,
        page:'/comunicados/index'
    })
}

const getComunicados = async(req, res)=>{
    try {
        const comunicados = await comunicadosServices.getComunicados();;
        res.status(200).json({success:true,data:comunicados});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getComunicadosByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const comunicados = await comunicadosServices.getComunicadosByUser(id);
        res.status(200).json({success:true,data:comunicados});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getComunicadosByDepartamento = async(req, res)=>{
    try {
        const {id} = req.params;
        const comunicados = await comunicadosServices.getComunicadosByDepartamento(id);
        res.status(200).json({success:true,data:comunicados});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getComunicadoById = async(req, res)=>{
    try {
        const {id} = req.params;
        const comunicado = await comunicadosServices.getComunicadoById(id);
        res.status(200).json({success:true,data:comunicado});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createComunicado = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataComunicado = {
            url_comunicado:req.body.url_comunicado || null,
            fk_id_archivo:null,
            fk_id_pagina:req.body.pagina || null,
            fk_id_departamento_comunicado:req.body.departamento_comunicado,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const comunicado = await comunicadosServices.createComunicado(dataComunicado);

        console.log('create comunicado',comunicado)

        await createBitacora('NUEVO/COMUNICADO',`${JSON.stringify(comunicado)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await comunicadosServices.updateComunicado(comunicado.dataValues.id_comunicado,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:comunicado});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateComunicado = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataComunicado = {
            url_comunicado:req.body.editUrlComunicado,
            fk_id_pagina:req.body.editPagina || null,
            fk_id_departamento_comunicado:req.body.editDepartamentoComunicado,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await comunicadosServices.updateComunicado(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        const comunicado = await comunicadosServices.updateComunicado(id,dataComunicado);
        await createBitacora('EDITAR/COMUNICADO',`${JSON.stringify(comunicado)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:comunicado});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarComunicado = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('EDITAR/COMUNICADO',`Comunicado id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await comunicadosServices.activarComunicado(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewComunicado,
    getComunicados,
    getComunicadoById,
    getComunicadosByUser,
    getComunicadosByDepartamento,
    createComunicado,
    updateComunicado,
    activarComunicado
};