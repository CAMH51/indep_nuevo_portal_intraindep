const axios = require('axios');

const apiClient = (token) =>{
    const instance =axios.create({
    baseURL: process.env.API_URL,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    timeout: 30000
    });

    instance.interceptors.response.use(
        res => res,
        error => {

            const {status, data} = error.response ?? {}
            
            if (status === 401) error.isUnauthorized = true;
            else if(status === 403) error.isForbidden = true;
            else if(status === 500) error.isInternalServerError = true;
            


            return Promise.reject(error);
        }
    );



const fetchData = (url) => instance.get(url);

const postData = (url, body) => {
    const isFormData = (typeof FormData !== 'undefined' && body instanceof FormData) 
                        || body?.getHeaders; // ← cubre form-data de Node.js

    const config = {
        headers: {
            ...(isFormData 
                ? body.getHeaders?.() // form-data de Node genera headers con boundary
                : { 'Content-Type': 'application/json' }
            )
        }
    };

    return instance.post(url, body, config);
};
  

    return {instance, fetchData, postData};
}

module.exports = { apiClient };