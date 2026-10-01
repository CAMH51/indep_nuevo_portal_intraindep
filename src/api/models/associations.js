const sequelize = require('../config/dbPostgres');

// ─── Modelos sin dependencias (base) ─────────────────────────────────────────
const rolModel               = require('../models/rol.model');
const etiquetaModel          = require('../models/etiqueta.model');
const moduloModel            = require('../models/modulo.model');
const storageModel           = require('../models/stogares.model');
const refreshToken = require('../models/refresh_token');
const departamentosComunicados = require('../models/departamentos_comunicador.model');


// ─── Modelos que dependen solo de base ───────────────────────────────────────
const paginaModel            = require('../models/pagina.model');
const userModel              = require('../models/user.model');
const archivoModel           = require('../models/archivos.model');

// ─── Modelos que dependen de pagina / user / archivo ────────────────────────────
const apartadoModel          = require('../models/apartado.model');
const subapartadoModel       = require('../models/subapartado.model');
const bitacoraModel          = require('../models/bitacora.model');
const noticiaModel           = require('../models/noticia.model');
const fotogaleriaModel       = require('../models/fotogaleria.model');
const eventoAvisoModel       = require('../models/eventosAvisos.model');
const campaniaInternaModel   = require('../models/campania_interna');
const servicioPromocionModel = require('../models/servicio_pormocion');
const cumpleanioModel        = require('../models/cumpleanio.model');
const ligaModel              = require('../models/ligas.model');
const ventanaEmergenteModel  = require('../models/ventanaEmergente.model');
const subastaModel           = require('../models/subastas.model');
const comunicadosModel       = require('../models/comunicados.model');
const sistemasModel          = require('../models/sistemas.model');
const manualesSistemas       = require('../models/manuales_sistemas.model');
const documentosModel            = require('../models/documentos');

// ─── Modelos de relaciones ────────────────────────────
const relUserSubapartadoModel   = require('../models/rel_users_subapartados.model');
const relUserModuloModel        = require('../models/rel_users_modulos.model');
const relRolModuloModel         = require('../models/rel_roles_modulos.model');
const relApartadoUser           = require('../models/rel_apartados_users.model');
const compartirPagina           = require('../models/compartir_paginas.model');


// ─── Modelos polimórficos (dependen de casi todo) ────────────────────────────
const avisoImportanteModel   = require('../models/avisos_importantes.model');


// ═══════════════════════════════════════════════════════════════════════════════
// ASOCIACIONES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── User ↔ Rol ───────────────────────────────────────────────────────────────
userModel.belongsTo(    rolModel,       {   foreignKey: 'fk_id_rol',      targetKey: 'id_rol',      as: 'rol'           });
rolModel.hasMany(       userModel,      {   foreignKey: 'fk_id_rol',      sourceKey: 'id_rol'                           });
userModel.belongsTo(    userModel,      {   foreignKey: 'created_by',                               as: 'creator'       });
userModel.hasMany(      userModel,      {   foreignKey: 'created_by',                                as: 'createdUser'   });

// ─── Rol ↔ User ──────────────────────────────────────────────────────────── 
rolModel.belongsTo(   userModel,   {   foreignKey: 'fk_id_user',   targetKey: 'id_user',   as: 'user'      });
userModel.hasMany(    rolModel,    {   foreignKey: 'fk_id_user',   sourceKey: 'id_user'                    });

// ─── Etiqueta ↔ User ──────────────────────────────────────────────────────────── 
etiquetaModel.belongsTo(   userModel,       { foreignKey: 'fk_id_user', targetKey: 'id_user',   as: 'user'    });
userModel.hasMany(         etiquetaModel,   { foreignKey: 'fk_id_user', sourceKey: 'id_user'                });

// ─── Módulo ↔ User ──────────────────────────────────────────────────────────── 
moduloModel.belongsTo(   userModel,    { foreignKey: 'fk_id_user', targetKey: 'id_user',   as: 'user'    });
userModel.hasMany(       moduloModel,  { foreignKey: 'fk_id_user', sourceKey: 'id_user'                });

