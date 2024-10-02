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
ruta.get('./listar', controladorDepartamento.listar);

//Para guardar, eliminar y editar se valida a nivel de ruta la integridad de los datos
ruta.post('./guardar', 
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
    .custom( async (value) => {
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



