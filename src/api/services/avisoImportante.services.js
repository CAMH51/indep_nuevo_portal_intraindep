const { Op } = require('sequelize');
const day = require('dayjs');

const avisoImportanteModel = require('../models/avisos_importantes.model');
const noticiaModel = require('../models/noticia.model');
const campaniaInternaModel = require('../models/campania_interna');
const servicioPromocionModel = require('../models/servicio_pormocion');
const eventoAvisoModel = require('../models/eventosAvisos.model');
const cumpleanioModel = require('../models/cumpleanio.model');
const linkModel = require('../models/ligas.model');

const archivoModel = require('../models/archivos.model');
const paginaModel = require('../models/pagina.model');



const includeOrigenes = [
    {model:noticiaModel, as: 'noticia', required:false, include:[
        {model:archivoModel, as: 'archivo', required:false},
        {model:paginaModel, as: 'pagina', required:false},
    ]},
    {model:campaniaInternaModel, as: 'campania_interna', required:false, include:[
        {model:archivoModel, as: 'archivo', required:false},
        {model:paginaModel, as: 'pagina', required:false},
    ]},
    {model:servicioPromocionModel, as: 'servicio_promocion', required:false, include:[
        {model:archivoModel, as: 'archivo', required:false},
        {model:paginaModel, as: 'pagina', required:false},
    ]},
    {model:eventoAvisoModel, as: 'evento_aviso', required:false,include:[
        {model:archivoModel, as: 'archivo', required:false}
    ]},
    {model:cumpleanioModel, as: 'cumpleanio', required:false,include:[
        {model:archivoModel, as: 'archivo', required:false}
    ]},
    {model:linkModel, as: 'link', required:false, include:[
        {model:paginaModel, as: 'pagina', required:false}
    ]},
];


exports.getAvisosVigentes = async () =>{
    const hoy = day().format('YYYY-MM-DD');
    const avisos = await avisoImportanteModel.findAll({
        where:{
            activo:true,
            f_inicio:{[Op.lte]:hoy},
            f_termino:{[Op.gte]:hoy},
        },
        include:includeOrigenes,
        order:[
            ['f_registro','DESC']
        ]
    }); 

    console.log('avisos_service',avisos);

    return avisos.length > 0 ? {success: true,status:201, msg:"", data:avisos, total_registros:avisos.length, error:""} : {success: false,status:200, msg:"No existen registros", data:[]};
}

exports.getAvisosTodos = async()=>{
    const avisos = await avisoImportanteModel.findAll({
        include:includeOrigenes,
        order:[
            ['f_registro','DESC']
        ]
    });
    return avisos;
}

exports.getAvisosByUser = async(id)=>{
    const avisos = await avisoImportanteModel.findAll(
        {where:{fk_id_user:id},
        include:includeOrigenes,
        order:[
            ['f_registro','DESC']
        ]
    });
    return avisos;
}

exports.getAvisoById = async(id)=>{
    const aviso = await avisoImportanteModel.findOne({
        where:{id_aviso:id},
        include:includeOrigenes,
    });

    if(!aviso) throw new Error('Aviso no encontrado');
    return aviso;
}

exports.createAviso = async(data)=>{
    const {tipo_origen, id_noticia, id_campania_interna, id_servicio_promocion, id_evento_aviso, id_cumpleanio, id_liga, f_inicio, f_termino, fk_id_user} = data;

    const nuevoAviso = await avisoImportanteModel.create({
        tipo_origen,
        id_noticia: id_noticia ?? null,
        id_campania_interna: id_campania_interna ?? null,
        id_evento_aviso: id_evento_aviso ?? null,
        id_servicio_promocion: id_servicio_promocion ?? null,
        id_cumpleanio: id_cumpleanio ?? null,
        id_liga:id_liga ?? null,
        f_inicio,
        f_termino,
        fk_id_user
    });

    return nuevoAviso;
}

exports.updateAviso = async(id,data)=>{
    const aviso = await avisoImportanteModel.findOne({where:{id_aviso:id}});
    if(!aviso) throw new Error('Aviso no encontrado');

    await aviso.update(data);
    return aviso;
}


exports.toggleActivoAviso = async(id)=>{
    const aviso = await avisoImportanteModel.findOne({where:{id_aviso:id}});
    if(!aviso) throw new Error('Aviso no encontrado');

    await aviso.update({activo:!aviso.activo});

    return aviso;
}

