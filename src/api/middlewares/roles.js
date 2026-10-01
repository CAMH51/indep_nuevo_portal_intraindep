
const rolModel = require('../models/rol.model');

const loadRoles = async (req, res, next) => {
    try {
        //const fkIdRol = req.session?.user?.id_rol;
        const fkIdRol = req.user?.id_rol;
        if(!fkIdRol){
            return res.status(403).json({
                success:false,
                msg:'El usuario no tiene un rol asignado'
            })
        }

        const rol = await rolModel.findByPk(fkIdRol);
        

        if(!rol){
            return res.status(403).json({
                success:false,
                msg:'El rol asignado no existe en la base de datos'
            });
        }

        req.userRol = rol.dataValues;
        req.userRolNombre = rol.dataValues.rol;
        next();
    } catch (error) {
        console.error('[loadUserRole]', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al cargar el rol del usuario.',
        });
    }
};

const hasRole = (...rolesPermitidos) =>{
    return (req, res, next) =>{
        if(!req.userRolNombre){
            return res.status(403).json({
                success: false,
                msg: 'Rol no cargado. Verifica que loadUserRole esté en la cadena.',
            });
        }
        if(!rolesPermitidos.includes(req.userRolNombre)){
            return res.status(403).json({
                success:false,
                msg:"Acceso denegado. Rol no permitido."
            });
        }
        next();
    }
};

const ROLES={
    SUPERADMIN: 'Superadmin',
    ADMINISTRADOR: 'Administrador',
    CONSULTOR: 'Consultor',
    EDITOR: 'Editor'
}


module.exports = {
    loadRoles,
    hasRole,
    ROLES
};