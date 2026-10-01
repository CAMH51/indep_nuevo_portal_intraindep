const dbConnection = require('../config/dbPostgres');
const {DataTypes, Sequelize} = require('sequelize');
const day = require('dayjs');

const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const manual = dbConnection.define('manuales_sistemas',{
    id_manual_sistema:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    fk_id_user:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_id_sistema:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_id_archivo:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    titulo:{
        type:DataTypes.STRING,
        allowNull: true
    },
    activo:{
        type: DataTypes.BOOLEAN,
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
},
{
    createdAt:false,
    updatedAt:false,
    scopes:{
        inactivos:{where:{activo:false}},
        activos:{where:{activo:true}},
        todos:{where:{}}
    },
   /*  indexes:[
        {name:idx_subapartado_pagina, fields:['fk_id_pagina']},
        {name:idx_subapartado_apartado, fields:['fk_id_apartado']}
    ] */
});



module.exports = manual;