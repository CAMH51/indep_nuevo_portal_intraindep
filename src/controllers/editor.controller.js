const storagesServices = require('../api/services/catalogos/storages.service');
const paginasServices = require('../api/services/paginas.service');


const viewEditor = async(req, res) =>{
    try {
        let dir_path = "";
        let file_name = "";

        const {storageId, dirPath, filename} = req.query;
        const editorPages = await storagesServices.renderEditor(storageId, dirPath, filename);
        const pagina = await paginasServices.getPaginas({where:{nombre_pag:filename}});
        console.log('pagina_editorXXX',pagina);

        if(pagina && pagina.length > 0){
            dir_path = pagina[0].ruta_pag;
            file_name = pagina[0].nombre_pag;
        }else{
            dir_path = editorPages.dirPath;
            file_name = editorPages.filename;
        }

        console.log('pagina_editor', pagina);
        res.render('admin/dashboard', {
            storageId:editorPages.storageId,
            dirPath:dir_path,
            filename:file_name,
            ejsContent:editorPages.ejsContent,
            url_api: process.env.API_URL,
            page: 'editor',
        });

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    viewEditor
}