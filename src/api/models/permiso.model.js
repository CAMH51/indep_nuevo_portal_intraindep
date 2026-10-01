const dbConnection = require('../config/dbPostrgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');

const permiso = dbConnection.define('permisos',{
    id_permiso:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    permiso:{
        type:DataTypes.STRING,
    },
    isactivo:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    f_registro:{
            type: 'TIMESTAMP WITHOUT TIME ZONE',
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            get(){
                const rawValue = this.getDataValue('f_registro');
                return day(rawValue).format('YYYY-MM-DD HH:mm:ss');
            }
    }
},{
    createdAt:false,
    updatedAt:false
});

module.exports = permiso;