
const subastasServices = require('../api/services/subasta.service');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');
const subastas = require('../api/models/subastas.model');

const viewSubasta = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/subastas/index'
    })
}

const getSubastas = async(req, res)=>{
    try {
        const subastas = await subastasServices.getSubastas();;
        res.status(200).json({success:true,data:subastas});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getSubastasByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const subastas = await subastasServices.getSubastasByUser(id);
        res.status(200).json({success:true,data:subastas});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getSubastaById = async(req, res)=>{
    try {
        const {id} = req.params;
        const subasta = await subastasServices.getSubastaById(id);
        res.status(200).json({success:true,data:subasta});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createSubasta = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataSubasta = {
            titulo:req.body.titulo,
            envivo_url:req.body.url_envivo,
            fk_id_archivo:null,
            envivo_f_inicio:req.body.f_inicio,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const subasta = await subastasServices.createSubasta(dataSubasta);
        console.log('subastas',subasta.dataValues.id_subasta);

        await createBitacora('NUEVO/SUBASTA',`${JSON.stringify(subasta)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await subastasServices.updateSubasta(subasta.dataValues.id_subasta,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:subasta});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateSubasta = async(req, res)=>{
    try {
        console.log('req.body',req.body)
        const {id} = req.params;
        const dataSubasta = {
            titulo:req.body.editTitulo,
            envivo_url:req.body.editUrlEnvivo,
            envivo_f_inicio:req.body.editFInicioEnvivo,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await subastasServices.updateSubasta(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        const subasta = await subastasServices.updateSubasta(id,dataSubasta);
        await createBitacora('EDITAR/SUBASTA',`${JSON.stringify(subasta)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:subasta});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarSubasta = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('EDITAR/SUBASTA',`Subasta id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await subastasServices.activarSubasta(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewSubasta,
    getSubastas,
    getSubastaById,
    getSubastasByUser,
    createSubasta,
    updateSubasta,
    activarSubasta
};