// ─── RefreshToken ↔ User ──────────────────────────────────────────────────────────── 
refreshToken.belongsTo( userModel,  { foreignKey: 'fk_id_user', targetKey: 'id_user',   as: 'user'    });
userModel.hasMany(       refreshToken, { foreignKey: 'fk_id_user', sourceKey: 'id_user'                });



// ─── Pagina ↔ User ────────────────────────────────────────────────────────────
paginaModel.belongsTo(    userModel,    { foreignKey: 'fk_id_user',     targetKey: 'id_user',       as: 'user'        });
userModel.hasMany(        paginaModel,  { foreignKey: 'fk_id_user',     sourceKey: 'id_user'                        });
paginaModel.belongsTo(    storageModel, { foreignKey: 'fk_id_storage',  targetKey: 'id_storage',    as:'storage'    });
storageModel.hasMany(     paginaModel,  { foreignKey: 'fk_id_storage',    sourceKey: 'id_storage'                   }); 


// ─── Apartado ↔ User ──────────────────────────────────────────────────────────
apartadoModel.belongsTo(    userModel,       { foreignKey: 'fk_id_user', targetKey: 'id_user', as: 'user'    });
userModel.hasMany(          apartadoModel,   { foreignKey: 'fk_id_user', sourceKey: 'id_user'                });

// ─── Subapartado ↔ Pagina / Apartado ─────────────────────────────────────────
subapartadoModel.belongsTo(   paginaModel,          {   foreignKey: 'fk_id_pagina',     targetKey: 'id_pagina',     as: 'pagina'            });
paginaModel.hasMany(          subapartadoModel,     {   foreignKey: 'fk_id_pagina',     sourceKey: 'id_pagina'                              });
subapartadoModel.belongsTo(   apartadoModel,        {   foreignKey: 'fk_id_apartado',   targetKey: 'id_apartado',   as: 'apartadoInfo'      });
apartadoModel.hasMany(        subapartadoModel,     {   foreignKey: 'fk_id_apartado',   sourceKey: 'id_apartado'                            });
subapartadoModel.belongsTo(        userModel,            {   foreignKey: 'fk_id_user',       targetKey: 'id_user',       as: 'user'              });
userModel.hasMany(            subapartadoModel,          {   foreignKey: 'fk_id_user',       sourceKey: 'id_user'                                });

// ─── RelUserSubapartado ↔ User / Subapartado ─────────────────────────────────
relUserSubapartadoModel.belongsTo(   subapartadoModel,          { foreignKey: 'fk_id_subapartado', targetKey: 'id_subapartado', as: 'subapartado'   });
subapartadoModel.hasMany(            relUserSubapartadoModel,   { foreignKey: 'fk_id_subapartado', sourceKey: 'id_subapartado'                      });
relUserSubapartadoModel.belongsTo(   userModel,                 { foreignKey: 'fk_id_user',        targetKey: 'id_user',        as: 'user'          });
userModel.hasMany(                   relUserSubapartadoModel,   { foreignKey: 'fk_id_user',        sourceKey: 'id_user'                             });

// ─── RelApartadoUser ↔ Apartado / User ─────────────────────────────────
relApartadoUser.belongsTo(    apartadoModel,        {   foreignKey: 'fk_id_apartado',   targetKey: 'id_apartado',   as: 'apartado'  });
apartadoModel.hasMany(        relApartadoUser,      {   foreignKey: 'fk_id_apartado',   sourceKey: 'id_apartado'                    });
relApartadoUser.belongsTo(    userModel,            {   foreignKey: 'fk_id_user',       targetKey: 'id_user',           as: 'user'  });
userModel.hasMany(        relApartadoUser,          {   foreignKey: 'fk_id_user',       sourceKey: 'id_user'                        });

// ─── RelRolModulo ↔ Rol / Modulo ─────────────────────────────────
relRolModuloModel.belongsTo(   rolModel,                {   foreignKey: 'fk_id_rol',        targetKey: 'id_rol',        as: 'rol'       });
rolModel.hasMany(              relRolModuloModel,       {   foreignKey: 'fk_id_rol',        sourceKey: 'id_rol'                         });
relRolModuloModel.belongsTo(   moduloModel,             {   foreignKey: 'fk_id_modulo',     targetKey: 'id_modulo',     as: 'modulo'    });
moduloModel.hasMany(           relRolModuloModel,       {   foreignKey: 'fk_id_modulo',     sourceKey: 'id_modulo'                      });

