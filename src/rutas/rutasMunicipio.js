
const {Router} = require('express');
const {body, query} = require('express-validator');


const controladorMunicipio = require('../controladores/controladorMunicipio');
const modeloMunicipio = require('../modelos/ubicacion/municipio');
const modeloDepartamento = require('../modelos/ubicacion/departamento');
const { Op, where } = require('sequelize');
const Departamento = require('../modelos/ubicacion/departamento');
const ruta = Router();

ruta.get('/listar', controladorMunicipio.listar);
ruta.get('/listar-Dep',
    query("departamentoId").isInt().withMessage("El codigo del departamento debe ser entero")
    .custom(
        async (value) => {
            if(!value){
                throw new Error("El id del departamento no puede ser nulo");
                
            }else{
                const buscaDepto = await modeloDepartamento.findOne({
                    where: {
                        id: value
                    }
                });

                if(!buscaDepto){
                    throw new Error("El departamento buscado no existe.");
                    
                }
            }
        }
    ), controladorMunicipio.listarDepto
);

ruta.post('/guardar', 
    body("codMunicipio").isLength({min:2, max:2}).withMessage("El codigo de municipio debe contener exactamente dos caracteres")
    .custom(async value => {
        if(!value){
            throw new Error("El codigo no permite nulos");
        }
    }

    ),
    body("nombreMunicipio").isLength({min: 3, max: 50}).withMessage("El nombre del municipio debe tener entre 3 y 50 municipios")
    .custom( async value => {
        if (!value){
            throw new Error("El nombre no permite nulos");
        }
    }
    ),
    
    //Validar que venga el id del departamento y que exista
    body("departamentoId").custom(
        async value =>{
            if(!value){
                throw new Error("El id del departamento no puede ser nulo");
                
            }else{
                const buscaDepto = await modeloDepartamento.findOne({
                    where : {
                        id : value
                    }
                })

                if(!buscaDepto){
                    throw new Error("El departamento introducido no existe.");
                }
            }
        }
    ), 
    controladorMunicipio.guardar
);

ruta.put('/editar',
    //validar el id en el query
    query("id").isInt().withMessage("Solo se permiten valores enteros")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id del municipio no puede ser nulo")
            }else{
                const buscaDepto = await modeloMunicipio.findOne(
                    {
                        where: {
                            id:value
                        }
                    }
                    
                );

                if(!buscaDepto){
                    throw new Error("El id municipio no existe");
                    
                }
            }
        }
    ),

    /* Todos los campos del body se validan de manera opcional y se aplica la validacion a nivel de controlador.*/
    //Para el cod municipio, que viene en el body se aplican las siguientes reglas. 
    body("codMunicipio").optional().isLength({min:2, max:2}).withMessage("El codigo del municipio debe tener exactamente dos caracteres")
    .custom(
        async value => {
            if(!value){
                throw new Error("El campo no acepta nulos");
            }
        }
    ),
    //Nuevas reglas para un nuevo campo
    body("nombreMunicipio").optional().isLength({min:3, max:50}).withMessage("El nombre del municipio debe contener entre 3 y 50 caracteres")
    .custom(
        async(value) =>{
            if(!value){
                throw new Error("El nombre del municipio no puede ser nulo");
            }
        }
    ),
    //Nueva regla para campo de estado
    body("estado").optional().isIn(['AC', 'IN', 'BL']).withMessage("El estado solo puede ser Activo (AC), Inactivo (IN) o Bloqueado(BL)"),

    //Regla para el id departamento, validar que no sea nulo y que exista. 

    body("departamentoId").optional().isInt().withMessage("El codigo del departamento debe ser entero.")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id del departamento no puede ser nulo");
                
            }else{
                const buscaDepto = await modeloDepartamento.findOne({
                    where :{
                        id: value
                    }
                })

                if(!buscaDepto) {
                    throw new Error("El id del departamento no pertenece a un departamento existente.");
                    
                }
            }
        }
    ),
    controladorMunicipio.modificar
);

ruta.delete('/eliminar', 
    query("id").isInt().withMessage("El id del municipio debe ser entero")
    .custom(
        async value=>{
            if(!value){
                throw new Error("El id del municipio no puede ser nulo");
                
            }else{
                const buscaDepto = await modeloMunicipio.findOne({
                    where: {
                        id:value
                    }
                });

                if(!buscaDepto){
                    throw new Error("No existe un municipio con este id");
                }
            }
        }
    ),
    controladorMunicipio.eliminar
)

module.exports = ruta;