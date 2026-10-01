const jwt = require('jsonwebtoken');
/* const jwt = require('jsonwebtoken');

exports.verifyToken  = (req, res, next)=>{
console.log(req.cookies.authToken)
if(req.cookies.authToken === undefined | null){
    return res.status(400).json({success:false,msg:"No existe token"});
}

try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    req.user = decoded;
    next();
} catch (error) {

    if(error.name === 'TokenExpiredError'){
        return res.status(401).json({success:false, msg:"Token expirado"});
    }
    return res.status(500).json({succes:false,msg:"Token Invalido"})
}
} */

exports.verifyToken = (req, res, next) => {
    // Obtener el header de autorización
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    

    if (!token) return res.status(401).json({ msg: 'Token requerido' });
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        console.log('Token verificado:', decoded);
        req.user = decoded; // { user: 'username', rol: 'SUPERADMIN' }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false, 
                msg: "Token expirado"
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false, 
                msg: "Token inválido"
            });
        }
        return res.status(500).json({
            success: false, 
            msg: "Error al verificar token",
            error: error.message
        });
    }
};