const activeDirectory = require('activedirectory');
const {normalizeUser} = require('../utils/authUtils');
const dataActiveDirectory = require('../services/dataActiveDirect.services');


const checkADUserExists = async (req, res, next) => {
    const { user: rawUser } = req.body;

    if (!rawUser) {
        return res.status(400).json({ success: false, msg: 'Correo requerido' });
    }

    try {
        const { username, fullEmail } = normalizeUser(rawUser);

        // Configuración con credenciales de servicio (service account)
        // NO las del usuario — solo necesitamos leer el AD
       
        console.log('fullEmail',fullEmail);
        console.log('username',username);
        const userAD = await dataActiveDirectory.queryDataActiveDirectory(fullEmail);
        console.log('userAD',userAD);

        // Todo bien → adjuntar al request y continuar

        if(userAD.length > 0){
            return res.status(200).json({success:true, data:userAD});

        }else{
            return res.status(200).json({success:false, data:[]});
        }
        
    } catch (error) {
        console.error('[checkADUserExists]', error);
        return res.status(500).json({ success: false, msg: 'Error al consultar Active Directory' });
    }
    next();
};

module.exports = checkADUserExists;