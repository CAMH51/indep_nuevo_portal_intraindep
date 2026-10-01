
const manualesServices = require('../api/services/manuales.service');
const archivosServices = require('../api/services/archivo.service');
const sistemasServices = require('../api/services/sistemas.service')
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');


const viewManual = async(req, res)=>{
    const sistemas = await sistemasServices.getSistemas();
    res.render('admin/dashboard',{
        sistemas,
        page:'/manuales/index'
    })
}

const getManuales = async(req, res)=>{
    try {
        const manuales = await manualesServices.getManuales();
        res.status(200).json({success:true,data:manuales});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getManualesByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const manuales = await manualesServices.getManuelasByUser(id);
        res.status(200).json({success:true,data:manuales});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getManualesBySistema = async(req, res)=>{
    try {
        const {id} = req.params;
        const manuales = await manualesServices.getManualesBySistema(id);
        console.log('manuales',manuales)
        res.status(200).json({success:true,data:manuales});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getManualById = async(req, res)=>{
    try {
        const {id} = req.params;
        const manual = await manualesServices.getManualById(id);
        res.status(200).json({success:true,data:manual});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createManual = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const dataManual = {
            fk_id_sistema:req.body.sistemas,
            fk_id_archivo:null,
            titulo:req.body.titulo,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        
        const manual = await manualesServices.createManual(dataManual);
        console.log('manual',manual)

        await createBitacora('NUEVO/MANUALES',`${JSON.stringify(manual)}`,req.session.user.id_user);
         if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await manualesServices.updateManual(manual.dataValues.id_manual_sistema,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }

        res.status(200).json({success:true,data:manual});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateManual = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataManual = {
            fk_id_sistema:req.body.editSistema,
            titulo:req.body.editTitulo,
            f_modificacion: new Date()
        }
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await manualesServices.updateManual(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }

        const manual = await manualesServices.updateManual(id,dataManual);
        await createBitacora('EDITAR/MANUALES',`${JSON.stringify(manual)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:manual});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarManual = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('EDITAR/MANUALES',`Manual id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await manualesServices.activarManual(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewManual,
    getManuales,
    getManualById,
    getManualesByUser,
    getManualesBySistema,
    createManual,
    updateManual,
    activarManual
};