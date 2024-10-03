/*
En la ruta se definen las primeras validaciones 
*/

//Se extrae la variale Router del paquete express
const {Router} = require('express');
//Se extrae el cuerpo y la consulta del paquete validator
const {body, query} = require('express-validator');

//Importamos el controlador
const controladorDepartamento = require('../controladores/controladorDepartamento');
//Importamos el modelo
const modeloDepartamento = require('../modelos/ubicacion/departamento');
const { where } = require('sequelize');
//Inicializamos el enrutador
const ruta = Router();

//El enrutador define los comportamientos.
ruta.get('/listar', controladorDepartamento.listar);

//Para guardar, eliminar y editar se valida a nivel de ruta la integridad de los datos
ruta.post('/guardar', 
    body("codDepartamento").isLength({min:2, max:2}).withMessage("El codigo de departamento debe contener exactamente dos caracteres")
    .custom(async value => {
        if(!value){
            throw new Error("El codigo no permite nulos");
        }else{
            const buscaDepto = await modeloDepartamento.findOne({
                where: {codDepartamento: value}
            });

            if (buscaDepto) {
                throw new Error("El codigo del departamento ya existe. ");
            }
        }
    }

    ),
    body("nombreDepartamento").isLength({min: 3, max: 50}).withMessage("El nombre del departamento debe tener entre 3 y 50 departamentos")
    .custom( async value => {
        if (!value){
            throw new Error("El nombre no permite nulos");
        }else{
            const buscaDepto = await modeloDepartamento.findOne({
                where:{nombreDepartamento: value}
            });

            if (buscaDepto){
                throw new Error("El nombre del departamento ya existe.");
            }
        }
    }
    ), 
    controladorDepartamento.guardar
);

ruta.put('/editar',
    //validar el id en el query
    query("id").isInt().withMessage("Solo se permiten valores enteros")
    .custom(
        async value => {
            if(!value){
                throw new Error("El id del departamento no puede ser nulo")
            }else{
                const buscaDepto = await modeloDepartamento.findOne(
                    {
                        where: {
                            id:value
                        }
                    }
                    
                );

                if(!buscaDepto){
                    throw new Error("El id departamento no existe");
                    
                }
            }
        }
    ),
    //Para el cod departamento, que viene en el body se aplican las siguientes reglas. 
    body("codDepartamento").optional().isLength({min:2, max:2}).withMessage("El codigo del departamento debe tener exactamente dos caracteres")
    .custom(
        async value => {
            if(!value){
                throw new Error("El campo no acepta nulos");
            }
        }
    ),
    //Nuevas reglas para un nuevo campo
    body("nombreDepartamento").optional().isLength({min:3, max:50}).withMessage("El nombre del departamento debe contener entre 3 y 50 caracteres")
    .custom(
        async(value) =>{
            if(!value){
                throw new Error("El nombre del departamento no puede ser nulo");
            }
        }
    ),
    //Nueva regla para campo de estado
    body("estado").optional().isIn(['AC', 'IN', 'BL']).withMessage("El estado solo puede ser Activo (AC), Inactivo (IN) o Bloqueado(BL)"),
    controladorDepartamento.modificar
);

ruta.delete('/eliminar', 
    query("id").isInt().withMessage("El id del departamento debe ser entero")
    .custom(
        async value=>{
            if(!value){
                throw new Error("El id del departamento no puede ser nulo");
                
            }else{
                const buscaDepto = await modeloDepartamento.findOne({
                    where: {
                        id:value
                    }
                });

                if(!buscaDepto){
                    throw new Error("No existe un departamento con este id");
                }
            }
        }
    ),
    controladorDepartamento.eliminar
)

module.exports = ruta;