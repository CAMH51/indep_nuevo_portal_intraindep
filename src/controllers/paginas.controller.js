
const paginasServices = require('../api/services/paginas.service');
const {getIdStorage} = require('../state/storage.state');


const viewPaginas = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'/paginas/index'
    })
}

const getPaginas = async(req, res)=>{
    try {
        const paginas = await paginasServices.getPaginas();
        res.status(200).json({success:true,data:paginas});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getPaginasByUser = async(req, res)=>{
    try {
        const id= getIdStorage();
        const paginas = await paginasServices.getPaginas({where:{fk_id_storage:id,fk_id_user:req.session.user.id_user}});
        res.status(200).json({success:true,data:paginas});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getPaginaById = async(req, res)=>{
    try {
        const pagina = await paginasServices.getPaginaById(req.params.id);
        res.status(200).json({success:true,data:pagina});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createPagina = async(req, res)=>{
    try {

        const existe = await paginasServices.getPaginas({where:{nombre_pag:req.body.nombre_pag}});
        if(existe.length > 0){
            return res.status(200).json({success:false,message:'La página ya existe'});
        }

        const dataPagina = {
            nombre_pag:req.body.nombre_pag,
            ruta_pag:req.body.ruta_pag,
            descripcion_pag:req.body.descripcion_pag,
            fk_id_storage:req.body.fk_id_storage,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        console.log('dataPagina',dataPagina);
        const pagina = await paginasServices.createPagina(dataPagina);
        res.status(200).json({success:true,data:pagina});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updatePagina = async(req, res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const dataPagina = {
            nombre_pag:req.body.editNombrePag,
            ruta_pag:req.body.editRutaPag,
            descripcion_pag:req.body.editDescripcionPag,
            f_modificacion: new Date()
        }
        const pagina = await paginasServices.updatePagina(id,dataPagina);
        res.status(200).json({success:true,data:pagina});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarPagina = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const activar= await paginasServices.activarPagina(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewPaginas,
    getPaginas,
    getPaginaById,
    getPaginasByUser,
    createPagina,
    updatePagina,
    activarPagina
};