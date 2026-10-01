const dbConnection = require('../config/dbPostgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');

const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const eventoAviso = dbConnection.define('eventos_avisos',{
    id_evento_aviso:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre_evento_aviso:{
        type:DataTypes.STRING,
    },
    descripcion:{
        type:DataTypes.STRING,
    },
    fk_id_archivo:{
        type:DataTypes.INTEGER,
        allowNull: true,

    },
     fk_id_user:{
         type:DataTypes.INTEGER,
         allowNull: false,

     },
     activo:{
         type:DataTypes.BOOLEAN,
         defaultValue: false
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
},{
    createdAt:false,
    updatedAt:false,
     scopes:{
        inactivos:{where:{activo:false}},
        activos:{where:{activo:true}},
        todos:{where:{}}
    },
/*     indexes:[
        {name:idx_evento_file, fields:['fk_id_file']},
        {name:idx_evento_user, fields:['fk_id_user']}
    ] */
});


module.exports = eventoAviso;