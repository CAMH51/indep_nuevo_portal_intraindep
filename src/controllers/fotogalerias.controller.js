
const fotogaleriasServices = require('../api/services/fotogalerias.service');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');


const viewFotogalerias = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/fotogalerias/index'
    })
}

const getFotogalerias = async(req, res)=>{
    try {
        const registros = await fotogaleriasServices.getFotografias();;
        console.log(registros);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getFotogaleriasByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await fotogaleriasServices.getFotografiasByUser(id);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getFotogaleriaById = async(req, res)=>{
    try {
        const {id} = req.params;
        const registro = await fotogaleriasServices.getFotografiaById(id);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createFotogaleria = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataFotogaleria = {
            alt:req.body.alt,
            descripcion:req.body.descripcion,
            fk_id_archivo:null,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const registro = await fotogaleriasServices.createFotografia(dataFotogaleria);

        await createBitacora('NUEVA/FOTOGRAFÍA',`${JSON.stringify(registro)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await fotogaleriasServices.updateFotografia(registro.dataValues.id_fotogaleria,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateFotogaleria = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataFotografia = {
            alt:req.body.editAlt,
            descripcion:req.body.editDescripcion,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await fotogaleriasServices.updateFotografia(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        const registro = await fotogaleriasServices.updateFotografia(id,dataFotografia);
        await createBitacora('EDITAR/FOTOGRAÍA',`${JSON.stringify(registro)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:registro});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarFotogaleria = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('ACTIVAR/FOTOGRAFÍA',`Fotografía Id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await fotogaleriasServices.activarFotografia(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewFotogalerias,
    getFotogalerias,
    getFotogaleriasByUser, 
    getFotogaleriaById, 
    createFotogaleria,
    updateFotogaleria,
    activarFotogaleria
};