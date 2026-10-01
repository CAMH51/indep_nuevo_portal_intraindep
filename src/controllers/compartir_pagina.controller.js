const compartirPaginaService = require('../api/services/compartirPagina.service');
const {createBitacora} = require('../api/services/bitacora.service');
const sequelize = require('../api/config/dbPostgres');



const getCompartirPaginaByUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const registros = await compartirPaginaService.getPaginasCompartidasByUser(id)
        //console.log(registros);
        res.status(200).json({success:true,data:registros});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message});    
    }
}

const createCompartirPagina = async(req, res)=>{
    try {

        console.log('req.bodyr',req.body);
        const dataCompartirPagina = {
            fk_id_pagina:req.body.id_pagina || null,
            fk_id_user: req.body.id_user,
            f_modificacion: new Date()
        }

        const validar = await compartirPaginaService.validarPaginaCompartida(req.body.id_pagina,req.body.id_user);

        if(validar.length > 0){
            return res.status(400).json({success:false,msg:"Página ya compartida"});
        }
        
        const registro = await compartirPaginaService.createCompartirPagina(dataCompartirPagina);

        await createBitacora('NUEVA/PÁGINA COMPARTIDA',`${JSON.stringify(registro)}`,req.session.user.id_user);

        res.status(200).json({success:true,msg:"Página compartida con exito",data:registro});
    } catch (error) {
        res.status(500).json({success:false,msg:error.message});
    }
}

module.exports = {
    getCompartirPaginaByUser,
    createCompartirPagina
}