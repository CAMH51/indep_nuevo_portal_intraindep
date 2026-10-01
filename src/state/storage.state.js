// src/state/storage.state.js
let _storages = [];

module.exports = {
  setStorages(data) {
    _storages = Array.isArray(data) ? data : [];
  },
  getStorages() {
    return _storages;
  },
  getActive() {
    return _storages[0] ?? null;
  },
  getBasePath() {
    return _storages[0]?.base_path ?? null;
  },
  getIdStorage() {
    return _storages[0]?.id_storage ?? null;
  },

};