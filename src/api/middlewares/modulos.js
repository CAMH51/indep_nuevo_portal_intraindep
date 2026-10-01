const userModuloModel = require('../models/rel_users_modulos.model');
const moduloModel = require('../models/modulo.model');

const hasModuloAccess = (moduloRequerido) =>{
    return async (req, res, next) =>{
        try {
            if(req.userRolNombre === 'Superadmin') return next();
            console.log('moduloRequerido',moduloRequerido);
            const modulo = await moduloModel.findOne({
                where:{nombre:moduloRequerido}
            });

            if(!modulo){
                return res.status(404).json({
                    success: false,
                    msg: `El módulo "${moduloRequerido}" no existe.`,
                });
            }
            console.log('req.session.user.id_user',req.user.user.id_user)

            const asignacion = await userModuloModel.findOne({
                where:{
                    fk_id_user:req.user.user?.id_user,
                    fk_id_modulo:modulo.dataValues.id_modulo
                }
            });

            if(!asignacion){
                return res.status(403).json({
                    success:false,
                    msg:'Sin acceso al módulo'
                });
            }
            next();
        } catch (error) {
            console.error('[hasModuleAccess]', error);
            return res.status(500).json({ ok: false, message: 'Error al verificar módulo.' });
        }
    }
}

module.exports = {
    hasModuloAccess
}