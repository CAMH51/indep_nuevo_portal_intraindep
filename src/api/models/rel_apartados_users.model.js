const dbConnection = require('../config/dbPostgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');

const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');


const relApartadoUser = dbConnection.define('rel_apartados_users',{
    id_rel_apartado_user:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    fk_id_apartado:{
        type:DataTypes.INTEGER,

    },
    fk_id_user:{
        type:DataTypes.INTEGER,

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


module.exports = relApartadoUser;