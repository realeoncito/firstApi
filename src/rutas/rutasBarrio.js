
const {Router} = require('express');
const {body, query} = require('express-validator');


const controladorBarrio = require('../controladores/controladorBarrio');
const modeloBarrio = require('../modelos/ubicacion/barrio');
const modeloCiudad = require('../modelos/ubicacion/ciudad');
const ruta = Router();

ruta.get('/listar', controladorBarrio.listar);
ruta.get('/listar-ciudad',
    query("ciudadId").isInt().withMessage("El codigo de la ciudad debe ser entero")
    .custom(
        async (value) => {
            if(!value){
                throw new Error("El id de la ciudad no puede ser nulo");
                
            }else{
                const buscaCiudad = await modeloCiudad.findOne({
                    where: {
                        id: value
                    }
                });

                if(!buscaCiudad){
                    throw new Error("La ciudad buscada no existe.");
                    
                }
            }
        }
    ), controladorBarrio.listarCiudad
);

ruta.post('/guardar', 
    body("nombrebarrio").isLength({min: 3, max: 20}).withMessage("El nombre de la ciudad debe tener entre 3 y 20 caracteres")
    .custom( async value => {
        if (!value){
            throw new Error("El nombre no permite nulos");
        }
    }
    ),
    
    //Validar que venga el id del municipio y que exista. 
    body("ciudadId").isInt().withMessage("El id de la ciudad debe ser entero. ")
    .custom(
        async value =>{
            if(!value){
                throw new Error("El id de la ciudad no puede ser nulo");
                
            }else{
                const buscaCiudad = await modeloCiudad.findOne({
                    where : {
                        id : value
                    }
                })

                if(!buscaCiudad){
                    throw new Error("La ciudad introducida no existe.");
                }
            }
        }
    ), 
    controladorBarrio.guardar
);

ruta.put('/editar',
    //validar el id en el query
    query("id").isInt().withMessage("Solo se permiten valores enteros")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id del barrio no puede ser nulo")
            }else{
                const buscaBarrio = await modeloBarrio.findOne(
                    {
                        where: {
                            id:value
                        }
                    }
                    
                );

                if(!buscaBarrio){
                    throw new Error("El id de la ciudad no existe");
                    
                }
            }
        }
    ),
    //Nuevas reglas para un nuevo campo
    body("nombrebarrio").optional().isLength({min:3, max:20}).withMessage("El nombre de la ciudad debe contener entre 3 y 20 caracteres")
    .custom(
        async(value) =>{
            if(!value){
                throw new Error("El nombre de la ciudad no puede ser nulo");
            }
        }
    ),
    
    body("estado").optional().isIn(['AC', 'IN', 'BL']).withMessage("El estado solo puede ser Activo (AC), Inactivo (IN) o Bloqueado(BL)"),

    //Regla para el id municipio, validar que no sea nulo y que exista. 

    body("ciudadId").optional().isInt().withMessage("El id del barrio debe ser entero.")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id del barrio no puede ser nulo");
                
            }else{
                const buscaCiudad = await modeloCiudad.findOne({
                    where :{
                        id: value
                    }
                })

                if(!buscaCiudad) {
                    throw new Error("El id de la ciudad no pertenece a una ciudad existente.");
                    
                }
            }
        }
    ),
    controladorBarrio.modificar
);

ruta.delete('/eliminar', 
    query("id").isInt().withMessage("El id de la ciudad debe ser entero")
    .custom(
        async value=>{
            if(!value){
                throw new Error("El id de la ciudad no puede ser nulo");
                
            }else{
                const buscaBarrio = await modeloBarrio.findOne({
                    where: {
                        id:value
                    }
                });

                if(!buscaBarrio){
                    throw new Error("No existe un barrio con este id");
                }
            }
        }
    ),
    controladorBarrio.eliminar
)

module.exports = ruta;