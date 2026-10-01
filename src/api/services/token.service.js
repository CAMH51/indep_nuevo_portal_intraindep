// services/token.service.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {refreshToken} = require('../models/associations');
const { Op } = require('sequelize');


const ACCESS_EXPIRES  = '15m';   // corto — solo para operar
const REFRESH_EXPIRES = '7d';    // largo — para renovar
const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Genera access token (JWT firmado)
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: ACCESS_EXPIRES });
}

/**
 * Genera refresh token (opaco, aleatorio) y lo persiste en BD
 */
async function generateRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);

  const result = await refreshToken.create({
    fk_id_user: userId,
    token,
    f_expiracion: expiresAt
  });

  return result;
}

/**
 * Valida refresh token: existe, no está revocado y no expiró
 * Devuelve el registro completo o null
 */
async function findValidRefreshToken(token) {

    const result = await refreshToken.findOne({
        where: {
            token,
            revoked: false,
            f_expiracion: {
                [Op.gt]: new Date()
            }
        },
    });
    return result;

}

/**
 * Revoca un refresh token específico (logout)
 */
async function revokeRefreshToken(token) {
await refreshToken.update(
    { revoked: true },
    { where: { token } }
  );

}

/**
 * Revoca todos los refresh tokens de un usuario (logout de todos los dispositivos)
 */
async function revokeAllUserTokens(userId) {
    await refreshToken.update(
    { revoked: true },
    { where: { fk_id_user: userId } }
  );

}

/**
 * Limpieza periódica de tokens expirados (llamar con un cron)
 */
/* async function purgeExpiredTokens() {
  const [result] = await db.query(
    `DELETE FROM refresh_tokens WHERE expires_at < NOW() OR revoked = TRUE`
  );
  return result.affectedRows;
} */

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
 /*  purgeExpiredTokens, */
};