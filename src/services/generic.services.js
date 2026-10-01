const axios = require('axios');

const apiIntraindep = axios.create({
    baseURL: process.env.API_URL,
    timeout:10_000,
});

apiIntraindep.interceptors.response.use(
    (response)=>response.data,
    (error)=>{
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        const map = {
            400:`Solicitud inválida: ${message}`,
            401:`No autorizado`,
            403:`Acceso denegado`,
            404:`Recurso no encontrado: ${message}`,
            500:`Error interno del servidor`,
            503:`Servicio no disponible`,

        }

        const err = new Error(map[status] ?? `Error inesperado (${status}): ${message}`);
        err.statusCode = status ?? 500;
        return Promise.reject(err);
    }
);

const fetchData = (url) => apiIntraindep.get(url);

const postData = (url, body) => {
    const isFormData = body instanceof FormData;
    return apiIntraindep.post(url, body, {
        headers: isFormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' },
    });
};

module.exports = {fetchData,postData};
