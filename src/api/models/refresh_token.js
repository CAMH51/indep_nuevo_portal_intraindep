const dbConnection = require('../config/dbPostgres');
const {DataTypes, Sequelize} = require('sequelize');
const day = require('dayjs');



const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const refreshToken = dbConnection.define('refresh_tokens',{
    id_refresh_token:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    fk_id_user:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    token:{
        type: DataTypes.STRING,
        allowNull: false
    },
    revoked:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    f_creacion:{
       type: 'TIMESTAMP WITHOUT TIME ZONE',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        get() { return formatTimestamp(this.getDataValue('f_creacion')); } 
    },
    f_expiracion:{
        type: 'TIMESTAMP WITHOUT TIME ZONE',
        get() { 
            const value = this.getDataValue('f_expiracion');
            return value ? formatDate(value) : null;
        }
    }
},
{
    createdAt:false,
    updatedAt:false
/*     indexes:[
        {name:idx_apartado_pagina, fields:['fk_id_pagina']}
    ] */
});

module.exports = refreshToken;