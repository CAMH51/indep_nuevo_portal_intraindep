
const usersServices = require('../../api/services/catalogos/users.service');
const modulosServices = require('../../api/services/catalogos/modulos.service');
const rolesServices = require('../../api/services/catalogos/roles.service');
const apartadosServices = require('../../api/services/catalogos/apartados.service');





const viewUsers = async(req, res)=>{
    const roles = await rolesServices.getRoles();
    res.render('admin/dashboard',{
        page:'catalogos/users/index',
        roles
    })
}

const getUsers = async(req, res)=>{
    try {
        const users = await usersServices.getUsers();
        res.status(200).json({success:true,data:users});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getUsersByUser = async(req, res)=>{
    try {
        const users = await usersServices.getUserByuser(req.session.user.id_user);
        res.status(200).json({success:true,data:users});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getUserByEmail = async(req, res)=>{
    try {
        const {email} = req.body;
        const users = await usersServices.getUserByEmail(email,req.session.user.email);
        if(users.success){
            res.status(200).json(users);

        }else{
            res.status(404).json(users);
        }
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const getUser = async(req, res)=>{
    try {
        const user = await usersServices.getUserById(req.params.id);
        res.status(200).json({success:true,data:user});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});    
    }
}

const createUser = async(req, res)=>{
    try {
        console.log(req.body);
         const {email,fk_id_rol,modulos, apartados} = req.body;
        const existe = await usersServices.getUsers({where:{email:email}});

        console.log('existe',existe);


        if(existe.length > 0){
            return res.status(400).json({success:false,msg:'El usuario ya existe'});
        }

        const dataUser ={
            email,
            created_by:req.session.user.id_user,
            fk_id_rol,
            fk_id_user: req.session.user.id_user,
            f_modificacion: new Date()
        }
        const user = await usersServices.createUser(dataUser);


        const modulosArray = modulos.map(modulo=>{
            return {
                fk_id_modulo:modulo,
                fk_id_user: user.dataValues.id_user
            }
        });

        const apartadosArray = apartados.map(apartado=>{
            return{
                fk_id_apartado:apartado,
                fk_id_user: user.dataValues.id_user
            }
        });

        const modulo = await modulosServices.createModuloUser(modulosArray);
        const apartado = await apartadosServices.createApartadoByUser(apartadosArray)
        res.status(200).json({success:true,data:user});  
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


const updateUser = async(req, res)=>{
    try {
        console.log('updateUser body:', req.body);
        const {id} = req.params;
        const dataUser = {
            email:req.body.editEmail,
            fk_id_rol:req.body.editFkIdRol,
            f_modificacion: new Date()
        }
        const user = await usersServices.updateUser(id,dataUser);

        // Sincronizar módulos si vienen en la petición
        if (req.body.modulos || req.body['modulos[]']) {
            const rawModulos = req.body.modulos || req.body['modulos[]'];
            const modulos = Array.isArray(rawModulos) ? rawModulos : [rawModulos];
            await modulosServices.deleteModulosByUser(id);
            const modulosArray = modulos.filter(Boolean).map(modulo => ({
                fk_id_modulo: modulo,
                fk_id_user: id,
                f_modificacion: new Date()
            }));
            if (modulosArray.length > 0) {
                await modulosServices.createModuloUser(modulosArray);
            }
        } else if (req.body.editFkIdRol) {
            await modulosServices.deleteModulosByUser(id);
        }

        // Sincronizar apartados si vienen en la petición
        if (req.body.apartados || req.body['apartados[]']) {
            const rawApartados = req.body.apartados || req.body['apartados[]'];
            const apartados = Array.isArray(rawApartados) ? rawApartados : [rawApartados];
            await apartadosServices.deleteApartadosByUser(id);
            const apartadosArray = apartados.filter(Boolean).map(apartado => ({
                fk_id_apartado: apartado,
                fk_id_user: id,
                f_modificacion: new Date()
            }));
            if (apartadosArray.length > 0) {
                await apartadosServices.createApartadoByUser(apartadosArray);
            }
        } else if (req.body.editFkIdRol) {
            await apartadosServices.deleteApartadosByUser(id);
        }

        res.status(200).json({success:true,data:user});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}

const activarUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;

        const activar= await usersServices.activarUser(id,status);
        res.status(200).json({success:true,data:activar});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}


module.exports = {
    viewUsers,
    getUsers,
    getUserByEmail,
    getUsersByUser,
    getUser,
    createUser,
    updateUser,
    activarUser
};