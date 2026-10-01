const storagesServices = require('../../api/services/catalogos/storages.service');
const paginasServices = require('../../api/services/paginas.service');


const getDataEditor = async(storageId,DatabaseMirroringPartnerEnvChangeToken,filenam)=>{
    try {
         const {storageId, dirPath, filename} = req.query;
        const editorPages = await storagesServices.renderEditor(storageId, dirPath, filename);
        const pagina = await paginasServices.getPaginas({where:{nombre_pag:filename}});

        if(pagina && pagina.length > 0){
            dir_path = pagina.ruta_pag;
            file_name = pagina.nombre_pag;
        }else{
            dir_path = editorPages.dirPath;
            file_name = editorPages.filename;
        }
    } catch (error) {
        
    }
}