
const documentosServices = require('../api/services/documentos.services');
const archivosServices = require('../api/services/archivo.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');
const stateStorage = require('../state/storage.state');
const path = require('path');

const viewDocumentos = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/documentos/index'
    })
}

const getDocumentos = async(req, res)=>{
    try {
        const documentos = await documentosServices.getDocumentos();
        console.log(documentos);
        res.status(200).json({success:true,data:documentos});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const getDocumentosByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const documentos = await documentosServices.getDocumentosByUser(id);
        res.status(200).json({success:true,data:documentos});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getDocumentoById = async(req, res)=>{
    try {
        const {id} = req.params;
        const documento = await documentosServices.getDocumentoById(id);
        res.status(200).json({success:true,data:documento});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createDocumento = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        console.log('req.file',req.file);
        const file = req.file;
        const ext  = path.extname(file.originalname).replace('.', '').toLowerCase();
        const name = path.basename(file.filename, path.extname(file.filename));
        const dataDocumento = {
            titulo:req.body.titulo,
            descripcion:req.body.descripcion,
            fk_id_archivo:null,
            fk_id_user: req.session.user.id_user,
            f_autorizacion:req.body.f_autorizacion,
            url_documento:`/imagenes/home/documentos/${name}.${ext}`,
            f_modificacion: new Date()
        }
        
        const documento = await documentosServices.createDocumento(dataDocumento);
        console.log('documento',documento.dataValues.id_documento);

        await createBitacora('NUEVO/DOCUMENTO',`${JSON.stringify(documento)}`,req.session.user.id_user);
        if(req.file){
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            console.log('archivo',archivo.data.dataValues.id_archivo);
            await documentosServices.updateDocumento(documento.dataValues.id_documento,{
                fk_id_archivo:archivo.data.dataValues.id_archivo
            });
        }
        res.status(200).json({success:true,data:documento});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateDocumento = async(req, res)=>{
    try {
        const {id} = req.params;
        const dataDocumento = {
            titulo:req.body.editTitulo,
            descripcion:req.body.editDescripcion,
            f_autorizacion:req.body.editFAutorizacion,
            f_modificacion: new Date()
        }
        if(req.file){
            const file = req.file;
            const ext  = path.extname(file.originalname).replace('.', '').toLowerCase();
            const name = path.basename(file.filename, path.extname(file.filename));
            const archivo = await archivosServices.saveFile(req.file,req.session.user.id_user,stateStorage.getIdStorage());
            await documentosServices.updateDocumento(id,{fk_id_archivo:archivo.data.dataValues.id_archivo
            });

            dataDocumento['url_documento'] = `/imagenes/home/documentos/${name}.${ext}`;
        }
        const documento = await documentosServices.updateDocumento(id,dataDocumento);
        await createBitacora('EDITAR/DOCUMENTO',`${JSON.stringify(documento)}`,req.session.user.id_user);
        res.status(200).json({success:true,data:documento});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarDocumento = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        await createBitacora('EDITAR/DOCUMENTO',`Documento id: ${id} - Activar: ${status}`,req.session.user.id_user);

        const activar= await documentosServices.activarDocumento(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewDocumentos,
    getDocumentos,
    getDocumentoById,
    getDocumentosByUser,
    createDocumento,
    updateDocumento,
    activarDocumento
};