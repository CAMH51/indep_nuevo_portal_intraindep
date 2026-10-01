
const apartadosServices = require('../../api/services/catalogos/apartados.service');
const subapartadosServices = require('../../api/services/catalogos/subapartado.service');



const viewApartados = async(req, res)=>{
    res.render('admin/dashboard',{
        page:'catalogos/apartados/index'
    })
}

const getApartados = async(req, res)=>{
    try {
        const apartados = await apartadosServices.getApartados();
        res.status(200).json({success:true,data:apartados});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getApartado = async(req, res)=>{
    try {
        const apartado = await apartadosServices.getApartadoById(req.params.id);
        res.status(200).json({success:true,data:apartado});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getApartadosByUserAndAsignados = async(req,res)=>{
    try {
        let apartados;
        if(req.session.user.id_rol === 1){
              apartados = await apartadosServices.getApartados();
        }else{
             apartados = await apartadosServices.getApartadosByUserAndAsignados(req.session.user.id_user);

        }
        res.status(200).json({success:true,data:apartados});
    } catch (error) {
         res.status(500).json({success:false,message:error.message});   
    }
}

const getSubapartadosApartadosAsignados = async(req,res)=>{
    try {
        let subapartados;
        if(req.session.user.id_rol === 1){
            subapartados = await subapartadosServices.getSubapartados();
        }else{
            
            const apartados = await apartadosServices.getApartadosByUserAndAsignados(req.session.user.id_user);
            const apartadosIds = apartados.map(apartado => apartado.id_apartado);
    
            subapartados = await apartadosServices.getByApartadosAsignadosSubapartados(null,{},apartadosIds);
        }

        res.status(200).json({success:true,data:subapartados});
    } catch (error) {
         res.status(500).json({success:false,message:error.message});   
    }
}

const createApartado = async(req, res)=>{
    try {
        const dataApartado = {
            apartado:req.body.apartado,
            descripcion:req.body.descripcion,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        console.log('dataApartado',dataApartado);
        const apartado = await apartadosServices.createApartado(dataApartado);
        res.status(200).json({success:true,data:apartado});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateApartado = async(req, res)=>{
    try {
        console.log(req.body);
        const {id} = req.params;
        const dataApartado = {
            apartado:req.body.editApartado,
            descripcion:req.body.editDescripcion,
            f_modificacion: new Date()
        }
        const apartado = await apartadosServices.updateApartado(id,dataApartado);
        res.status(200).json({success:true,data:apartado});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarApartado = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const activar= await apartadosServices.activarApartado(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewApartados,
    getApartados,
    getApartado,
    createApartado,
    updateApartado,
    activarApartado,
    getApartadosByUserAndAsignados,
    getSubapartadosApartadosAsignados
};