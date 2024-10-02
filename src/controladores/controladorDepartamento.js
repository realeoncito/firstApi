/**
 * Definicion de los metodos o callbacks que hara la ruta
 */

const { application } = require('express');
const modeloDepartamento = require('../modelos/ubicacion/departamento');
//Guarda el resultado ejecutado por la consulta en la ruta
const { validationResult } = require('express-validator');

//Operador para establecer igualdades o no igualdades
const {Op, where, json} = require('sequelize');

/**
 * Callbacks que hara la ruta para ejecutar los CRUDS
 */

exports.listar = async (req, res) => {
    try {
        await modeloDepartamento.findAll()
            .then((data) => {
               enviaRespuesta(res, data)
            })
            .catch((er) => {
                enviaRespuesta(res, {msg: "Error en la consutla " + er})
            })

    } catch (error) {
        enviaRespuesta(res, {msg: "Error al listar " + error})
        
    }
}

exports.guardar = async (req, res) => {
    //Errores traera todo lo que se incluya en validation result de la peticion. 
    const errores = validationResult(req);
    var ers = []

    errores.errors.forEach(element => {
        ers.push({ campo: element.path, mensaje: element.msg })
    });

    if (ers.length > 0) {
        enviaRespuesta(res, ers)
        
    } else {
        try {
            //await espera a que la operacion retorne
            await modeloDepartamento.create({ ...req.body })
                .then((data) => {
                    enviaRespuesta(res, {msg: "Registro guardado " + data})
                }).catch((ex)=>{
                    enviaRespuesta(res, {msg: "Error al agregar el registro " + ex})
                })
        } catch (ex) {
            enviaRespuesta(res, {msg: "Error en el servidor " + ex})
            
        }
    }
}

exports.modificar = async (req, res) => {

    const errores = validationResult(req);
    var ers = []

    errores.errors.forEach((e) => {
        ers.push({
            campo: e.path,
            msj: e.msg
        });
    });

    if (ers.length > 0) {
        enviaRespuesta(res, {
            msg: "Error al modificar el departamento",
            errores: ers
        })

    } else {

        try {
            //Variables para determinar la nulidad de los campos
            var codNull = false;
            var nombreNull = false;
            var estadoNull = false

            //Variables para determinar la existencia de los registros
            var existeCod = false;
            var existeNom = false;

            //Mensaje para enviar dependiendo del campo que arroje error
            var msjError = ''

            //Extraemos los datos provenientes del body del request
            const {id} = req.query;
            const { nombreDepartamento, codDepartamento, estado } = req.body;

            if(!nombreDepartamento){
                nombreNull = true;
            }

            if(!codDepartamento){
                codNull = true;
            }

            if(!estado){
                estadoNull = true;
            }

            if(codNull && nombreNull && estadoNull){
                enviaRespuesta(res, {msg: "No hay nada que modificar"})
            }else{
            
                //Validamos que no exista un departamento con ese mismo codigo. 
                if(!codNull){
                    const buscaDepartamento = await modeloDepartamento.findOne({
                        where: { 
                            codDepartamento : codDepartamento,
                            id: {[Op.ne]: id}
                        }
                    });

                    if(buscaDepartamento){
                        existeCod = true
                        msjError+= "El codigo del departamento ya existe\n"
                    }
                }

                if(!nombreNull){
                    const buscaDepNom = await modeloDepartamento.findOne({
                        where : {
                            nombreDepartamento:nombreDepartamento,
                            id: {[Op.ne] : id}
                        }
                    })

                    if(buscaDepNom){
                        existeNom = true;
                        msjError += 'El nombre del departamento ya existe\n'
                    }
                }

                if(existeCod || existeNom){
                    enviaRespuesta(res, {msg: msjError});
                    
                }else{
                    await modeloDepartamento.update(
                        {...req.body},
                        {
                            where : {
                                id:id
                            }
                        }
                    ).then((data)=>{
                        enviaRespuesta(res, {
                            msg:"Registro actualizado con exito"
                        })
                        
                    }).catch((exc)=>{
                        enviaRespuesta(res, {
                            msg: "Error al actualizar el registro " + exc
                        })
                        
                    });
                    
                }
                
            }
        } catch (error) {
            enviaRespuesta(res, {
                msg: "Error en el servidor " + error
            })
            
        }
    }
}

function enviaRespuesta(res, jsonObject) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(jsonObject)
}

