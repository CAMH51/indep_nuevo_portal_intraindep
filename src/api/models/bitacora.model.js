const dbConnection = require('../config/dbPostgres');
const {DataTypes, Sequelize} = require('sequelize');
const day = require('dayjs');



const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD');

const bitacora = dbConnection.define('bitacoras',{
    id_bitacora:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    fk_id_user:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    accion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ip:{
        type: DataTypes.STRING,
        allowNull: false
    },
    detalles:{
        type: DataTypes.STRING,
        allowNull: false
    },
    f_registro:{
       type: 'TIMESTAMP WITHOUT TIME ZONE',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        get() { return formatTimestamp(this.getDataValue('f_registro')); } 
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
/*     indexes:[
        {name:idx_bitacora_user, fields:['fk_id_user']}
    ] */
});

module.exports = bitacora;
