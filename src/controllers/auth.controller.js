const {loginAD,loginDB,refresh} = require('../api/services/auth.service');

const  loginDBCtrl = async(req, res)=>{
    try {
        const {user,pass} = req.body;
        const dataLoginAD = await loginDB(user,pass);
        console.log('dataLoginAD',dataLoginAD);

/*         if(dataLoginAD.success === true){
            const response  = await fetch(process.env.API_URL + '/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'authorization': `Bearer ${dataLoginAD.token}`
                },
                body:{}
            });
            const dataResponse = await response.json();

            if(response.ok){

            }
        } */

        const dataSession ={
            token:   dataLoginAD.token,
            //refreshToken: dataLoginAD.refreshToken,
            id_user:  dataLoginAD.userDB.id_user,
            email:    dataLoginAD.userDB.email,
            id_rol:   dataLoginAD.userDB.rol.id_rol,
            rol:      dataLoginAD.userDB.rol.rol,
        };
        req.session.user = dataSession;

        setAuthCookie(res, dataLoginAD.token);

        return res.status(200).json({
            success: true,
            msg: 'Inicio de Sesión Correcto',
            token:        dataLoginAD.token,
            refreshToken: dataLoginAD.refreshToken,
            dataSession,
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
} 

/* async function verificarOTP(code){
    const response = await fetch(process.env.API_URL+'/2fa/verify',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({code:code})
    });

    const data = await response.json();
    return data;
} */

const  loginADCtrl = async(req, res)=>{
    try {
        const {user,pass} = req.body;
        const dataLoginAD = await loginAD(user,pass);

        if(dataLoginAD.success === false){
            return res.status(401).json(dataLoginAD);
        }
        console.log('dataLoginAD',dataLoginAD);


        const dataSession ={
            nombre:  dataLoginAD.dataAD[0].Nombre,
            area:    dataLoginAD.dataAD[0].AreaDesc,
            puesto:  dataLoginAD.dataAD[0].PuestoDesc,
            correo:  dataLoginAD.dataAD[0].Correo,
            ext:     dataLoginAD.dataAD[0].Ext,
            token:   dataLoginAD.token,
            refreshToken: dataLoginAD.refreshToken,
            id_user:  dataLoginAD.userDB.id_user,
            email:    dataLoginAD.userDB.email,
            id_rol:   dataLoginAD.userDB.rol.id_rol,
            rol:      dataLoginAD.userDB.rol.rol,
        };
        req.session.user = dataSession;

        setAuthCookie(res, dataLoginAD.token);

        return res.status(200).json({
            success: true,
            msg: 'Inicio de Sesión Correcto',
            token:        dataLoginAD.token,
            refreshToken: dataLoginAD.refreshToken,
            dataSession,
        });

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
} 

const setAuthCookie = (res, token) => {
    const days = Number(process.env.COOKIE_EXPIRES) || 1;
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    });
};

exports.refreshAD = async(req, res)=>{
    const {token, refreshToken } = req.session?.user;

    console.log('req.session?.user',req.session?.user);
    console.log('token',token);
    console.log('refreshToken',refreshToken);
    if (!token) {
        return res.status(401).json({ success: false, msg: 'No hay sesión activa' });
    }

    
    try {
        const dataRefresh = await refresh(refreshToken);

        console.log('dataRefresh',dataRefresh);
    
        const dataSession ={
                nombre:  dataRefresh.dataAD[0].Nombre,
                area:    dataRefresh.dataAD[0].AreaDesc,
                puesto:  dataRefresh.dataAD[0].PuestoDesc,
                correo:  dataRefresh.dataAD[0].Correo,
                ext:     dataRefresh.dataAD[0].Ext,
                token:        dataRefresh.newAccessToken,   // ✅ nombre correcto
                refreshToken: dataRefresh.newRefreshToken,
                id_user:  dataRefresh.userDB.id_user,
                email:    dataRefresh.userDB.email,
                id_rol:   dataRefresh.userDB.rol.id_rol,
                rol:      dataRefresh.userDB.rol.rol,
            };
            req.session.user = dataSession;
    
            setAuthCookie(res, dataRefresh.newAccessToken);
    
            return res.status(200).json({
                success: true,
                msg: 'Inicio de Sesión Correcto',
                token:        dataRefresh.newAccessToken,
                refreshToken: dataRefresh.newRefreshToken,
                dataSession,
            });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

exports.login = (req, res) => {
    if (process.env.ACTIVE_DIRECTORY === 'true') {
        return loginADCtrl(req, res);
    }
    return loginDBCtrl(req, res);
};

exports.logout = async(req, res) =>{
    req.session.destroy((err) => {
    //res.clearCookie(process.env.APP_COOKIE_NAME);

        
        // Enviar respuesta con script para limpiar historial
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Cerrando sesión...</title>
                <script>
                    // Limpiar el historial del navegador
                    if (window.history && window.history.pushState) {
                        window.history.pushState(null, null, window.location.href);
                        window.onpopstate = function() {
                            window.history.pushState(null, null, window.location.href);
                        };
                    }
                    
                    // Redirigir al login después de limpiar
                    setTimeout(() => {
                        window.location.replace('/admin');
                    }, 100);
                </script>
            </head>
            <body>
                <p>Cerrando sesión...</p>
            </body>
            </html>
        `);
    });
}