// ─── RelUserModulo ↔ User / Modulo ─────────────────────────────────
relUserModuloModel.belongsTo(   moduloModel,            {   foreignKey: 'fk_id_modulo',     targetKey: 'id_modulo',     as: 'modulo'    });
moduloModel.hasMany(            relUserModuloModel,     {   foreignKey: 'fk_id_modulo',     sourceKey: 'id_modulo'                      });
relUserModuloModel.belongsTo(   userModel,              {   foreignKey: 'fk_id_user',       targetKey: 'id_user',       as: 'user'      });
userModel.hasMany(              relUserModuloModel,     {   foreignKey: 'fk_id_user',       sourceKey: 'id_user'                        });

// ─── archivo ↔ User ──────────────────────────────────────────────────────────────
archivoModel.belongsTo(   userModel,        { foreignKey: 'fk_id_user', targetKey: 'id_user', as: 'user'        });
userModel.hasMany(        archivoModel,     { foreignKey: 'fk_id_user', sourceKey: 'id_user'                    });
archivoModel.belongsTo(   storageModel,        { foreignKey: 'fk_id_storage', targetKey: 'id_storage', as:'storage'   });
storageModel.hasMany(     archivoModel,     { foreignKey: 'fk_id_storage', sourceKey: 'id_storage'                    });

// ─── Bitacora ↔ User ──────────────────────────────────────────────────────────
bitacoraModel.belongsTo(   userModel,       { foreignKey: 'fk_id_user', targetKey: 'id_user', as: 'user'     });
userModel.hasMany(         bitacoraModel,   { foreignKey: 'fk_id_user', sourceKey: 'id_user'                 });

// ─── Noticia ↔ archivo / Pagina / Etiqueta / User ───────────────────────────────
noticiaModel.belongsTo(   archivoModel,     { foreignKey: 'fk_id_archivo',  targetKey: 'id_archivo',  as: 'archivo'  });
archivoModel.hasMany(     noticiaModel,     { foreignKey: 'fk_id_archivo',  sourceKey: 'id_archivo'                  });
noticiaModel.belongsTo(   paginaModel,      { foreignKey: 'fk_id_pagina',   targetKey: 'id_pagina',   as: 'pagina'   });
paginaModel.hasMany(      noticiaModel,     { foreignKey: 'fk_id_pagina',   sourceKey: 'id_pagina'                   });
noticiaModel.belongsTo(   etiquetaModel,    { foreignKey: 'fk_id_etiqueta', targetKey: 'id_etiqueta', as: 'etiqueta' });
etiquetaModel.hasMany(    noticiaModel,     { foreignKey: 'fk_id_etiqueta', sourceKey: 'id_etiqueta'                 });
noticiaModel.belongsTo(   userModel,        { foreignKey: 'fk_id_user',     targetKey: 'id_user',     as: 'user'     });
userModel.hasMany(        noticiaModel,     { foreignKey: 'fk_id_user',     sourceKey: 'id_user'                     });

// ─── Fotogaleria ↔ archivo / User ────────────────────────────────────────────────
fotogaleriaModel.belongsTo(   archivoModel,         { foreignKey: 'fk_id_archivo', targetKey: 'id_archivo', as: 'archivo'   });
archivoModel.hasMany(         fotogaleriaModel,     { foreignKey: 'fk_id_archivo', sourceKey: 'id_archivo'                  });
fotogaleriaModel.belongsTo(   userModel,            { foreignKey: 'fk_id_user',    targetKey: 'id_user',    as: 'user'      });
userModel.hasMany(            fotogaleriaModel,     { foreignKey: 'fk_id_user',    sourceKey: 'id_user'                     });

