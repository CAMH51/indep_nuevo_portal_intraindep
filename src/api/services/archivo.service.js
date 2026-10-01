const path = require('path');
const fs = require('fs');
const dbConnection = require('../config/dbPostgres');
const {archivoModel} = require('../models/associations')

class ArchivoService {
    static async saveFile(file, userId, storageId) {
        if (!file) throw { status: 400, success: false, msg: "No se recibió ningún archivo" };

        const t = await dbConnection.transaction();

        console.log('file',file);
        console.log('userId',userId);
        console.log('storageId',storageId);

        try {
            const ext  = path.extname(file.originalname).replace('.', '').toLowerCase();
            const name = path.basename(file.filename, path.extname(file.filename));

            const result = await archivoModel.create({
                nombre_archivo:  name + '.' + ext,
                ext_archivo:   ext,
                tamanio_archivo:  file.size,
                ruta_archivo:  file.path,
                fk_id_user: userId,
                fk_id_storage:storageId
            }, { transaction: t });

            console.log('result',result);

            await t.commit();
            return { status: 201, success: true, data: result, msg: 'Archivo guardado exitosamente' };

        } catch (error) {
            await t.rollback();
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            throw { status: 500, success: false, msg: 'Error al guardar el archivo', detail: error.message };
        }
    }


   /*  static async deleteFile(fileId, userId){
        const t = await dbConnection.transaction();

        try {
            const  file = await archivoModel.findOne({
                where: { id_file: fileId, fk_id_user: userId }
            });

            if(!file) throw {status: 404, success:false, msg:'Archivo no encontrado'};

            await file.update({
                activo:false,
                f_modificacion: new Date()
            },{transaction:t});

            await t.commit();

            return {status:200, success:true, data:file, msg:'Archivo eliminado exitosamente'};
        } catch (error) {
            await t.rollback();
            throw {status: 500,success:false, msg:'Error al eliminar el archivo', detail:error.message}

        }
    };*/
} 

module.exports = ArchivoService;