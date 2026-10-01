const { Sequelize } = require('sequelize');

// Configuración de la base de datos desde variables de entorno
const sequelize = new Sequelize(
process.env.PG_DB_NAME,
process.env.PG_DB_USER,
process.env.PG_DB_PASSWORD,
{
    host: process.env.PG_DB_HOST,
    port: process.env.PG_DB_PORT,
    dialect: 'postgres',
    timezone:'America/Mexico_City',
    logging: process.env.NODE_ENV === 'DEV' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
          ssl: {
    rejectUnauthorized: false // Solo para desarrollo
  }
    },
    define: {
        timestamps: true,
        underscored: true
    }
}
);

module.exports = sequelize;