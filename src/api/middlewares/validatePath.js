const path = require('path');

/**
 * Valida que targetPath no escape de basePath (path traversal).
 * Devuelve la ruta absoluta resuelta.
 */
function validatePath(basePath, targetPath) {
  // Normalizar basePath
  const base = path.resolve(basePath);
  // Unir y resolver
  const resolved = path.resolve(base, targetPath);
  // Verificar que sigue dentro del base
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw new Error('Ruta inválida: posible path traversal');
  }
  return resolved;
}

/**
 * Sanitiza un nombre/ruta:
 * - Permite letras, números, guiones, guiones bajos y barras (para paths relativos)
 * - Elimina .. para evitar traversal
 * - Normaliza separadores a /
 */
function sanitizeName(name) {
  if (!name) return '';
  return name
    .replace(/\\/g, '/')           // normalizar backslashes
    .replace(/\.{2,}/g, '')        // eliminar ..
    .replace(/[^a-zA-Z0-9\-_\/\.]/g, '') // solo caracteres seguros
    .replace(/^\/+|\/+$/g, '')     // quitar / al inicio y fin
    .replace(/\/+/g, '/');         // colapsar // múltiples
}

module.exports = { validatePath, sanitizeName };