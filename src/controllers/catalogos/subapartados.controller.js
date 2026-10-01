
const subapartadosServices = require('../../api/services/catalogos/subapartado.service');
const apartadosServices = require('../../api/services/catalogos/apartados.service');


const viewSubapartados = async(req, res)=>{
    const apartados = await apartadosServices.getApartados();
    res.render('admin/dashboard',{
        page:'catalogos/subapartados/index',
        apartados,
    })
}

const getSubapartados = async(req, res)=>{
    try {
        const subapartados = await subapartadosServices.getSubapartados();
        res.status(200).json({success:true,data:subapartados});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getSubapartado = async(req, res)=>{
    try {
        const subapartado = await subapartadosServices.getSubapartadoById(req.params.id);
        res.status(200).json({success:true,data:subapartado});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createSubapartado = async(req, res)=>{
    try {
        //console.log('req.body',req.body);
        const dataSubapartado ={
            subapartado:req.body.subapartado,
            descripcion:req.body.descripcion,
            fk_id_apartado:req.body.fk_id_apartado,
            fk_id_pagina:req.body.fk_id_pagina || null,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        const subapartado = await subapartadosServices.createSubapartado(dataSubapartado);
        res.status(200).json({success:true,data:subapartado});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateSubapartado = async(req, res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const dataSubapartado = {
            subapartado:req.body.editSubapartado,
            descripcion:req.body.editDescripcion,
            fk_id_apartado:req.body.editFkIdApartado,
            fk_id_pagina:req.body.editFkIdPagina,
            f_modificacion: new Date()
        }
        const subapartado = await subapartadosServices.updateSubapartado(id,dataSubapartado);
        res.status(200).json({success:true,data:subapartado});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarSubapartado = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const activar= await subapartadosServices.activarSubapartado(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewSubapartados,
    getSubapartados,
    getSubapartado,
    createSubapartado,
    updateSubapartado,
    activarSubapartado
};