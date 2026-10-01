const dbConnection = require('../config/dbPostgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');

const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD');


const archivo = dbConnection.define('archivos', {
    id_archivo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_archivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ext_archivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tamanio_archivo: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    ruta_archivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
     fk_id_storage: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    fk_id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    f_registro:{
       type: 'TIMESTAMP WITHOUT TIME ZONE',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        get() { return formatTimestamp(this.getDataValue('f_registro')); } 
    },
    f_modificacion:{
        type: 'TIMESTAMP WITHOUT TIME ZONE',
        get() { return formatDate(this.getDataValue('f_modificacion')); }
    }
}, {
    createdAt: false,
    updatedAt: false,
    scopes:{
        inactivos:{where:{activo:false}},
        activos:{where:{activo:true}},
        todos:{where:{}}
    },
/*     indexes:[
        {name:idx_archivos_user, fields:['fk_id_user']}
    ] */
});



module.exports = archivo;
