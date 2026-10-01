
const {fetchData} = require('../services/generic.services');
const {apiClient} = require('../services/api.service');
const {fetchGET, fetchPOST} = require('../services/fetch.service.js');



const getDataApi = async(session,endpoint) =>{
        const {fetchData} = apiClient(session);
        const {data} = await fetchData(endpoint);
        return data;
}

const render = (res, data) => res.status(200).render('dashboard', data);

const catalogsController = {
    getSubapartadosByUser: async(req, res) =>{
        try {
            const apartadosAll = await fetchData('/apartados/all');
            const subapartadosAll = await fetchData('/subapartados/all');
            const paginasAll = await fetchData('/paginas/all');
            
            render(res, { apartadosAll,subapartadosAll,paginasAll,page:'subapartados/index' });
        } catch (error) {
            return error.message;
        }
    },
    getApartadosByUser: async(req, res) =>{
        try {
            const apartadosAll = await fetchData('/apartados/all');
            render(res, { apartadosAll,page:'apartados/index' });
        } catch (error) {
            return error.message;
        }
    },
    getStoragesByView: async(req, res) =>{
        try {
            const storages = await fetchData('/api/storages/all');
            render(res, {storages, page:'storages/index' });
        } catch (error) {
            return error.message;
        }
    },

    getRolesByView: async(req, res) =>{
        try {
            const roles = await fetchData('/roles/all');
            render(res, {roles, page:'roles/index' });
        } catch (error) {
            return error.message;
        }
    },

    getModulosByView: async(req, res) =>{
        try {
            const modulos = await fetchData('/modulos/all');
            render(res, {modulos, page:'modulos/index' });
        } catch (error) {
            return error.message;
        }
    },

    getEtiquetasByView: async(req, res) =>{
        try {
            const etiquetas = await get(req.session.user.token,'/etiquetas/all');

            console.log('etiquetas',etiquetas);
            render(res, {etiquetas, page:'etiquetas/index' });
        } catch (error) {
            return error.message;
        }
    },
    getApartados : async () =>{
        try {
            const data = await fetchData('/apartados/all');
            return data;
        } catch (error) {
            return error.message;  
        } 
    },
    

    getUsers : async()=>{
        try {
            const data = await fetchData('/users/all');
            return data;
        } catch (error) {
           return error.message; 
        }
    },
        

    getRoles: async() =>{
        try {
            const data = await fetchData('/roles/all');
            return data;
        } catch (error) {
            return error.message; 
        } 
    },

    getSubapartadosByApartado:async(req, res) =>{
        try {
            const data = await fetchData(`/subapartados/apartado/${req.params.id}`);
            return data;
            
        } catch (error) {
            return error.message;
        }
    },

    getSubapartados: async(req, res) =>{
        try {
            const data = await fetchData(`/subapartados/${req.params.id}`);
            return data;
            
        } catch (error) {
            return error.message;
        }
    },

    getPaginas: async() =>{
        try {
            const data = await fetchData(`/paginas/all`);
            
            return data;
        } catch (error) {
            return error.message;
        }
    },

    getStorages: async(req, res) => {
        try {
            const data = await fetchData('/api/storages');
            return data;
        } catch (error) {
            return error.message;
        }
    },

    getStorageActivo: async() => {
        try {
            const data = await fetchData('/storages');
            return data;
        } catch (error) {
            return error.message;
        }
    },
    getModulos: async() => {
        try {
            const data = await fetchData('/modulos/all');
            return data;
        } catch (error) {
            return error.message;
        }
    },
     getRelUserModuloByUser: async(id) => {
        try {
            const data = await fetchData('/rel_users_modulos/user/'+id);
            return data;
        } catch (error) {
            return error.message;
        }
    },
    getRelUserSubapartadoByUser: async(id) => {
        try {
            const data = await fetchData('/rel_users_subapartados/user/'+id);
            return data;
        } catch (error) {
            return error.message;
        }
    },
    getRelUserModulo: async(id) => {
        try {
            const data = await fetchData('/rel_users_modulos/all/');
            return data;
        } catch (error) {
            return error.message;
        }
    },
    getRelUserSubapartado: async(id) => {
        try {
            const data = await fetchData('/rel_users_subapartados/all/');
            return data;
        } catch (error) {
            return error.message;
        }
    },




};

module.exports = catalogsController;
