
const {Router} = require('express');
const {body, query} = require('express-validator');


const controladorClienteDireccion = require('../controladores/controladorClienteDireccion');
const modeloClienteDireccion = require('../modelos/ubicacion/clienteDireccion');
const modeloBarrio = require('../modelos/ubicacion/barrio');
const modeloCliente = require('../modelos/cliente');
const { where } = require('sequelize');
const ruta = Router();

ruta.get('/listar', controladorClienteDireccion.listar);
ruta.get('/listar-barrio',
    query("barrioId").isInt().withMessage("El codigo del barrio debe ser entero")
    .custom(
        async (value) => {
            if(!value){
                throw new Error("El id del barrio no puede ser nulo");
                
            }else{
                const buscaCiudad = await modeloBarrio.findOne({
                    where: {
                        id: value
                    }
                });

                if(!buscaCiudad){
                    throw new Error("El barrio buscado no existe.");
                    
                }
            }
        }
    ), controladorClienteDireccion.listarBarrio
);

ruta.post('/guardar', 
    body("direccion").isLength({min: 15}).withMessage("La direccion debe ser descriptiva, minimo 15 caracteres.")
    .custom( async value => {
        if (!value){
            throw new Error("La direcicon no permite nulos");
        }
    }
    ),
    
    //Validar que venga el id del barrio y que exista. 
    body("barrioId").isInt().withMessage("El id del barrio debe ser entero. ")
    .custom(
        async value =>{
            if(!value){
                throw new Error("El id del barrio no puede ser nulo");
                
            }else{
                const buscaBarrio = await modeloBarrio.findOne({
                    where : {
                        id : value
                    }
                })

                if(!buscaBarrio){
                    throw new Error("El barrio introducida no existe.");
                }
            }
        }
    ),
    
    body('clienteId').isInt().withMessage("El id del cliente debe ser entero.")
    .custom(async (value) => {
        if(!value){
            throw new Error("El id del cliente no puede ser nulo");
            
        }else{
            const buscaCliente = await modeloCliente.findOne({
                where : {
                    id :  value
                }
            });

            if(!buscaCliente){
                throw new Error("El cliente introducido no existe.");
                
            }
        }
    })
    , 
    controladorClienteDireccion.guardar
);

ruta.put('/editar',
    //validar el id en el query
    query("id").isInt().withMessage("Solo se permiten valores enteros")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id de la direccion no puede ser nulo")
            }else{
                const buscaDireccion = await modeloClienteDireccion.findOne(
                    {
                        where: {
                            id:value
                        }
                    }
                    
                );

                if(!buscaDireccion){
                    throw new Error("El id de la direccion no existe");
                    
                }
            }
        }
    ),
    //Nuevas reglas para un nuevo campo
    body("direccion").optional().isLength({min:15}).withMessage("La direccion debe ser descriptiva, minimo 15 caracteres.")
    .custom(
        async(value) =>{
            if(!value){
                throw new Error("La direccion no puede ser nula");
            }
        }
    ),

    body("barrioId").optional().isInt().withMessage("El id del barrio debe ser entero.")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id del barrio no puede ser nulo");
                
            }else{
                const buscaBarrio = await modeloBarrio.findOne({
                    where :{
                        id: value
                    }
                })

                if(!buscaBarrio) {
                    throw new Error("El id del barrio no pertenece a una barrio existente.");
                    
                }
            }
        }
    ),

    body("clienteId").optional().isInt().withMessage("El id del cliente debe ser entero")
    .custom(
        async (value) => {
            if(!value){
                throw new Error("El id del cliente no puede ser nulo");
                
            }else{
                const buscaCliente = await modeloCliente.findOne({
                    where : {
                        id: value
                    }
                })

                if(!buscaCliente){
                    throw new Error("El id del cliente no pertenece a un cliente existente.");
                }
            }
        }
    ),
    controladorClienteDireccion.modificar
);

ruta.delete('/eliminar', 
    query("id").isInt().withMessage("El id la direccion debe ser entero")
    .custom(
        async value=>{
            if(!value){
                throw new Error("El id de la direccion no puede ser nulo");
                
            }else{
                const buscaDireccion = await modeloClienteDireccion.findOne({
                    where: {
                        id:value
                    }
                });

                if(!buscaDireccion){
                    throw new Error("No existe una direccion con este id");
                }
            }
        }
    ),
    controladorClienteDireccion.eliminar
)

module.exports = ruta;