
const storagesServices = require('../../api/services/catalogos/storages.service');


const viewStorages = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'catalogos/storages/index'
    })
}

const getStorages = async(req, res)=>{
    try {
        const storages = await storagesServices.getStorages();
        res.status(200).json({success:true,data:storages});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getStorage = async(req, res)=>{
    try {
        const storage = await storagesServices.getStorageById(req.params.id);
        res.status(200).json({success:true,data:storage});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createStorage = async(req, res)=>{
    try {
        const dataStorage ={
            name:req.body.name,
            base_path:req.body.base_path,
            directorio_principal:req.body.directorio_principal,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        const storage = await storagesServices.createStorage(dataStorage);
        res.status(200).json({success:true,data:storage});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateStorage = async(req, res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const dataStorage = {
            name:req.body.editname,
            base_path:req.body.editBasePath,
            directorio_principal:req.body.editDirectorioPrincipal,
            f_modificacion: new Date()
        }
        const storage = await storagesServices.updateStorage(id,dataStorage);
        res.status(200).json({success:true,data:storage});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarStorage = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const activar= await storagesServices.activarStorage(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const getTree = async(req, res)=>{
    try {
        const tree = await storagesServices.getTree(req, res);
        res.status(200).json({success:true,data:tree});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const browseDirectory = async(req, res)=>{
    try {
        const browse = await storagesServices.browseDirectory(req, res);
        res.status(200).json({success:true,data:browse});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const createDirectory = async(req, res)=>{
    try {
        const create = await storagesServices.createDirectory(req, res);
        res.status(200).json({success:true,data:create});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const deleteDirectory = async(req, res)=>{
    try {
        const deleteDir = await storagesServices.deleteDirectory(req, res);
        res.status(200).json({success:true,data:deleteDir});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

/* const savePage = async(req, res)=>{
    try {
        const save = await storagesServices.savePage(req, res);
        console.log('savePage',save)
        res.status(200).json({success:true,data:save}); 
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
} */

const savePage = async (req, res) => {
    try {
        const save = await storagesServices.savePage(req);
        res.status(200).json({ success: true, data: save });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
}

const readPage = async(req, res)=>{
    try {
        const read = await storagesServices.readPage(req, res);
        res.status(200).json({success:true,data:read});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const deletePage = async(req, res)=>{
    try {
        const deleteP = await storagesServices.deletePage(req, res);
        res.status(200).json({success:true,data:deleteP});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

const renderDashboard = async(req, res)=>{
    try {
        const render = await storagesServices.renderDashboard(req, res);
        res.status(200).json({success:true,data:render});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }   
}

const renderExplorer = async(req, res)=>{
    try {
        const render = await storagesServices.renderExplorer(req, res);
        res.status(200).json({success:true,data:render});
    }catch(error){

    }
}

const renderEditor = async(req, res)=>{
    try {
        const render = await storagesServices.renderEditor(req, res);
        res.status(200).json({success:true,data:render});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}
module.exports = {
    viewStorages,
    getStorages,
    getStorage,
    createStorage,
    updateStorage,
    activarStorage,
    getTree,
    browseDirectory,
    createDirectory,
    deleteDirectory,
    savePage,
    readPage,
    deletePage,
    renderDashboard,
    renderExplorer,
    renderEditor
};