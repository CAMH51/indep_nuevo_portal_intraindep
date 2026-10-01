const dbConnection = require('../config/dbPostgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');


const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD');

const avisoImportante = dbConnection.define('avisos_importantes',{
    id_aviso:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    titulo:{
        type:DataTypes.STRING,
    },
    descripcion:{
        type:DataTypes.STRING,
    },
    fk_id_pagina:{
        type:DataTypes.INTEGER,
    },
    url_pagina:{
        type:DataTypes.STRING,
    },

    f_inicio:{
        type:DataTypes.DATEONLY,
        get(){
            const rawValue = this.getDataValue('f_inicio');
            return rawValue ? day(rawValue).format('YYYY-MM-DD') : null;
        }
    },
    f_termino:{
        type:DataTypes.DATEONLY,
        get(){
            const rawValue = this.getDataValue('f_termino');
            return rawValue ? day(rawValue).format('YYYY-MM-DD') : null;
        }
    },
    fk_id_user:{
        type:DataTypes.INTEGER,
        
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
    constraints:false,
    validate:{
        fechaTerminoValida(){
            if(this.f_termino && this.f_inicio){
                if(new Date(this.f_termino) < new Date(this.f_inicio)){
                    throw new Error('La fecha de término debe ser mayor a la fecha de inicio');
                }
            }
        }
    }
});



module.exports = avisoImportante;