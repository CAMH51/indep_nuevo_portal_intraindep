
const departamentosServices = require('../../api/services/catalogos/departamentos_comunicado.service');


const viewDepartamento = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'catalogos/departamentos_comunicados/index'
    })
}

const getDepartamentos = async(req, res)=>{
    try {
        const departamentos = await departamentosServices.getDepartamentos();
        res.status(200).json({success:true,data:departamentos});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getDepartamentoById = async(req, res)=>{
    try {
        const departamento = await departamentosServices.getDepartamentoById(req.params.id);
        res.status(200).json({success:true,data:departamento});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createDepartamento = async(req, res)=>{
    try {
        const dataDepartamento ={
            titulo:req.body.titulo,
            siglas:req.body.siglas,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        const departamento = await departamentosServices.createDepartamento(dataDepartamento);
        res.status(200).json({success:true,data:departamento});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateDepartamento = async(req, res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const dataDepartamento = {
            titulo:req.body.editTitulo,
            siglas:req.body.editSiglas,
            f_modificacion: new Date()
        }
        const departamento = await departamentosServices.updateDepartamento(id,dataDepartamento);
        res.status(200).json({success:true,data:departamento});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarDepartamento = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const activar= await departamentosServices.activarDepartamento(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}





module.exports = {
    viewDepartamento,
    getDepartamentos,
    getDepartamentoById,
    createDepartamento,
    updateDepartamento,
    activarDepartamento
};