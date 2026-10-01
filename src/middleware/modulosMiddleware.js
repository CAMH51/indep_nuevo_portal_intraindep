const modulosService = require('../api/services/catalogos/modulos.service');

const modulosMiddleware = async(req, res, next) =>{
    try {
        if(req.session && req.session.user){
            const modulos = await modulosService.getModulosUser({where:{activo:true,fk_id_user:req.session.user.id_user}});

            //console.log('modulosMiddleware',modulos);
            res.locals.modulosCatalogos = modulos.filter(modulo => {return modulo.modulo.iscatalog});
            res.locals.modulosNoCatalogos = modulos.filter(modulo => {return !modulo.modulo.iscatalog});

            //console.log('res.locals.modulosCatalogos',res.locals.modulosCatalogos);
            //console.log('res.locals.modulosNoCatalogos',res.locals.modulosNoCatalogos); 
        }
    } catch (error) {
        console.log(error);
    }
    next();
}
module.exports = modulosMiddleware;