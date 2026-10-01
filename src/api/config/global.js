const service = require('../services/postgres.services');
const storageModel = require('../models/stogares.model');
module.exports = {
    storagePath : async () => {
        const storage = await service.getData(storageModel,"",{activo:true});
        console.log('storage activo', storage.data[0].base_path);
        return storage.data[0].base_path;
    },
    id_storage: async () => {
        const storage = await service.getData(storageModel,"",{activo:true});
        console.log('storage activo', storage.data[0].base_path);
        return storage.data[0].id_storage;
    }
}