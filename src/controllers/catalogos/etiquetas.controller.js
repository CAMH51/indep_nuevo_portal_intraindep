
const etiquetaService = require('../../api/services/catalogos/etiquetas.service');


const viewEtiquetas = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'catalogos/etiquetas/index'
    })
}

const getEtiquetas = async(req, res)=>{
    try {
        const etiquetas = await etiquetaService.getEtiquetas();
        res.status(200).json({success:true,data:etiquetas});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getEtiqueta = async(req, res)=>{
    try {
        const etiqueta = await etiquetaService.getEtiquetaById(req.params.id);
        res.status(200).json({success:true,data:etiqueta});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createEtiquetas = async(req, res)=>{
    try {
        console.log(req.body);
        const etiquetas = await etiquetaService.createEtiqueta(req.body);
        res.status(200).json({success:true,data:etiquetas});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateEtiqueta = async(req, res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const dataEtiqueta = {
            etiqueta:req.body.editEtiqueta,
            f_modificacion: new Date()
        }
        const etiqueta = await etiquetaService.updateEtiqueta(id,dataEtiqueta);
        res.status(200).json({success:true,data:etiqueta});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarEtiqueta = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const activar= await etiquetaService.activarEtiqueta(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewEtiquetas,
    getEtiquetas,
    getEtiqueta,
    createEtiquetas,
    updateEtiqueta,
    activarEtiqueta
};