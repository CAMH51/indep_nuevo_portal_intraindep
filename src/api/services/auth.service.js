const jwt = require('jsonwebtoken');
const activeDirectory = require('activedirectory');
const tokenService = require('./token.service');

const dataActiveDirectory = require('./dataActiveDirect.services');
const {userModel} = require('../models/associations');

class AuthError extends Error {
    constructor(message, statusCode = 401) {
        super(message);
        this.name = 'AuthError';
        this.statusCode = statusCode;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normaliza el nombre de usuario: elimina espacios y lleva a minúsculas.
 * Si no contiene '@', agrega el dominio institucional.
 */
const normalizeUser = (rawUser) => {
    const trimmed = rawUser.trim().toLowerCase();
    const username = trimmed.includes('@') ? trimmed.split('@')[0] : trimmed;
    return {
        username,
        fullEmail: `${username}@indep.gob.mx`,
    };
};

/**
 * Valida que usuario y contraseña estén presentes.
 * @throws {ValidationError}
 */
const validateCredentials = (user, pass) => {
    if (!user || !pass) {
        throw new ValidationError('Ingrese usuario y contraseña');
    }
};

/**
 * Genera un JWT firmado para el usuario dado.
 */
const generateToken = (user,id_rol) =>
    jwt.sign({ user, id_rol }, process.env.SECRET_JWT, { expiresIn: '1h' });

/**
 * Establece la cookie de autenticación en la respuesta.
 */
const setAuthCookie = (res, token) => {
    const days = Number(process.env.COOKIE_EXPIRES) || 1;
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    });
};

/**
 * Manejador centralizado de errores para los controladores de login.
 */
const handleError = (res, error) => {

    
    console.error(`[${error.name || 'Error'}]`, error.message);

    const statusCode = error.statusCode || 500;
    const msg = statusCode === 500 ? 'Error interno del servidor' : error.message;

    return res.status(statusCode).json({ success: false, msg });
};

// ─── Autenticación contra Active Directory ────────────────────────────────────

/**
 * Autentica al usuario contra Active Directory de forma promisificada.
 * @throws {AuthError} si las credenciales son inválidas o hay error de conexión.
 */
const authenticateAD = (adInstance, fullEmail, pass) =>
    new Promise((resolve, reject) => {
        adInstance.authenticate(fullEmail, pass, (err, auth) => {
            if (err) return reject(new AuthError(`Error de conexión con AD: ${err.message}`));
            if (!auth) return reject(new AuthError('Usuario y/o Contraseña Incorrectos'));
            resolve(auth);
        });
    });

/**
 * Busca los atributos del usuario en Active Directory.
 * @throws {AuthError} si el usuario no existe en el directorio.
 */
