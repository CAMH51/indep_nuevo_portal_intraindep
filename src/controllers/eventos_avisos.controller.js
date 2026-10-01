
const eventosAvisosServices = require('../api/services/eventos_avisos.service');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');


const viewEventosAvisos = async(req, res)=>{
    const eventosAvisos = await eventosAvisosServices.getEventosAvisos();
    res.render('admin/dashboard',{
        page:'/eventos_avisos/index',
        eventosAvisos
    })
}

const getEventosAvisos = async(req, res)=>{
    try {
        const registros = await eventosAvisosServices.getEventosAvisos();;
        console.log(registros);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getEventosAvisosByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await eventosAvisosServices.getEventosAvisosByUser(id);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getEventoAvisoById = async(req, res)=>{
    try {
        const {id} = req.params;
        const registro = await eventosAvisosServices.getEventoAvisoById(id);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createEventoAviso = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataEventoAviso = {
            nombre_evento_aviso:req.body.nombre_evento_aviso,
            descripcion:req.body.descripcion,
            fk_id_archivo:null,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const registro = await eventosAvisosServices.createEventoAviso(dataEventoAviso);

        await createBitacora('NUEVO/EVENTO Y AVISO',`${JSON.stringify(registro)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await eventosAvisosServices.updateEventoAviso(registro.dataValues.id_evento_aviso,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateEventoAviso = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataEventoAviso = {
            nombre_evento_aviso:req.body.editNombreEventoAviso,
            descripcion:req.body.editDescripcion,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await eventosAvisosServices.updateEventoAviso(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        const registro = await eventosAvisosServices.updateEventoAviso(id,dataEventoAviso);
        await createBitacora('EDITAR/EVENTO Y AVISO',`${JSON.stringify(registro)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarEventoAviso = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('ACTIVAR/EVENTO Y AVISO',`Evento y Aviso Id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await eventosAvisosServices.activarEventoAviso(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewEventosAvisos,
    getEventosAvisos,
    getEventosAvisosByUser,
    getEventoAvisoById,
    createEventoAviso,
    updateEventoAviso,
    activarEventoAviso
};