const dbConnection = require('../config/dbPostgres');
const {DataTypes, Sequelize} = require('sequelize');
const day = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
day.extend(relativeTime);

const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const comunicado = dbConnection.define('comunicados',{
    id_comunicado:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    fk_id_user:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fk_id_archivo:{
        type:DataTypes.INTEGER,
        allowNull: true
    },
    fk_id_pagina:{
        type:DataTypes.INTEGER,
        allowNull: true
    },

    fk_id_departamento_comunicado:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    url_comunicado:{
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
    },

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



module.exports = comunicado;