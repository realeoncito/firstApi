
const {Router} = require('express');
const {body, query} = require('express-validator');


const controladorClienteTelefono = require('../controladores/controladorClienteTelefono');
const modeloClienteTelefono = require('../modelos/clienteTelefono');
const modeloCliente = require('../modelos/cliente');
const { where } = require('sequelize');
const ruta = Router();

ruta.get('/listar', controladorClienteTelefono.listar);

ruta.post('/guardar', 
    body("numero").isLength({min:8 ,max: 15}).withMessage("El numero de telefono debe tener entre 8 y 15 caracteres.")
    .custom( async value => {
        if (!value){
            throw new Error("El numero no permite nulos");
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
    controladorClienteTelefono.guardar
);

ruta.put('/editar',

    query("id").isInt().withMessage("Solo se permiten valores enteros")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id del numero no puede ser nulo")
            }else{
                const buscaDireccion = await modeloClienteTelefono.findOne(
                    {
                        where: {
                            id:value
                        }
                    }
                    
                );

                if(!buscaDireccion){
                    throw new Error("El id del numero no existe");
                    
                }
            }
        }
    ),

    body("numero").optional().isLength({min:8, max:15}).withMessage("El numero de telefono debe tener entre 8 y 15 caracteres.")
    .custom(
        async(value) =>{
            if(!value){
                throw new Error("El numero de telefono no puede ser nulo");
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
    controladorClienteTelefono.modificar
);

ruta.delete('/eliminar', 
    query("id").isInt().withMessage("El id del numero debe ser entero")
    .custom(
        async value=>{
            if(!value){
                throw new Error("El id del numero no puede ser nulo");
                
            }else{
                const buscaDireccion = await modeloClienteTelefono.findOne({
                    where: {
                        id:value
                    }
                });

                if(!buscaDireccion){
                    throw new Error("No existe un numero de telefono con este id");
                }
            }
        }
    ),
    controladorClienteTelefono.eliminar
)

module.exports = ruta;