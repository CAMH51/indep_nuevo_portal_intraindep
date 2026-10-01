const dbConnection = require('../config/dbPostgres');
const {Sequelize, DataTypes} = require('sequelize');
const day = require('dayjs');

const formatTimestamp = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');
const formatDate = (value) => day(value).format('YYYY-MM-DD HH:mm:ss');

const ventanaEmergente = dbConnection.define('ventanas_emergentes',{
    id_ventana_emergente:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    titulo:{
        type:DataTypes.STRING
    },
    descripcion:{
        type:DataTypes.STRING,
    },
    fk_id_archivo:{
        type:DataTypes.INTEGER,
        allowNull: true,

    },
     fk_id_user:{
         type:DataTypes.INTEGER,
         allowNull: false,

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
        get() { return formatDate(this.getDataValue('f_modificacion')); }
    }
},{
    createdAt:false,
    updatedAt:false,
    validate:{
        fechaTerminoValida(){
            if(this.f_termino && this.f_inicio){
                if(new Date(this.f_termino) < new Date(this.f_inicio)){
                    throw new Error('La fecha de término debe ser mayor a la fecha de inicio');
                }
            }
        }
    },
    scopes:{
        inactivos:{where:{activo:false}},
        todos:{where:{}}
    },
/*     indexes:[
        {name:idx_ventana_file, fields:['fk_id_file']},
        {name:idx_ventana_user, fields:['fk_id_user']},
    ] */
});


module.exports = ventanaEmergente;