const { Router } = require('express');
const {body, query} = require('express-validator');
const modeloCargo = require('../modelos/cargo');
const controladorCargo = require('../controladores/controladorCargo');
const ruta = Router();

ruta.get('/', controladorCargo.inicio );

ruta.get('/listar', controladorCargo.listar);

ruta.post('/guardar', 
    body("nombre").isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
    .custom(async value => {
        if (!value) {
            throw new Error("El nombre no permite nulos");
            
        }else{
            const buscaCargo = await modeloCargo.findOne({
                where: {nombre: value}
            });

            if(buscaCargo){
                throw new Error('El nombre del cargo ya existe. ');
            }
        }
    }),
    controladorCargo.guardar);

    ruta.put('/editar',
        query("id").isInt().withMessage('Solo se permiten valores enteros.')
        .custom(async value => {
            if (!value) {
                throw new Error("El id no permite nulos");
                
            }else{
                const buscaCargo = await modeloCargo.findOne({
                    where: {id: value}
                });
    
                if(!buscaCargo){
                    throw new Error('El id del cargo no existe. ');
                }
            }
        }),
        body("nombre").optional().isLength({min: 3, max: 50}).withMessage("El limite de caracteres es de 3 a 50")
        .custom(async value => {
            if (!value) {
                throw new Error("El nombre no permite nulos");
                
            }else{
                const buscaCargo = await modeloCargo.findOne({
                    where: {nombre: value}
                });
    
                if(buscaCargo){
                    throw new Error('El nombre del cargo ya existe. ');
                }
            }
        }),
        body("activo").optional().isBoolean().withMessage('Solo se permiten valores booleanos.'),
        controladorCargo.modificar
    );

    ruta.delete('/eliminar',
        query("id").isInt().withMessage('Solo se permiten valores enteros.')
        .custom(async value => {
            if (!value) {
                throw new Error("El id no permite nulos");
                
            }else{
                const buscaCargo = await modeloCargo.findOne({
                    where: {id: value}
                });
    
                if(!buscaCargo){
                    throw new Error('El id del cargo no existe. ');
                }
            }
        }), controladorCargo.eliminar
    );

module.exports = ruta;