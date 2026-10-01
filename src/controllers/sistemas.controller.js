
const sistemasServices = require('../api/services/sistemas.service');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');


const viewSistema = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/sistemas/index'
    })
}

const getSistemas = async(req, res)=>{
    try {
        const sistemas = await sistemasServices.getSistemas();
        res.status(200).json({success:true,data:sistemas});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getSistemasByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const sistemas = await sistemasServices.getSistemasByUser(id);
        res.status(200).json({success:true,data:sistemas});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getSistemaById = async(req, res)=>{
    try {
        const {id} = req.params;
        const sistema = await sistemasServices.getSistemaById(id);
        res.status(200).json({success:true,data:sistema});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createSistema = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataSistema = {
            nombre_sistema:req.body.nombre_sistema,
            siglas:req.body.siglas,
            descripcion:req.body.descripcion,
            url_sistema:req.body.url_sistema,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const sistema = await sistemasServices.createSistema(dataSistema);

        await createBitacora('NUEVO/SISTEMAS',`${JSON.stringify(sistema)}`,req.session.user.id_user);

        res.status(200).json({success:true,data:sistema});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateSistema = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataSistema = {
            nombre_sistema:req.body.editNombreSistema,
            siglas:req.body.editSiglas,
            descripcion:req.body.editDescripcion,
            url_sistema:req.body.editUrlSistema,
            f_modificacion: new Date()
        }

        const sistema = await sistemasServices.updateSistema(id,dataSistema);
        await createBitacora('EDITAR/SISTEMAS',`${JSON.stringify(sistema)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:sistema});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarSistema = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('EDITAR/SISTEMAS',`Sistema id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await sistemasServices.activarSistema(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewSistema,
    getSistemas,
    getSistemaById,
    getSistemasByUser,
    createSistema,
    updateSistema,
    activarSistema
};