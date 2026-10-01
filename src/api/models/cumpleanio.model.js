const dbConnection = require('../config/dbPostgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');


const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const cumpleanio = dbConnection.define('cumpleanios',{
    id_cumpleanio:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:DataTypes.STRING,
    },
    ap_paterno:{
        type:DataTypes.STRING,
    },
    ap_materno:{
        type:DataTypes.STRING,
    },
    f_nacimiento:{
        type:DataTypes.DATEONLY,
        get(){
            const rawValue = this.getDataValue('f_nacimiento');
            return day(rawValue).format('YYYY-MM-DD');
        }
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
        {name:idx_cumpleanio_file, fields:['fk_id_file']},
        {name:idx_cumpleanio_user, fields:['fk_id_user']}
    ] */
});




module.exports = cumpleanio;