// ─── EventoAviso ↔ archivo / User ────────────────────────────────────────────────
eventoAvisoModel.belongsTo(   archivoModel,         { foreignKey: 'fk_id_archivo', targetKey: 'id_archivo', as: 'archivo'   });
archivoModel.hasMany(         eventoAvisoModel,     { foreignKey: 'fk_id_archivo', sourceKey: 'id_archivo'                  });
eventoAvisoModel.belongsTo(   userModel,            { foreignKey: 'fk_id_user',    targetKey: 'id_user',    as: 'user'      });
userModel.hasMany(            eventoAvisoModel,     { foreignKey: 'fk_id_user',    sourceKey: 'id_user'                     });

// ─── Cumpleanio ↔ archivo / User ─────────────────────────────────────────────────
cumpleanioModel.belongsTo(   archivoModel,      { foreignKey: 'fk_id_archivo', targetKey: 'id_archivo', as: 'archivo'   });
archivoModel.hasMany(        cumpleanioModel,   { foreignKey: 'fk_id_archivo', sourceKey: 'id_archivo'                  });
cumpleanioModel.belongsTo(   userModel,         { foreignKey: 'fk_id_user',    targetKey: 'id_user',    as: 'user'      });
userModel.hasMany(           cumpleanioModel,   { foreignKey: 'fk_id_user',    sourceKey: 'id_user'                     });

// ─── CampaniaInterna ↔ archivo / Pagina / User ───────────────────────────────────
campaniaInternaModel.belongsTo(   archivoModel,             { foreignKey: 'fk_id_archivo', targetKey: 'id_archivo', as: 'archivo'   });
archivoModel.hasMany(             campaniaInternaModel,     { foreignKey: 'fk_id_archivo', sourceKey: 'id_archivo'                  });
campaniaInternaModel.belongsTo(   paginaModel,              { foreignKey: 'fk_id_pagina',  targetKey: 'id_pagina',  as: 'pagina'    });
paginaModel.hasMany(              campaniaInternaModel,     { foreignKey: 'fk_id_pagina',  sourceKey: 'id_pagina'                   });
campaniaInternaModel.belongsTo(   userModel,                { foreignKey: 'fk_id_user',    targetKey: 'id_user',    as: 'user'      });
userModel.hasMany(                campaniaInternaModel,     { foreignKey: 'fk_id_user',    sourceKey: 'id_user'                     });

// ─── ServicioPromocion ↔ archivo / Pagina / User ─────────────────────────────────
servicioPromocionModel.belongsTo(   archivoModel,               { foreignKey: 'fk_id_archivo', targetKey: 'id_archivo', as: 'archivo'   });
archivoModel.hasMany(               servicioPromocionModel,     { foreignKey: 'fk_id_archivo', sourceKey: 'id_archivo'                  });
servicioPromocionModel.belongsTo(   paginaModel,                { foreignKey: 'fk_id_pagina',  targetKey: 'id_pagina',  as: 'pagina'    });
paginaModel.hasMany(                servicioPromocionModel,     { foreignKey: 'fk_id_pagina',  sourceKey: 'id_pagina'                   });
servicioPromocionModel.belongsTo(   userModel,                  { foreignKey: 'fk_id_user',    targetKey: 'id_user',    as: 'user'      });
userModel.hasMany(                  servicioPromocionModel,     { foreignKey: 'fk_id_user',    sourceKey: 'id_user'                     });

// ─── Liga ↔ Pagina / User ─────────────────────────────────────────────────────
ligaModel.belongsTo(   paginaModel,     { foreignKey: 'fk_id_pagina', targetKey: 'id_pagina', as: 'pagina'     });
paginaModel.hasMany(   ligaModel,       { foreignKey: 'fk_id_pagina', sourceKey: 'id_pagina'                   });
ligaModel.belongsTo(   userModel,       { foreignKey: 'fk_id_user',   targetKey: 'id_user',   as: 'user'       });
userModel.hasMany(     ligaModel,       { foreignKey: 'fk_id_user',   sourceKey: 'id_user'                     });

