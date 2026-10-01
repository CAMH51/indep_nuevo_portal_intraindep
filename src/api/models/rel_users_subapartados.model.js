const dbConnection = require('../config/dbPostgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');
require('dayjs/locale/es');
day.locale('es');

const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');


const relUserSubapartado = dbConnection.define('rel_users_subapartados',{
    id_rel_user_subapartado:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    fk_id_user:{
        type:DataTypes.INTEGER,
        allowNull: false,

    },
    fk_id_subapartado:{
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
        {name:idx_rel_user_subapartado_user, fields:['fk_id_user']},
        {name:idx_rel_user_subapartado_subapartado, fields:['fk_id_subapartado']},
    ] */
});


module.exports = relUserSubapartado;