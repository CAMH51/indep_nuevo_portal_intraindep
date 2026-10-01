
const rolesServices = require('../../api/services/catalogos/roles.service');


const viewRoles = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'catalogos/roles/index'
    })
}

const getRoles = async(req, res)=>{
    try {
        const roles = await rolesServices.getRoles();
        res.status(200).json({success:true,data:roles});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getRol = async(req, res)=>{
    try {
        const rol = await rolesServices.getRolById(req.params.id);
        res.status(200).json({success:true,data:rol});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createRol = async(req, res)=>{
    try {
        console.log(req.body);
        const rol = await rolesServices.createRol(req.body);
        res.status(200).json({success:true,data:rol});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateRol = async(req, res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const dataRol = {
            rol:req.body.editRol,
            f_modificacion: new Date()
        }
        const rol = await rolesServices.updateRol(id,dataRol);
        res.status(200).json({success:true,data:rol});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarRol = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const activar= await rolesServices.activarRol(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewRoles,
    getRoles,
    getRol,
    createRol,
    updateRol,
    activarRol
};