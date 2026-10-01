const {
    noticiaModel,
    campaniaInternaModel,
    servicioPromocionModel,
    eventoAvisoModel,
    cumpleanioModel,
    fotogaleriaModel,
    ventanaEmergenteModel,
    ligaModel,
    avisoImportanteModel,
    subastaModel,
    comunicadosModel,
    sistemasModel
} = require('../models/associations');

const getNoticias =async(whereOptions={}) =>{
    try {
        const noticias = await noticiaModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return noticias;
    } catch (error) {
        return error;
    }
}

const getCampaniasInternas  =async(whereOptions={}) =>{
    try {
        const campaniasInternas = await campaniaInternaModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return campaniasInternas;
    } catch (error) {
        return error;
    }
}

const getServiciosPromociones  =async(whereOptions={}) =>{
    try {
        const serviciosPromociones = await servicioPromocionModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return serviciosPromociones;
    } catch (error) {
        return error;
    }
}

const geteventosAvisos  =async(whereOptions={}) =>{
    try {
        const eventosAvisos = await eventoAvisoModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return eventosAvisos;
    } catch (error) {
        return error;
    }
}

const getcumpleanios  =async(whereOptions={}) =>{
    try {
        const cumpleanios = await cumpleanioModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return cumpleanios;
    } catch (error) {
        return error;
    }
}

const getfotogalerias  =async(whereOptions={}) =>{
    try {
        const fotografias = await fotogaleriaModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return fotografias;
    } catch (error) {
        return error;
    }
}

const getligas  =async(whereOptions={}) =>{
    try {
        const ligas = await ligaModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return ligas;
    } catch (error) {
        return error;
    }
}

const getVentanasEmergentes  =async(whereOptions={}) =>{
    try {
        const ventanasEmergentes = await ventanaEmergenteModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return ventanasEmergentes;
    } catch (error) {
        return error;
    }
}

const getAvisosImportantes  =async(whereOptions={}) =>{
    try {
        const avisosImportantes = await avisoImportanteModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return avisosImportantes;
    } catch (error) {
        return error;
    }
}


const getSubastas  =async(whereOptions={}) =>{
    try {
        const subasta = await subastaModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return subasta;
    } catch (error) {
        return error;
    }
}

const getComunicados = async (whereOptions = {}) => {
    try {
        const comunicados = await comunicadosModel
            .scope(['defaultScope', 'activos'])
            .findAll(whereOptions);

        const agrupados = comunicados.reduce((acc, item) => {
            const data = item.toJSON();
            const dep = data.departamento;

            const key = dep ? dep.id_departamento_comunicado : 'sin_departamento';

            if (!acc[key]) {
                acc[key] = {
                    id_departamento_comunicado: dep?.id_departamento_comunicado ?? null,
                    titulo: dep?.titulo ?? 'Sin departamento',
                    siglas: dep?.siglas ?? null,
                    comunicados: []
                };
            }

            // quitamos el objeto "departamento" duplicado dentro de cada comunicado
            const { departamento, ...comunicadoData } = data;
            acc[key].comunicados.push(comunicadoData);

            return acc;
        }, {});

        // devolvemos como array de departamentos (más fácil de recorrer en el front)
        return Object.values(agrupados);
    } catch (error) {
        return error;
    }
};

const getSistemas  =async(whereOptions={}) =>{
    try {
        const sistemas = await sistemasModel.scope(['defaultScope', 'activos']).findAll(whereOptions);

        return sistemas;
    } catch (error) {
        return error;
    }
}

module.exports ={
    getNoticias,
    getCampaniasInternas,
    getServiciosPromociones,
    geteventosAvisos,
    getcumpleanios,
    getfotogalerias,
    getligas,
    getVentanasEmergentes,
    getAvisosImportantes,
    getSubastas,
    getComunicados,
    sistemasModel,
    getSistemas
}