const dbConnection = require('../config/dbPostgres');
const {DataTypes, Sequelize} = require('sequelize');
const day = require('dayjs');

const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const user = dbConnection.define('users',{
    id_user:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fk_id_rol:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_by:{
        type:DataTypes.INTEGER,
        allowNull: true,
    },
    activo:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    f_activo:{
        type: 'TIMESTAMP WITHOUT TIME ZONE',
        get() { return formatDate(this.getDataValue('f_activo')); }
    },
    f_desactivo:{
        type: 'TIMESTAMP WITHOUT TIME ZONE',
        get() { return formatDate(this.getDataValue('f_desactivo')); }
    }
    },{
    createdAt:false,
    updatedAt:false,
    scopes:{
        inactivos:{where:{activo:false}},
        activos:{where:{activo:true}},
        todos:{where:{}}
    },
   /*  indexes:[
        {name:idx_user_rol, fields:['fk_id_rol']},
        {name:idx_user_apartado, fields:['fk_id_apartado']}
    ] */
});



module.exports = user;