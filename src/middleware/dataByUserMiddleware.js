const paginasServices = require('../api/services/paginas.service');
const modulosServices = require('../api/services/catalogos/modulos.service');
const noticiasServices = require('../api/services/noticias.service');
const campaniasInternasServices = require('../api/services/campanias_internas.service');
const serviciosPromocionesServices = require('../api/services/servicios_promociones.service');
const eventosAvisosServices = require('../api/services/eventos_avisos.service');
const cumpleaniosServices = require('../api/services/cumpleanios.service');
const ligasServices = require('../api/services/ligas.service');
const ventanasServices = require('../api/services/ventanas_emergentes.service');
const avisosServices = require('../api/services/avisos_importantes.service');
const fotogaleriasServices = require('../api/services/fotogalerias.service');
const rolesServices = require('../api/services/catalogos/roles.service');
const apartadosServices = require('../api/services/catalogos/apartados.service');
const subapartadosServices = require('../api/services/catalogos/subapartado.service');
const compartirPaginasServices = require('../api/services/compartirPagina.service');

const {getIdStorage} = require('../state/storage.state');
const { where } = require('sequelize');

const dataByUser = async(req,res,next) =>{
    try {
    if(req.session && req.session.user){
        const id= getIdStorage();
        const paginasCompartidas = await compartirPaginasServices.getPaginasCompartidasByUser(req.session.user.id_user);
        const paginasCreadas =                 await paginasServices.getPaginas({where:{fk_id_storage:id,fk_id_user:req.session.user.id_user}});
        const modulos =                await modulosServices.getModulosRol({where:{activo:true,fk_id_rol:req.session.user.id_rol}})
        const roles =                  await rolesServices.getRoles({where:{activo:true}});
        const apartados =              await apartadosServices.getApartados({where:{fk_id_user:req.session.user.id_user}});
        const apartadosAsignados =     await apartadosServices.getApartadosUserById(req.session.user.id_user);
        //const subapartados =           await subapartadosServices.getSubapartados({where:{fk_id_user:req.session.user.id_user}});
        //const subapartadosAsignados =  await subapartadosServices.getSubapartadosUserById(req.session.user.id_user);
        //console.log('apartadosAsignados',apartadosAsignados);

        const arrayPaginasCompartidas = paginasCompartidas.map(item =>{
            return item.pagina;
        });

        const paginas = [...paginasCreadas, ...arrayPaginasCompartidas];


        const rolesArray = req.session.user.id_rol === 1 ? roles :   roles.filter(rol => rol.id_rol !== 1 && rol.id_rol !== 2);

        const aparatadosAll = [...apartados,...apartadosAsignados];
        //const subapartadosAll = [...subapartados,...subapartadosAsignados];

        const apartadosArray = req.session.user.id_rol === 1 ? apartados : aparatadosAll;
        //const subapartadosArray = req.session.user.id_rol === 1 ? subapartados : subapartadosAll;





/*         const noticias =                await noticiasServices.getNoticias({where:{fk_id_user:req.session.user.id_user}});
        const campaniasInternas =       await campaniasInternasServices.getCampaniasInternas({where:{fk_id_user:req.session.user.id_user}});
        const serviciosPromociones =    await serviciosPromocionesServices.getServiciosPromociones({where:{fk_id_user:req.session.user.id_user}});
        const eventosAvisos =           await eventosAvisosServices.getEventosAvisos({where:{fk_id_user:req.session.user.id_user}});
        const cumpleanios =             await cumpleaniosServices.getCumpleanios({where:{fk_id_user:req.session.user.id_user}});
        const ligas =                   await ligasServices.getLigas({where:{fk_id_user:req.session.user.id_user}});
        const ventanas =                await ventanasServices.getVentanas({where:{fk_id_user:req.session.user.id_user}});
        const avisos =                  await avisosServices.getAvisos({where:{fk_id_user:req.session.user.id_user}});
        const fotogalerias =            await fotogaleriasServices.getFotogalerias({where:{fk_id_user:req.session.user.id_user}}); */


/*         res.locals.noticias = noticiasUser; */
        res.locals.paginas = paginas;
        res.locals.modulos = modulos;
        res.locals.rolesArray = rolesArray;
        res.locals.apartadosArray = apartadosArray;
        res.locals.apartadosAsignados = apartadosAsignados;
        res.locals.id_user = req.session.user.id_user;
        //res.locals.subapartadosArray = subapartadosArray;
  /*       res.locals.campaniasInternas = campaniasInternasUser;
        res.locals.serviciosPromociones = serviciosPromocionesUser;
        res.locals.eventosAvisos = eventosAvisosUser;
        res.locals.cumpleanios = cumpleaniosUser;
        res.locals.ligas = ligasUser;
        res.locals.ventanas = ventanasUser;
        res.locals.avisos = avisosUser;
        res.locals.fotogalerias = fotogaleriasUser; */
        res.locals.id_user = req.session.user.id_user;
    }
        next()
    } catch (error) {
        console.log(error);
    }
}

module.exports = dataByUser;