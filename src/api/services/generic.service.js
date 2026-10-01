const sequelize = require('../config/dbPostgres');
const {createBitacora} = require('./bitacora.service');


const genericService = (Model) =>({

    async getAll(scope = null, whereOpt = null){
        let result  = "";
        if(scope) {result = await Model.scope(['defaultScope', scope]).findAll({where:whereOpt !== null ? whereOpt : {}});}
        else {result = await Model.findAll({where:whereOpt !== null ? whereOpt : {}});}

        return result.length > 0 ?{status:200, success:true, data:result.map(item => item.toJSON()), msg:""}
        : {status:200, success:false, data:[], msg:'No existen registros'}
    },

    async getById(pkField,id, scope= null){

        const result = scope 
            ? await Model.scope(scope).find({where:{[pkField]:id}})
            : await Model.findOne({where:{[pkField]:id}});

        if(!result) return {status:404, success:false, msg:'Registro no encontrado'}
        console.log('result',[result.toJSON()]);
        return [result.toJSON()].length > 0 
        ? {status:201, success:true, data:[result.toJSON()], msg:""}
        : {status:201, success:true, data: [], msg:"No existen registros"}
    },

    async getAllById(pkField,id, scope= null){

        const result = scope 
            ? await Model.scope(scope).find({where:{[pkField]:id}})
            : await Model.findAll({where:{[pkField]:id}});

        if(!result) return {status:404, success:false, msg:'Registro no encontrado'}

        return result.length >0 
        ? {status:201, success:true, data: result.map(item => item.toJSON()), msg:""}
        : {status:201, success:true, data: [], msg:""}
    },

    async getAllWhere(optionWhere, scope= null){

        const result = scope 
            ? await Model.scope(scope).find({where:optionWhere})
            : await Model.findAll({where:optionWhere});

        if(!result) return {status:404, success:false, msg:'Registro no encontrado'}

        return result.length >0 
        ? {status:201, success:true, data: result.map(item => item.toJSON()), msg:""}
        : {status:201, success:true, data: [], msg:""}
    },

    async create(data,bitacora){
        const t = await sequelize.transaction();

        try {
            const result = await Model.create(data,{transaction:t});
           const bitacoraNew = await createBitacora('NUEVO/'+ bitacora.modelo,`${JSON.stringify(result.toJSON())}`,bitacora.fk_id_user);
           console.log('bitacora',bitacoraNew);
            await t.commit();
            return {status:201, success:true, data:result.toJSON(), msg:'Registro creado exitosamente'};
        } catch (error) {
            await t.rollback();
            console.error('Error completo:', {
            message: error.message,
            code: error.code,
            url: error.config?.url,        // ← qué URL intentó
            baseURL: error.config?.baseURL, // ← cuál es el baseURL
            requestData: error.config?.data // ← qué body envió
        });
            if(error.name === 'SequelizeUniqueConstraintError')
            return {status: 400,success:false, msg:'Ya existe un registro con esos datos unicos', detail:""}
            if(error.name === 'SequelizeValidationError')
                return { status:409, success:false, msg:'Error al crear el registro', detail:error.errors.map(e => e.message).join(', ')}
            return error;
            
        }

    },

    async update(pkField, id, data,bitacora, option={}){
        const { scope ='todos', modificationField= null, allowedFields = null} = option;
        const t = await sequelize.transaction();
        try {
            console.log('🔍 Buscando:', pkField, '=', id, '| scope:', scope);
            const result = await Model.findOne({
                where:{[pkField]:parseInt(id)}, 
                transaction: t});

                  console.log('📦 Result:', result);
            if(!result){
                await t.rollback();
                return {status:404, success:false, msg:'Registro no encontrado'}
            }
            
            let update = allowedFields
                ? Object.fromEntries(Object.entries(data).filter(([key])=> allowedFields.includes(key)))
                : data;
            
            if(modificationField) update[modificationField] = new Date();
            
            await result.update(update,{transaction:t});

            await createBitacora('ACTUALIZAR/'+ bitacora.modelo,`${JSON.stringify(result.toJSON())}`,bitacora.fk_id_user);

            await t.commit();
            return {status:200, success:true, data:result.toJSON(), msg:'Registro actualizado exitosamente'};
           
        } catch (error) {
            console.error('Error completo:', {
            message: error.message,
            code: error.code,
            url: error.config?.url,        // ← qué URL intentó
            baseURL: error.config?.baseURL, // ← cuál es el baseURL
            requestData: error.config?.data // ← qué body envió
        });
            if(t && !t.finished) await t.rollback();
            if(error.name === 'SequelizeValidationError')
                return {status: 400,success:false, msg:err.errors.map(e => e.message).join(', ')}
            return error;
        }
    },
    async delete(pkField, id, options = {}){
        const {activeField = 'activo',modificationField = null} = options;
        const t = await sequelize.transaction();
        
        try {
            const result = await Model.findOne({
                where:{[pkField]:id}, 
                transaction: t,
                lock:t.LOCK.UPDATE});
            if(!result){
                await t.rollback();
                throw {status:404, success:false, msg:'Registro no encontrado'}
            }

            const update = {[activeField]:false};
            if(modificationField) update[modificationField] = new Date();

            await result.update(update,{transaction:t});
            await t.commit();
            return  {status:200, success:true, data:result.toJSON(), msg:'Registro eliminado exitosamente'}
        } catch (error) {
            if(t && t.finished) await t.rollback();
            throw error;
        }      
    },

    async restore(pkField, id, options = {}){
        const {activeField = 'activo',modificationField = null, inactiveScope = 'inactivo'} = options;
        const t = await sequelize.transaction();

        try {
            const result = await Model.scope(inactiveScope).findOne({
                where:{[pkField]:id}, 
                transaction: t,
                lock:t.LOCK.UPDATE});
            if(!result){
                await t.rollback();
                throw {status:404, success:false, msg:'Registro no encontrado'}
            }

            const update = {[activeField]:true};
            if(modificationField) update[modificationField] = new Date();

            await result.update(update,{transaction:t});
            await t.commit();
            throw {status:200, success:true, data:result.toJSON(), msg:'Registro activado exitosamente'}

        } catch (error) {
            if(t && t.finished) await t.rollback();
            throw error;    
        }
    },

    async findOrCreate(where, defaults = {}) {
        const t = await sequelize.transaction();
        try {
            const [result, created] = await Model.findOrCreate({
                where,
                defaults,
                transaction: t
            });
            await t.commit();
            return { result, created };
        } catch (err) {
            if (t && !t.finished) await t.rollback();
            throw err;
        }
    },

    async count(scope = null) {
        return scope
            ? await Model.scope(scope).count()
            : await Model.count();
    },

    async bulkCreate(dataArray, options = {}) {
        const t = await sequelize.transaction();
        try {
            const result = await Model.bulkCreate(dataArray, {
                validate: true,
                transaction: t,
                ...options
            });
            await t.commit();
            return result;
        } catch (err) {
            if (t && !t.finished) await t.rollback();
            if (err.name === 'SequelizeValidationError')
                throw { status: 400, message: err.errors.map(e => e.message).join(', ') };
            throw err;
        }
    },

    // Permite ejecutar múltiples operaciones en una sola transacción compartida
    async withTransaction(callback) {
        const t = await sequelize.transaction();
        try {
            const result = await callback(t);
            await t.commit();
            return result;
        } catch (err) {
            if (t && !t.finished) await t.rollback();
            throw err;
        }
    },
    
    async toggle(pkField, id,bitacora, options = {}) {
    const {
        activeField = 'activo',
        modificationField = null,
        scope = null
    } = options;

    const t = await sequelize.transaction();
    try {
        const result = await Model.scope(scope).findOne({
            where: { [pkField]: id },
            transaction: t
        });
        if (!result) {
            await t.rollback();
            return { status: 404, message: `Registro no encontrado` };
        }

        const update = { [activeField]: !result.getDataValue(activeField) };
        if (modificationField) update[modificationField] = new Date();

        await result.update(update, { transaction: t });

        await createBitacora('ACTIVAR/DESACTIVAR/'+ bitacora.modelo,JSON.stringify(result.toJSON()),bitacora.fk_id_user);

        await t.commit();

        return {
            message: `Registro ${update[activeField] ? 'activado' : 'desactivado'} correctamente`,
            [activeField]: update[activeField],
            data: result.toJSON()
        };
    } catch (err) {
        if (t && !t.finished) await t.rollback();
        return err;
    }
}
});


module.exports = genericService;