const bitacoraModel = require('../models/bitacora.model');

exports.createBitacora = async(accion,detalles, fk_id_user)=>{
    try {

        const bitacora = await bitacoraModel.create({
            accion,
            ip:"",
            detalles,
            fk_id_user
        });
    
        if (!bitacora?.id_bitacora) {
            return {success:false, error:"No se pudo crear la Bitacora"};
        }
        
        return {success:true, data:bitacora};
        
    } catch (error) {
        return {success:false, error:error}
    }

}