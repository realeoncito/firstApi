
const {Router} = require('express');
const {body, query} = require('express-validator');


const controladorCiudad = require('../controladores/controladorCiudad');
const modeloCiudad = require('../modelos/ubicacion/ciudad');
const modeloMunicipio = require('../modelos/ubicacion/municipio');
const ruta = Router();

ruta.get('/listar', controladorCiudad.listar);
ruta.get('/listar-Mun',
    query("municipioId").isInt().withMessage("El codigo del municipio debe ser entero")
    .custom(
        async (value) => {
            if(!value){
                throw new Error("El id del municipio no puede ser nulo");
                
            }else{
                const buscaMunicipio = await modeloMunicipio.findOne({
                    where: {
                        id: value
                    }
                });

                if(!buscaMunicipio){
                    throw new Error("El municipio buscado no existe.");
                    
                }
            }
        }
    ), controladorCiudad.listarMunicipio
);

ruta.post('/guardar', 
    body("nombreCiudad").isLength({min: 3, max: 50}).withMessage("El nombre de la ciudad debe tener entre 3 y 50 caracteres")
    .custom( async value => {
        if (!value){
            throw new Error("El nombre no permite nulos");
        }
    }
    ),
    
    //Validar que venga el id del municipio y que exista. 
    body("municipioId").isInt().withMessage("El id del municipio debe ser entero. ")
    .custom(
        async value =>{
            if(!value){
                throw new Error("El id del municipio no puede ser nulo");
                
            }else{
                const buscaMunicipio = await modeloMunicipio.findOne({
                    where : {
                        id : value
                    }
                })

                if(!buscaMunicipio){
                    throw new Error("El municipio introducido no existe.");
                }
            }
        }
    ), 
    controladorCiudad.guardar
);

ruta.put('/editar',
    //validar el id en el query
    query("id").isInt().withMessage("Solo se permiten valores enteros")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id de la ciudad no puede ser nulo")
            }else{
                const buscaMunicipio = await modeloCiudad.findOne(
                    {
                        where: {
                            id:value
                        }
                    }
                    
                );

                if(!buscaMunicipio){
                    throw new Error("El id de la ciudad no existe");
                    
                }
            }
        }
    ),
    //Nuevas reglas para un nuevo campo
    body("nombreCiudad").optional().isLength({min:3, max:50}).withMessage("El nombre de la ciudad debe contener entre 3 y 50 caracteres")
    .custom(
        async(value) =>{
            if(!value){
                throw new Error("El nombre de la ciudad no puede ser nulo");
            }
        }
    ),
    
    body("estado").optional().isIn(['AC', 'IN', 'BL']).withMessage("El estado solo puede ser Activo (AC), Inactivo (IN) o Bloqueado(BL)"),

    //Regla para el id municipio, validar que no sea nulo y que exista. 

    body("municipioId").optional().isInt().withMessage("El codigo dl municipio debe ser entero.")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id del municipio no puede ser nulo");
                
            }else{
                const buscaMunicipio = await modeloMunicipio.findOne({
                    where :{
                        id: value
                    }
                })

                if(!buscaMunicipio) {
                    throw new Error("El id del municipio no pertenece a un municipio existente.");
                    
                }
            }
        }
    ),
    controladorCiudad.modificar
);

ruta.delete('/eliminar', 
    query("id").isInt().withMessage("El id de la ciudad debe ser entero")
    .custom(
        async value=>{
            if(!value){
                throw new Error("El id de la ciudad no puede ser nulo");
                
            }else{
                const buscaMunicipio = await modeloCiudad.findOne({
                    where: {
                        id:value
                    }
                });

                if(!buscaMunicipio){
                    throw new Error("No existe un municipio con este id");
                }
            }
        }
    ),
    controladorCiudad.eliminar
)

module.exports = ruta;