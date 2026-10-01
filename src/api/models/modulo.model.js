const dbConnection = require('../config/dbPostgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');

const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const modulo = dbConnection.define('modulos',{
    id_modulo:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    modulo:{
        type:DataTypes.STRING,
    },
    nombre:{
        type:DataTypes.STRING,
    },
    ruta:{
        type:DataTypes.STRING,
    },
    descripcion:{
        type:DataTypes.STRING
    },
    iscatalog:{
        type:DataTypes.BOOLEAN,
    },
    fk_id_user:{
        type:DataTypes.INTEGER,
    },
    activo:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    f_registro:{
            type: 'TIMESTAMP WITHOUT TIME ZONE',
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            get() { return formatTimestamp(this.getDataValue('f_registro')); } 
         },
         f_modificacion:{
            type: 'TIMESTAMP WITHOUT TIME ZONE',
            get() { 
                const value = this.getDataValue('f_modificacion');
                return value ? formatDate(value) : null;
             }
        }
},
{
    createdAt:false,
    updatedAt:false
});


module.exports = modulo;