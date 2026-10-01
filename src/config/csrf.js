const { doubleCsrf } = require('csrf-csrf');

const {
  generateToken,
  doubleCsrfProtection,
  invalidCsrfTokenError, // útil para manejar el error específico
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: '__Host-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

module.exports = {
  generateToken,
  doubleCsrfProtection,
  invalidCsrfTokenError,
};