const findUserAD = (adInstance, username, attributes) =>
    new Promise((resolve, reject) => {
        adInstance.findUser({ attributes }, username, (err, userAD) => {
            if (err) return reject(new AuthError(`Error al buscar usuario en AD: ${err.message}`));
            if (!userAD) return reject(new AuthError('Usuario no encontrado en Active Directory'));
            resolve(userAD);
        });
    });

    /**
     * Login contra la base de datos local.
     */
    const loginDB = async (rawUser,pass) => {
        try {

    
            validateCredentials(rawUser, pass);
    
            //const { username,fullEmail } = normalizeUser(rawUser);
            
            const userDB = await userModel.findOne({where:{email: rawUser, activo: true}});
            console.log('userDB',userDB.dataValues);
            console.log('id_rol',userDB.dataValues.rol.id_rol);
    
    
            if (!userDB) {
             return {success:false,msg:'No hay datos que mostrar'};
            }
    
            // 6. Generar token y armar sesión
            const token = generateToken(userDB.dataValues,userDB.dataValues.rol.id_rol);
            //const refreshToken = await tokenService.generateRefreshToken(userDB.dataValues.id_user);
    
            return {token,userDB}
        } catch (error) {
            return {success:false,msg:"Error interno del servidor", error: error.message}
        }
    };
    
    /**
     * Login contra Active Directory.
     */
    const loginAD = async (rawUser, pass) => {
        try {
            validateCredentials(rawUser, pass);
    
            const { username, fullEmail } = normalizeUser(rawUser);
    
            const adConfig = {
                url: process.env.URL_AD,
                baseDN: process.env.BASEDN_AD,
                username: fullEmail,
                password: pass,
            };
    
            const ad = new activeDirectory(adConfig);
    
            // 1. Autenticar
            await authenticateAD(ad, fullEmail, pass);
    
            // 2. Obtener atributos del usuario en AD
            const adAttributes = ['userPrincipalName', 'mail', 'sn', 'givenName', 'cn', 'displayName', 'description', 'pager'];
            const userAD = await findUserAD(ad, username, adAttributes);
           
            console.log('usuarioBD',userAD.mail);
            console.log('usuario ingresado',fullEmail)
            // 3. Validar que el correo del AD coincida con el usuario ingresado
            if (userAD.mail?.toLowerCase().trim() !== fullEmail.trim()) {
                return {success:false,msg:'Usuario y/o Contraseña Incorrectos[1]'};
            }
    
            // 4. Buscar usuario en la base de datos
          /*   const userDB = await postgresService.getData(
                userModel,ñ
                [
                    { model: rolesModel, as: 'rol' }
                ],
                { email: userAD.mail, activo: true }
            ); */
    
            const userDB = await userModel.findOne({where:{email: userAD.mail.trim()}});
            //console.log('userDB',userDB)
    
            if (!userDB) {
                return { success: false, msg: 'Usuario no existe en la Base de datos' };
            }
    
            const dbUser = userDB;
    
            if (!dbUser.activo) {
                return { success: false, msg: 'Usuario inactivo' };
            }
    
            // 5. Obtener datos extendidos desde el servicio de AD
            const dataAD = await dataActiveDirectory.queryDataActiveDirectory(fullEmail);
    
            if (dataAD?.length < 0) {
                return { success: false, msg: 'No hay datos que mostrar' };
            }
    
            //console.log('dataAD',dataAD);
    
            // 6. Generar token y armar sesión
            const token = generateToken(userDB,dbUser.rol.id_rol);
            const refreshToken = await tokenService.generateRefreshToken(userDB.id_user);
    
            //console.log('token',token);
            //console.log('refreshToken',refreshToken);
    
    
            return {success: true,dataAD,token,refreshToken,userDB}
        } catch (error) {
            return { success: false, msg: error.message };
        }
    };
    
    // ─── Refresh ──────────────────────────────────────────────────────────────────
    
     const refresh = async (refreshToken) => {

        console.log('refreshTokenServices',refreshToken);
        try {
   
            if (!refreshToken) {
                return { success: false, msg: 'Refresh token requerido' };
            }
    
            // Busca en BD: que exista, no esté revocado y no haya expirado
            // findValidRefreshToken hace JOIN con users para traer email e id_rol
            const record = await tokenService.findValidRefreshToken(refreshToken.token);
            console.log('dataRefresh record completo:',record);
    
            if (!record) {
                return { success: false, msg: 'Refresh token inválido o expirado' };
            }
    
            // Rotación: invalida el token usado, emite uno nuevo
            // Si alguien robó el token y lo usa primero, el legítimo ya no sirve → detectas el robo
            await tokenService.revokeRefreshToken(refreshToken.token);
            const userDB = await userModel.findOne({
                where: { id_user: record['user'].id_user, activo: true }
            });
    
            if (!userDB) {
                return { success: false, msg: 'Usuario inactivo o no encontrado' };
            }
    
            const newAccessToken  = tokenService.generateAccessToken(
                {user:userDB, id_rol: userDB.rol.id_rol },
                
            );
            const newRefreshToken = await tokenService.generateRefreshToken(userDB.id_user);
    
            let dataSession="";
            if (process.env.ACTIVE_DIRECTORY === 'true') {
                const dataAD = await dataActiveDirectory.queryDataActiveDirectory(userDB.email);
                if (!dataAD?.length) {
                    return { success: false, msg: 'No hay datos que mostrar' };
                }
                 return {dataAD,newAccessToken,newRefreshToken,userDB}
            }
            // Si no hay AD, retornar igual con datos mínimos
        return { newAccessToken, newRefreshToken, userDB };
        
        } catch (error) {
            return error;
        }
    };
    

    module.exports ={
        loginDB,
        loginAD,
        refresh
    }