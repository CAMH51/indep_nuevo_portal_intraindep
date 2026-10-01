const dbConnection = require('../config/dbPostgres');
const {DataTypes, Sequelize} = require('sequelize');
const day = require('dayjs');


const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const storage = dbConnection.define('storages',{
    id_storage:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    base_path:{
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Ruta absoluta en el sistema de archivos, ej: /var/www/dynamic-views'
    },
    directorio_principal:{
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    activo:{
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
        get() { 
            const value = this.getDataValue('f_modificacion');
            return value ? formatDate(value) : null;
         }
    }
},
{
    createdAt:false,
    updatedAt:false,
    scopes:{
        inactivos:{where:{activo:false}},
        activos:{where:{activo:true}},
        todos:{where:{}}
    },
    indexes:[]
});


module.exports = storage;