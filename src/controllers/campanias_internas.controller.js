
const campaniasInternaServices = require('../api/services/campanias_internas.service');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');


const viewCampaniasInterna = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/campanias_internas/index'
    })
}

const getCampaniasInternas = async(req, res)=>{
    try {
        const registros = await campaniasInternaServices.getCampaniasInternas();;
        console.log(registros);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getCampaniasInternasByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await campaniasInternaServices.getCampaniasInternasByUser(id);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getCampaniaInternaById = async(req, res)=>{
    try {
        const {id} = req.params;
        const registro = await campaniasInternaServices.getCampaniaInternaById(id);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createCampaniaInterna = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataCampaniaInterna = {
            descripcion:req.body.descripcion,
            fk_id_archivo:null,
            fk_id_pagina:req.body.pagina || null,
            fk_id_user: req.session.user.id_user,
            url_pagina:req.body.url_externa || null,
            f_modificacion: new Date()
        }
        
        const registro = await campaniasInternaServices.createCampaniaInterna(dataCampaniaInterna);

        await createBitacora('NUEVA/CAMPAÑA INTERNA',`${JSON.stringify(registro)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await campaniasInternaServices.updateCampaniaInterna(registro.dataValues.id_campania_interna,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateCampaniaInterna = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataCampaniaInterna = {
            descripcion:req.body.editDescripcion,
            fk_id_pagina:req.body.editPagina || null,
            url_pagina:req.body.editUrlExterna || null,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await campaniasInternaServices.updateCampaniaInterna(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        const registro = await campaniasInternaServices.updateCampaniaInterna(id,dataCampaniaInterna);
        await createBitacora('EDITAR/CAMPAÑA INTERNA',`${JSON.stringify(registro)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarCampañaInterna = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('ACTIVAR/CAMPAÑA INTERNA',`Campaña interna Id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await campaniasInternaServices.activarCampaniaInterna(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewCampaniasInterna,
    getCampaniasInternas,
    getCampaniasInternasByUser,
    getCampaniaInternaById,
    createCampaniaInterna,
    updateCampaniaInterna,
    activarCampañaInterna

};