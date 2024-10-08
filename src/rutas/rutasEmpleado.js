const {Router} = require('express');
const {body, query} = require('express-validator');

const controladorEmpleado = require('../controladores/controladorEmpleado');
const modeloEmpleado = require('../modelos/empleado');
const modeloCargo = require('../modelos/cargo');
const {Op, where } = require('sequelize');

const ruta = Router();

ruta.get('/listar', controladorEmpleado.listar);

ruta.post('/guardar',

    body("cargoId").isInt().withMessage("El id del cargo debe ser entero")
    .custom(async (value) => {
        if(!value){
            throw new Error("El id del cargo no puede ser nulo");
            
        }else{
            const buscaCargo = await modeloCargo.findOne({
                where: {
                    id:value    
                }
            })

            if(!buscaCargo){
                throw new Error("No existe un cargo con el id introducido. ");
                
            }
        }
    }),
    body('identidad').isLength({min: 13, max:13}).withMessage("El numero de identidad debe tener exactamente 13 caracteres")
    .custom( async (value) => {
        if(!value) { 
            throw new Error("El numero de identidad no puede ser nulo");
        }else{
            const buscaDNI = await modeloEmpleado.findOne({
                where: {
                    identidad : value
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

    body("sueldo").optional().isFloat().withMessage("El sueldo debe ser float")
    .custom(
        async (val) => {
            if(!val){
                throw new Error("El sueldo no puede ser nulo");
                
            }
        }
    ),

    controladorEmpleado.guardar
)

ruta.put('/editar',

    query("id").isInt().withMessage("El id del cliente debe ser entero")
    .custom(async (value) => {
        if(!value){
            throw new Error("El id del cliente no puede ser nulo");
            
        }else{
            const buscaCliente = await modeloEmpleado.findOne({
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

    body("cargoId").optional().isInt().withMessage("El id del cargo debe ser entero")
    .custom(async (value) => {
        if(!value){
            throw new Error("El id del cargo no puede ser nulo");
            
        }else{
            const buscaCargo = await modeloCargo.findOne({
                where: {
                    id:value    
                }
            })

            if(!buscaCargo){
                throw new Error("No existe un cargo con el id introducido. ");
                
            }
        }
    }),

    body('identidad').optional().isLength({min: 13, max:13}).withMessage("El numero de identidad debe tener exactamente 13 caracteres")
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
            throw new Error("El segundo apellido no puede ser nulo");
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

    body("estado").optional().isIn(['AC', 'IN', 'BL']).withMessage("El estado solo puede ser Activo (AC), Inactivo (IN) o Bloqueado (BL)")
    .custom(async (value) => {
        if(!value){
            throw new Error("El estado no puede ser nulo");
            
        }
    }),
    
    body("sueldo").optional().isFloat().withMessage("El sueldo debe ser float")
    .custom(
        async (val) => {
            if(!val){
                throw new Error("El sueldo no puede ser nulo");
                
            }
        }
    ),

    controladorEmpleado.modificar
)

ruta.delete('/eliminar',
    query("id").isInt().withMessage("El id del empleado tiene que ser entero")
    .custom(
        async (val) => {
            if(!val){
                throw new Error("El id del empleado no puede ser nulo");
                
            }else{
                const buscaEmpleado = await modeloEmpleado.findOne({
                    where : {
                        id: val
                    }
                })

                if(!buscaEmpleado){
                    throw new Error("El id no pertenece a ningun empleado existente. ");
                    
                }
            }
        }
    )
    ,
    controladorEmpleado.eliminar
)


module.exports = ruta;