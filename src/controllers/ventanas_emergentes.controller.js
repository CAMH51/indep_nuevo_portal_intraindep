
const ventanasServices = require('../api/services/ventanas_emergentes.service');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');


const viewVentanas = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/ventanas_emergentes/index'
    })
}

const getVentanas = async(req, res)=>{
    try {
        const registros = await ventanasServices.getVentanas();;
        console.log(registros);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getVentanasByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await ventanasServices.getVentanasByUser(id);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getVentanaById = async(req, res)=>{
    try {
        const {id} = req.params;
        const registro = await ventanasServices.getVentanaById(id);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createVentana = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataVentana = {
            titulo:req.body.titulo,
            descripcion:req.body.descripcion,
            f_inicio:req.body.f_inicio,
            f_termino:req.body.f_termino,
            fk_id_archivo:null,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const registro = await ventanasServices.createVentana(dataVentana);

        await createBitacora('NUEVA/VENTANA EMERGENTE',`${JSON.stringify(registro)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await ventanasServices.updateVentana(registro.dataValues.id_ventana_emergente,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateVentana = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataVentana = {
            titulo:req.body.editTitulo,
            descripcion:req.body.editDescripcion,
            f_inicio:req.body.editFInicio,
            f_termino:req.body.editFTermino,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await ventanasServices.updateVentana(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        const registro = await ventanasServices.updateVentana(id,dataVentana);
        await createBitacora('EDITAR/VENTANA EMERGENTE',`${JSON.stringify(registro)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarVentana = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('ACTIVAR/VENTANA EMERGENTE',`Ventana Emergente Id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await ventanasServices.activarVentana(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewVentanas,
    getVentanas,
    getVentanasByUser,
    getVentanaById,
    createVentana,
    updateVentana,
    activarVentana
};