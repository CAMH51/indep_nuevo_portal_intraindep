
const cumpleaniosServices = require('../api/services/cumpleanios.service');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');


const viewCumpleanios = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/cumpleanios/index'
    })
}

const getCumpleanios = async(req, res)=>{
    try {
        const registros = await cumpleaniosServices.getCumpleanios();;
        console.log(registros);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getCumpleaniosByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await cumpleaniosServices.getCumpleaniosByUser(id);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getCumpleanioById = async(req, res)=>{
    try {
        const {id} = req.params;
        const registro = await cumpleaniosServices.getCumpleanioById(id);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createCumpleanio = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataCumpleanio = {
            nombre:req.body.nombre,
            ap_paterno:req.body.ap_paterno,
            ap_materno:req.body.ap_materno,
            f_nacimiento:req.body.f_nacimiento,
            fk_id_archivo:null,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const registro = await cumpleaniosServices.createCumpleanio(dataCumpleanio);

        await createBitacora('NUEVO/CUMPLEAÑOS',`${JSON.stringify(registro)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await cumpleaniosServices.updateCumpleanio(registro.dataValues.id_cumpleanio,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateCumpleanio = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataCumpleanio = {
            nombre:req.body.editNombre,
            ap_paterno:req.body.editApPaterno,
            ap_materno:req.body.editApMaterno,
            f_nacimiento:req.body.editFNacimiento,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await cumpleaniosServices.updateCumpleanio(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        const registro = await cumpleaniosServices.updateCumpleanio(id,dataCumpleanio);
        await createBitacora('EDITAR/CUMPLEAÑOS',`${JSON.stringify(registro)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarCumpleanio = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('ACTIVAR/CUMPLEAÑOS',`Ccumpeaños Id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await cumpleaniosServices.activarCumpleanio(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewCumpleanios,
    getCumpleanios,
    getCumpleaniosByUser,
    getCumpleanioById,
    createCumpleanio,
    updateCumpleanio,
    activarCumpleanio
};