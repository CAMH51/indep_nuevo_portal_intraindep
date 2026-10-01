const jwt = require('jsonwebtoken');

const WARN_BEFORE_MS = 3 * 60 * 1000;

exports.authMiddleware = (req, res, next)=>{
     // Verificar si session existe
    if (!req.session) {
        console.log('Session no está disponible');
        return res.redirect('/admin');
    }
    const user = req.session.user;

    
    if(!user || !user.token) return res.redirect('/admin');

    try {
        const decoded = jwt.decode(user.token);
        if(!decoded || !decoded.exp) return res.json({success:false,msg:"Token inválido o expirado"});

        const expiresAt = decoded.exp * 1000;
        const now = Date.now();

        //console.log('now',now);
        //console.log('expiresAt',expiresAt);
        //console.log('WARN_BEFORE_MS',WARN_BEFORE_MS);


        if(now >= expiresAt){
            // Token ya expiró
            req.session.destroy(() => {
                res.clearCookie(process.env.APP_COOKIE_NAME);
                if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(401).json({ success: false, msg: 'Sesión expirada', redirect: '/admin' });
                }
                return res.redirect('/?expired=1');
            });
            return;
        }

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Token próximo a expirar → poner flag para el template EJS
            if (expiresAt - now <= WARN_BEFORE_MS) {
            res.locals.sessionWarning = true;
            res.locals.sessionExpiresIn = Math.floor((expiresAt - now) / 1000); // segundos restantes
            } else {
            res.locals.sessionWarning = false;
            }

            next();

    } catch (error) {
        req.session.destroy(() => {
            res.clearCookie(process.env.APP_COOKIE_NAME);
            return res.redirect('/admin');
        });
    }
}