const {relUserSubapartadoModel,relUserModuloModel,relApartadoUser} = require('../models/associations');
const {transaction} = require('sequelize')

async function registrarRelUserSubapartado(dataSubapartados) {
    await relUserSubapartadoModel.bulkCreate(dataSubapartados,{transaction})
}

async function registrarRelUserApartados(dataApartados) {
    await relApartadoUser.bulkCreate(dataApartados,{transaction})
}

async function getApartadosUser(id_user) {
    const apartados =   await relApartadoUser.findAll({where:{fk_id_user:id_user}});

    return apartados;
}

async function registrarRelUserModulos(dataModulos) {
    await relUserModuloModel.bulkCreate(dataModulos,{transaction})
}

module.exports = {registrarRelUserSubapartado,registrarRelUserApartados,registrarRelUserModulos, getApartadosUser};