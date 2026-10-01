const dbConnection = require('../config/dbPostgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');


const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const fotogaleria = dbConnection.define('fotogalerias',{
    id_fotogaleria:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
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
     alt:{
        type:DataTypes.STRING
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
        {name:idx_fotogaleria_file, fields:['fk_id_file']},
        {name:idx_fotogaleria_user, fields:['fk_id_user']},
    ] */
});


module.exports = fotogaleria;