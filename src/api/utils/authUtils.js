// utils/authUtils.js

exports.normalizeUser = (rawUser) => {
    // Limpiar espacios y convertir a minúsculas
    const cleaned = rawUser.trim().toLowerCase();

    let username;
    let fullEmail;

    if (cleaned.includes('@')) {
        // Caso 1: usuario ingresó correo completo → "juan.perez@dominio.com"
        fullEmail = cleaned;
        username  = cleaned.split('@')[0];          // "juan.perez"
    } else if (cleaned.includes('\\')) {
        // Caso 2: usuario ingresó formato dominio\usuario → "DOMINIO\juan.perez"
        username  = cleaned.split('\\')[1];         // "juan.perez"
        fullEmail = `${username}@${process.env.AD_DOMAIN}`;
    } else {
        // Caso 3: usuario ingresó solo el nombre → "juan.perez"
        username  = cleaned;
        fullEmail = `${cleaned}@${process.env.AD_DOMAIN}`;
    }

    return { username, fullEmail };
};