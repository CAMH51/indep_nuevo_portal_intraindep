const relApartadosUser = require('../api/services/rel_user_subapartado.service');

const getApartadosUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await relApartadosUser.getApartadosUser(id);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

module.exports = {
    getApartadosUser
}