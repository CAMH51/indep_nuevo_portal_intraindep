
const {createBitacora} = require('./bitacora.service');

exports.getData = async(model,modelInclude="",whereParam = {})=>{
    try {

        if(modelInclude != ""){

             data = await model.findAll({where:whereParam,
                include:modelInclude
             });
            /*  console.log("data",data); */
        }else{
             data = await model.findAll({where:whereParam});
        }

        return data.length > 0 ? {success: true,status:201, msg:"", data:data, total_registros:data.length, error:""} : {success: false,status:200, msg:"No existen registros", data:[]};
    } catch (error) {
        return {success: false,status:500, msg:"", data:[], error: error.message}
    }
}

exports.create = async(model,dataCreate) =>{
    try {
        const registro = await model.create(dataCreate);

        return  {success: true,status:200, msg:"Registro agregado con Exito", data:registro, error:""};
    } catch (error) {
        return {success: false,status:500, msg:"", error: error.message}
    }
}

exports.update = async(model,dataUpdate,whereParam={}) =>{
    try {
        const update = await model.update(dataUpdate,{
            where:whereParam
        });
        if(update[0] == 1){

            return  {success: true,status:200, msg:"Registro actualizado con Exito", data:[], error:""};

        }else{
            return  {success: false,status:400};
        }
    } catch (error) {
        return {success: false,status:500, msg:"", error: error.message}
    }
}

exports.existe = async(model,whereParam) =>{
    try {
        const existe = await model.findAll({
            where:whereParam
        });
        console.log('existe',existe)
       return  existe.length > 0 ? {success: true,status:200, msg:"Registro ya existe", data:existe, error:""} : {success: false ,status:400};
         
    } catch (error) {
        return {success: false,status:500, msg:"", data:data, error: error.message}
    }
} 

exports.isActivo = async(model,estatus,whereParam)=>{
    try {
        const update = await model.update({activo:estatus},{
            where:whereParam
        });
           if(update[0] == 1){

               return  {success: true,status:200, msg:`Registro ${estatus === 'true' ? "Activo" : "Inactivo"} con exito.`, data:[], error:""};
           }else{
                return  {success: false,status:400};
           }
    } catch (error) {
        return {success: false,status:500, msg:"", data:data, error: error.message}
    }
}