// ─── VentanaEmergente ↔ archivo / User ───────────────────────────────────────────
ventanaEmergenteModel.belongsTo(   archivoModel,                { foreignKey: 'fk_id_archivo', targetKey: 'id_archivo', as: 'archivo'   });
archivoModel.hasMany(              ventanaEmergenteModel,       { foreignKey: 'fk_id_archivo', sourceKey: 'id_archivo'                  });
ventanaEmergenteModel.belongsTo(   userModel,                   { foreignKey: 'fk_id_user',    targetKey: 'id_user',    as: 'user'      });
userModel.hasMany(                 ventanaEmergenteModel,       { foreignKey: 'fk_id_user',    sourceKey: 'id_user'                     });

// ─── Subastas ↔ archivo / User ───────────────────────────────────────────
subastaModel.belongsTo(userModel,                   {foreignKey:'fk_id_user', targetKey:'id_user', as:'user'});
userModel.hasMany(      subastaModel,           {foreignKey:'fk_id_user', sourceKey:'id_user'});
subastaModel.belongsTo(archivoModel, {foreignKey:'fk_id_archivo', targetKey:'id_archivo', as:'archivo'});
archivoModel.hasMany(           subastaModel,   {foreignKey:'fk_id_archivo', sourceKey:'id_archivo'});


// ─── Comunicados ↔ archivo / User / Pagina / Departamento ───────────────────────────────────────────
comunicadosModel.belongsTo(userModel,                   {foreignKey:'fk_id_user', targetKey:'id_user', as:'user'});
userModel.hasMany(      comunicadosModel,           {foreignKey:'fk_id_user', sourceKey:'id_user'});
comunicadosModel.belongsTo(archivoModel, {foreignKey:'fk_id_archivo', targetKey:'id_archivo', as:'archivo'});
archivoModel.hasMany(           comunicadosModel,   {foreignKey:'fk_id_archivo', sourceKey:'id_archivo'});
comunicadosModel.belongsTo(paginaModel, {foreignKey:'fk_id_pagina', targetKey:'id_pagina', as:'pagina'});
paginaModel.hasMany(           comunicadosModel,   {foreignKey:'fk_id_pagina', sourceKey:'id_pagina'});
comunicadosModel.belongsTo(departamentosComunicados, {foreignKey:'fk_id_departamento_comunicado', targetKey:'id_departamento_comunicado', as:'departamento'});
departamentosComunicados.hasMany(           comunicadosModel,   {foreignKey:'fk_id_departamento_comunicado', sourceKey:'id_departamento_comunicado'});



// ─── sistemas ↔ User ───────────────────────────────────────────

sistemasModel.belongsTo(userModel,                   {foreignKey:'fk_id_user', targetKey:'id_user', as:'user'});
userModel.hasMany(      sistemasModel,           {foreignKey:'fk_id_user', sourceKey:'id_user'});


// ─── Departamentos COmunicados ↔ User ───────────────────────────────────────────

departamentosComunicados.belongsTo(userModel,                   {foreignKey:'fk_id_user', targetKey:'id_user', as:'user'});
userModel.hasMany(      departamentosComunicados,           {foreignKey:'fk_id_user', sourceKey:'id_user'});
// ─── manuales_sistemas ↔ User / Sistema / Archivo ───────────────────────────────────────────

manualesSistemas.belongsTo(userModel,                   {foreignKey:'fk_id_user', targetKey:'id_user', as:'user'});
userModel.hasMany(      manualesSistemas,           {foreignKey:'fk_id_user', sourceKey:'id_user'});
manualesSistemas.belongsTo(archivoModel, {foreignKey:'fk_id_archivo', targetKey:'id_archivo', as:'archivo'});
archivoModel.hasMany(           manualesSistemas,   {foreignKey:'fk_id_archivo', sourceKey:'id_archivo'});
manualesSistemas.belongsTo(sistemasModel,                   {foreignKey:'fk_id_sistema', targetKey:'id_sistema', as:'sistema'});
sistemasModel.hasMany(      manualesSistemas,           {foreignKey:'fk_id_sistema', sourceKey:'id_sistema'});

