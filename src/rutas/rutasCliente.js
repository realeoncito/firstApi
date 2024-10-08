const {Router} = require('express');
const {body, query} = require('express-validator');

const controladorCliente = require('../controladores/controladorCliente');
const modeloCliente = require('../modelos/cliente');
const {Op, where } = require('sequelize');

const ruta = Router();

ruta.get('/listar', controladorCliente.listar);

ruta.post('/guardar',
    body('identidadCliente').isLength({min: 13, max:13}).withMessage("El numero de identidad debe tener exactamente 13 caracteres")
    .custom( async (value) => {
        if(!value) { 
            throw new Error("El numero de identidad no puede ser nulo");
        }else{
            const buscaDNI = await modeloCliente.findOne({
                where: {
                    identidadCliente : value
                }
            })

            if(buscaDNI) {
                throw new Error("Ya existee un cliente registrado bajo este DNI");
                
            }
        }
    }),
    
    body('primerNombre').isLength({min: 3, max:50}).withMessage("El nombre debe contener entre 3 y 50 caracteres.")
    .custom(async (value) => {
        if(!value){
            throw new Error("El primer nombre no puede ser nulo");
        }
    })
    ,

    body('segundoNombre').optional().isLength({min: 3, max:50}).withMessage("El nombre debe contener entre 3 y 50 caracteres.")
    .custom(async (value) => {
        if(!value){
            throw new Error("El segundo nombre no puede ser nulo");
        }
    })
    ,

    body('primerApellido').isLength({min: 3, max:50}).withMessage("El apellido debe contener entre 3 y 50 caracteres.")
    .custom(async (value) => {
        if(!value){
            throw new Error("El primer apellido no puede ser nulo");
        }
    })
    ,

    body('segundoApellido').optional().isLength({min: 3, max:50}).withMessage("El apellido debe contener entre 3 y 50 caracteres.")
    .custom(async (value) => {
        if(!value){
            throw new Error("El segunfo apellido no puede ser nulo");
        }
    })
    ,

    body("imagen").optional().custom(
        async (value) => {
            if(!value) { 
                throw new Error("La referencia de la imagen no puede ser nula");
            }
        }
    ),

    controladorCliente.guardar
)

ruta.put('/editar',

    query("id").isInt().withMessage("El id del cliente debe ser entero")
    .custom(async (value) => {
        if(!value){
            throw new Error("El id del cliente no puede ser nulo");
            
        }else{
            const buscaCliente = await modeloCliente.findOne({
                where: {
                    id: value
                }
            })

            if(!buscaCliente) { 
                throw new Error("El id del cliente no pertenece a un cliente existente.");
                
            }
        }
    })
    ,

    body('identidadCliente').optional().isLength({min: 13, max:13}).withMessage("El numero de identidad debe tener exactamente 13 caracteres")
    .custom( async (value) => {
        if(!value) { 
            throw new Error("El numero de identidad no puede ser nulo");
        }
    }),
    
    body('primerNombre').optional().isLength({min: 3, max:50}).withMessage("El nombre debe contener entre 3 y 50 caracteres.")
    .custom(async (value) => {
        if(!value){
            throw new Error("El primer nombre no puede ser nulo");
        }
    })
    ,

    body('segundoNombre').optional().isLength({min: 3, max:50}).withMessage("El nombre debe contener entre 3 y 50 caracteres.")
    .custom(async (value) => {
        if(!value){
            throw new Error("El segundo nombre no puede ser nulo");
        }
    })
    ,

    body('primerApellido').optional().isLength({min: 3, max:50}).withMessage("El apellido debe contener entre 3 y 50 caracteres.")
    .custom(async (value) => {
        if(!value){
            throw new Error("El primer apellido no puede ser nulo");
        }
    })
    ,

    body('segundoApellido').optional().isLength({min: 3, max:50}).withMessage("El apellido debe contener entre 3 y 50 caracteres.")
    .custom(async (value) => {
        if(!value){
            throw new Error("El segunfo apellido no puede ser nulo");
        }
    })
    ,

    body("imagen").optional().custom(
        async (value) => {
            if(!value) { 
                throw new Error("La referencia de la imagen no puede ser nula");
            }
        }
    ),

    body("estado").optional().isIn(['AC', 'IN']).withMessage("El estado solo puede ser Activo (AC) o Inactivo (IN)")
    .custom(async (value) => {
        if(!value){
            throw new Error("El estado no puede ser nulo");
            
        }
    })

    , 

    controladorCliente.modificar
)

ruta.delete('/eliminar',
    query("id").isInt().withMessage("El id del cliente tiene que ser entero")
    .custom(
        async (val) => {
            if(!val){
                throw new Error("El id del cliente no puede ser nulo");
                
            }else{
                const buscaCliente = await modeloCliente.findOne({
                    where : {
                        id: val
                    }
                })

                if(!buscaCliente){
                    throw new Error("El id no pertenece a ningun cliente existente. ");
                    
                }
            }
        }
    )
    ,
    controladorCliente.eliminar
)


module.exports = ruta;