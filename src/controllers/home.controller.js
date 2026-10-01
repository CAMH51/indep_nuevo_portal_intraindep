
const {
    getNoticias,
    getCampaniasInternas,
    getServiciosPromociones,
    geteventosAvisos,
    getcumpleanios,
    getfotogalerias,
    getligas,
    getSubastas,
    getComunicados,
    getSistemas,
} = require('../api/services/public.service');
const {getVentanaVigente} = require('../api/services/ventanas_emergentes.service');
const {getAvisosVigentes} = require('../api/services/avisos_importantes.service')

const {getBySubapartados} = require('../api/services/catalogos/apartados.service')


const viewHome = async (req, res) => {
    try {
        const [
            noticias,
            campaniasInternas,
            serviciosPromociones,
            eventosAvisos,
            cumpleanios,
            fotografias,
            ligas,
            ventanasEmergentes,
            avisosImportantes,
            apartadosSubapartados
        ] = await Promise.all([
            getNoticias(),
            getCampaniasInternas(),
            getServiciosPromociones(),
            geteventosAvisos(),
            getcumpleanios(),
            getfotogalerias(),
            getligas(),
            getVentanaVigente(),
            getAvisosVigentes(),
            getBySubapartados()
        ]);

        res.render('home/index', {
            noticias,
            campaniasInternas,
            serviciosPromociones,
            eventosAvisos,
            cumpleanios,
            fotografias,
            ligas,
            ventanasEmergentes,
            avisosImportantes,
            apartadosSubapartados,
            isHome: true 
        });
    } catch (error) {
        console.error('Error al cargar home:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const viewHome2 = async (req, res) => {
    try {
        const [
            noticias,
            campaniasInternas,
            serviciosPromociones,
            eventosAvisos,
            cumpleanios,
            fotografias,
            ligas,
            ventanasEmergentes,
            avisosImportantes,
            apartadosSubapartados
        ] = await Promise.all([
            getNoticias(),
            getCampaniasInternas(),
            getServiciosPromociones(),
            geteventosAvisos(),
            getcumpleanios(),
            getfotogalerias(),
            getligas(),
            getVentanaVigente(),
            getAvisosVigentes(),
            getBySubapartados()
        ]);

        res.render('home/index_2', {
            noticias,
            campaniasInternas,
            serviciosPromociones,
            eventosAvisos,
            cumpleanios,
            fotografias,
            ligas,
            ventanasEmergentes,
            avisosImportantes,
            apartadosSubapartados,
            isHome: true 
        });
    } catch (error) {
        console.error('Error al cargar home 2:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const viewHomePrincipal = async (req, res) => {
    try {
        const [
            noticias,
            campaniasInternas,
            serviciosPromociones,
            eventosAvisos,
            cumpleanios,
            fotografias,
            ligas,
            ventanasEmergentes,
            avisosImportantes,
            apartadosSubapartados,
            subastas,
            comunicados,
            sistemas
        ] = await Promise.all([
            getNoticias(),
            getCampaniasInternas(),
            getServiciosPromociones(),
            geteventosAvisos(),
            getcumpleanios(),
            getfotogalerias(),
            getligas(),
            getVentanaVigente(),
            getAvisosVigentes(),
            getBySubapartados(),
            getSubastas(),
            getComunicados(),
            getSistemas()
        ]);

        res.render('home/home', {
            noticias,
            campaniasInternas,
            serviciosPromociones,
            eventosAvisos,
            cumpleanios,
            fotografias,
            ligas,
            ventanasEmergentes,
            avisosImportantes,
            apartadosSubapartados,
            subastas,
            comunicados,
            sistemas,
            isHome: true 
        });
    } catch (error) {
        console.error('Error al cargar home principal:', error);
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = {
    viewHome,
    viewHome2,
    viewHomePrincipal
};