// ─── AvisoImportante (polimórfico) ────────────────────────────────────────────
// constraints:false evita ALTER TABLE...REFERENCES en columnas nullable
avisoImportanteModel.belongsTo(paginaModel,           { foreignKey: 'fk_id_pagina',            targetKey: 'id_pagina',            as: 'pagina' });
avisoImportanteModel.belongsTo(userModel,              { foreignKey: 'fk_id_user',            targetKey: 'id_user',     as: 'user'          });


compartirPagina.belongsTo(userModel,    { foreignKey: 'fk_id_user',         targetKey: 'id_user',           as: 'user'       });
userModel.hasMany(compartirPagina,      { foreignKey: 'fk_id_user',         sourceKey: 'id_user'                             });
compartirPagina.belongsTo(paginaModel,  { foreignKey: 'fk_id_pagina',       targetKey: 'id_pagina',         as: 'pagina'     });
paginaModel.hasMany(compartirPagina,    { foreignKey: 'fk_id_pagina',       sourceKey: 'id_pagina'                           });


// ─── Fotogaleria ↔ archivo / User ────────────────────────────────────────────────
documentosModel.belongsTo(   archivoModel,         { foreignKey: 'fk_id_archivo', targetKey: 'id_archivo', as: 'archivo'   });
archivoModel.hasMany(         documentosModel,     { foreignKey: 'fk_id_archivo', sourceKey: 'id_archivo'                  });
documentosModel.belongsTo(   userModel,            { foreignKey: 'fk_id_user',    targetKey: 'id_user',    as: 'user'      });
userModel.hasMany(            documentosModel,     { foreignKey: 'fk_id_user',    sourceKey: 'id_user'                     });
// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT SCOPES — .unscoped() en todos los includes para evitar recursión infinita
// ═══════════════════════════════════════════════════════════════════════════════

userModel.addScope('defaultScope', {
    include: [
        { model: rolModel.unscoped(),      as: 'rol'      },
        { model: userModel.unscoped(), as: 'creator' }
    ]
}, { override: true });

etiquetaModel.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user' }
    ]
}, { override: true });

moduloModel.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user' }
    ]
}, { override: true });

refreshToken.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user' }
    ]
}, { override: true });

rolModel.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user' }
    ]
}, { override: true });

apartadoModel.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user' }
    ]
}, { override: true });

paginaModel.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user' },
        { model: storageModel.unscoped(), as: 'storage' }
    ]
}, { override: true });

archivoModel.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user' },
        {model:storageModel.unscoped(), as:'storage'}
    ]
}, { override: true });

subapartadoModel.addScope('defaultScope', {
    include: [
        { model: paginaModel.unscoped(),   as: 'pagina'       },
        { model: apartadoModel.unscoped(), as: 'apartadoInfo' },
        { model: userModel.unscoped(),     as: 'user'         }
    ]
}, { override: true });


departamentosComunicados.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(),     as: 'user'         }
    ]
}, { override: true });

relUserSubapartadoModel.addScope('defaultScope', {
    include: [
        { model: subapartadoModel.unscoped(), as: 'subapartado',
            include: [
            { model: paginaModel.unscoped(),   as: 'pagina'       },
            { model: userModel.unscoped(),     as: 'user'         },
            { model: apartadoModel.unscoped(), as: 'apartadoInfo' }
        ]
         },
        { model: userModel.unscoped(),        as: 'user'        }
    ]
}, { override: true });

relUserModuloModel.addScope('defaultScope', {
    include: [
        { model: moduloModel.unscoped(), as: 'modulo' },
        { model: userModel.unscoped(),        as: 'user'        }
    ]
}, { override: true });

relApartadoUser.addScope('defaultScope', {
    include: [
        { model: apartadoModel.unscoped(), as: 'apartado' },
        { model: userModel.unscoped(),        as: 'user'        }
    ]
}, { override: true });

relRolModuloModel.addScope('defaultScope', {
    include: [
        { model: rolModel.unscoped(), as: 'rol' },
        { model: moduloModel.unscoped(),        as: 'modulo'        }
    ]
}, { override: true });

bitacoraModel.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user' }
    ]
}, { override: true });

noticiaModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(),     as: 'archivo',
            include: [
                { model: userModel.unscoped(),    as: 'user'    },
                { model: storageModel.unscoped(), as: 'storage' }
            ]
          },
        { model: paginaModel.unscoped(),   as: 'pagina',
            include: [
                { model: userModel.unscoped(),    as: 'user'    },
                { model: storageModel.unscoped(), as: 'storage' }
            ]
           },
        { model: etiquetaModel.unscoped(), as: 'etiqueta',
            include: [
                { model: userModel.unscoped(), as: 'user' }
            ]
         },
        { model: userModel.unscoped(),     as: 'user'     }
    ]
}, { override: true });

fotogaleriaModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(), as: 'archivo' },
        { model: userModel.unscoped(), as: 'user'    }
    ]
}, { override: true });

eventoAvisoModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(), as: 'archivo' },
        { model: userModel.unscoped(), as: 'user'    }
    ]
}, { override: true });

cumpleanioModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(), as: 'archivo' },
        { model: userModel.unscoped(), as: 'user'    }
    ]
}, { override: true });

campaniaInternaModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(),   as: 'archivo' },
        { model: paginaModel.unscoped(), as: 'pagina'  },
        { model: userModel.unscoped(),   as: 'user'    }
    ]
}, { override: true });

servicioPromocionModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(),   as: 'archivo' },
        { model: paginaModel.unscoped(), as: 'pagina'  },
        { model: userModel.unscoped(),   as: 'user'    }
    ]
}, { override: true });

ligaModel.addScope('defaultScope', {
    include: [
        { model: paginaModel.unscoped(), as: 'pagina' },
        { model: userModel.unscoped(),   as: 'user'   }
    ]
}, { override: true });

ventanaEmergenteModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(), as: 'archivo' },
        { model: userModel.unscoped(), as: 'user'    }
    ]
}, { override: true });

subastaModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(), as: 'archivo' },
        { model: userModel.unscoped(), as: 'user'    }
    ]
}, { override: true });


comunicadosModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(), as: 'archivo' },
        { model: userModel.unscoped(), as: 'user'    },
        { model: paginaModel.unscoped(), as: 'pagina'},
        { model: departamentosComunicados.unscoped(), as: 'departamento'}
    ]
}, { override: true });

sistemasModel.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user'    },
    ]
}, { override: true });

manualesSistemas.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user'    },
        { model: archivoModel.unscoped(), as: 'archivo' },
        { model:sistemasModel.unscoped(), as:'sistema'}
    ]
}, { override: true });

departamentosComunicados.addScope('defaultScope', {
    include: [
        { model: userModel.unscoped(), as: 'user'    }
    ]
}, { override: true });


avisoImportanteModel.addScope('defaultScope', {
    include: [
      
        { model: userModel.unscoped(),              as: 'user' ,
            include:[
                {model:rolModel.unscoped(), as:'rol'}
            ]
        },
        { model: paginaModel.unscoped(),            as: 'pagina'}
    ]
}, { override: true });


compartirPagina.addScope('defaultScope',{
    include:[
        {model:userModel.unscoped(), as:'user'},
        {model:paginaModel.unscoped(), as:'pagina'}
    ]
});

documentosModel.addScope('defaultScope', {
    include: [
        { model: archivoModel.unscoped(), as: 'archivo' },
        { model: userModel.unscoped(), as: 'user'    }
    ]
}, { override: true });

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════
module.exports = {
    sequelize,
    rolModel,
    etiquetaModel,
    moduloModel,
    refreshToken,
    storageModel,
    userModel,
    paginaModel,
    archivoModel,
    apartadoModel,
    subapartadoModel,
    relUserSubapartadoModel,
    relUserModuloModel,
    relRolModuloModel,
    relApartadoUser,
    bitacoraModel,
    noticiaModel,
    fotogaleriaModel,
    eventoAvisoModel,
    campaniaInternaModel,
    servicioPromocionModel,
    cumpleanioModel,
    ligaModel,
    ventanaEmergenteModel,
    avisoImportanteModel,
    compartirPagina,
    subastaModel,
    sistemasModel,
    departamentosComunicados,
    manualesSistemas,
    comunicadosModel,
    documentosModel
};