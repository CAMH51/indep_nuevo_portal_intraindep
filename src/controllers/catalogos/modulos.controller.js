
const modulosServices = require('../../api/services/catalogos/modulos.service');


const viewModulos = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'catalogos/modulos/index'
    })
}

const getModulos = async(req, res)=>{
    try {
        const modulos = await modulosServices.getModulos();
        res.status(200).json({success:true,data:modulos});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getModulo = async(req, res)=>{
    try {
        const modulo = await modulosServices.getModuloById(req.params.id);
        res.status(200).json({success:true,data:modulo});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createModulo = async(req, res)=>{
    try {
        const dataModulo ={
            modulo:req.body.modulo,
            nombre:req.body.nombre,
            descripcion:req.body.descripcion,
            ruta:req.body.ruta,
            iscatalog:req.body.iscatalog ? 'true' : 'false',
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        const modulo = await modulosServices.createModulo(dataModulo);
        res.status(200).json({success:true,data:modulo});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateModulo = async(req, res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const dataModulo = {
            modulo:req.body.editModulo,
            nombre:req.body.editNombre,
            descripcion:req.body.editDescripcion,
            ruta:req.body.editRuta,
            iscatalog:req.body.editIscatalog ? 'true' : 'false',
            f_modificacion: new Date()
        }
        const modulo = await modulosServices.updateModulo(id,dataModulo);
        res.status(200).json({success:true,data:modulo});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarModulo = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const activar= await modulosServices.activarModulo(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}



const getModuloByRol = async(req, res)=>{
    try {
        const modulos = await modulosServices.getModulosRolById(req.params.id);
        res.status(200).json({success:true,data:modulos});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getModulosByUser = async(req, res)=>{
    try {
        const modulos = await modulosServices.getModulosUser(null, {where:{fk_id_user:req.params.id}});
        res.status(200).json({success:true,data:modulos});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

module.exports = {
    viewModulos,
    getModulos,
    getModulo,
    createModulo,
    updateModulo,
    activarModulo,
    getModuloByRol,
    getModulosByUser
};