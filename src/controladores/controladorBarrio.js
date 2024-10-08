
const { application } = require('express');
const modeloBarrio = require('../modelos/ubicacion/barrio');
const { validationResult } = require('express-validator');
const {Op, where, json} = require('sequelize');

exports.listar = async (req, res) => {
    try {
        await modeloBarrio.findAll()
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

exports.listarCiudad = async (req, res) => {
    const errores = validationResult(req);
    var ers = []

    errores.errors.forEach((e)=>{
        ers.push({campo: e.path, mensaje: e.msg});
    }); 

    if(ers.length > 0){
        enviaRespuesta(res, ers)
    }else{
        try{
            const {ciudadId} = req.query;
            await modeloBarrio.findAll({
                where: {
                    ciudadId
                }
            }).then((data)=>{
                enviaRespuesta(res, data);
            }).catch((er)=>{
                enviaRespuesta(res, 
                    {
                        msg: "Error en la consulta " + er
                    }
                )
            })

        }catch (ex){
            enviaRespuesta(res, {
                msg: "Error al listar los barrios de esta ciudad :" + ex
            })
        }
    }
    
}

exports.guardar = async (req, res) => {
    const errores = validationResult(req);
    var ers = []

    errores.errors.forEach(element => {
        ers.push({ campo: element.path, mensaje: element.msg })
    });

    if (ers.length > 0) {
        enviaRespuesta(res, ers)
        
    } else {
        try {
             
            var nomEncontrado = false;
            var msjError = '';
            const {nombrebarrio, ciudadId} = req.body;
            //Realizar validaciones para cada uno de los campos. 

            const buscaNombre = await modeloBarrio.findOne({
                where: {
                    nombrebarrio : nombrebarrio, 
                    ciudadId : ciudadId
                }
            });

            if(buscaNombre){
                nomEncontrado = true
                msjError += 'El nombre del barrio ya existe dentro de la ciudad.'
            }

            if(nomEncontrado){
                enviaRespuesta(res, {
                    msj: 'Error en la integridad de datos', 
                    errores: msjError
                });
            }else{

                await modeloBarrio.create({ ...req.body })
                    .then((data) => {
                        enviaRespuesta(res, {msg: "Registro guardado " + data})
                    }).catch((ex)=>{
                        enviaRespuesta(res, {msg: "Error al agregar el registro " + ex})
                    })
            }
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
            msg: "Error al modificar el barrio",
            errores: ers
        })

    } else {

        try {
            //Variables para determinar la nulidad de los campos
            var nombreNull = false;
            var estadoNull = false
            var ciuNull = false;

            //Variables para determinar la existencia de los registros
            var existeNom = false;

            //Mensaje para enviar dependiendo del campo que arroje error
            var msjError = ''

            //Extraemos los datos provenientes del body del request
            const {id} = req.query;
            const { nombrebarrio, estado, ciudadId } = req.body;

            if(!nombrebarrio){
                nombreNull = true;
            }

            if(!estado){
                estadoNull = true;
            }

            if(!ciudadId){
                ciuNull = true;
            }

            if(nombreNull && estadoNull && ciuNull){
                enviaRespuesta(res, {msg: "No hay nada que modificar"})
            }else{
                var ciuAuxiliar = ''

                if(!nombreNull){

                    //Si el departamento no viene en el body
                    if(ciuNull){
                        const {ciudadId} = await modeloBarrio.findOne({
                            where : {
                                id
                            }
                        })
                        ciuAuxiliar = ciudadId
                    }else{
                        ciuAuxiliar = ciudadId
                    }
                    const buscaBarNom = await modeloBarrio.findOne({
                        where : {
                            nombrebarrio:nombrebarrio,
                            id: {[Op.ne] : id},
                            ciudadId:ciuAuxiliar
                        }
                    })

                    if(buscaBarNom){
                        existeNom = true;
                        msjError += 'El nombre del barrio ya existe para esta ciudad\n'
                    }
                }

                //Si solo se va a cambiar de municipio
                if(!ciuNull && nombreNull){
                    //Recuperamos el municipio actual que se quiere actualizar
                    const {nombrebarrio} = await modeloBarrio.findOne({
                        where: {
                            id: id
                        }
                    })

                    //Validamos que no exista el codigo o el nombre en el nuevo departamento
                    const auxBarrio = await modeloBarrio.findOne({
                        where : {
                            nombrebarrio: nombrebarrio,
                            id: {[Op.ne]: id},
                            ciudadId : ciudadId
                        }
                    })

                    if(auxBarrio){
                        existeNom = true
                        msjError += 'El nombre del barrio ya existe para esta ciudad'
                    }

                }

                if(existeNom){
                    enviaRespuesta(res, {msg: msjError});
                    
                }else{
                    await modeloBarrio.update(
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

exports.eliminar = async (req, res) => {
    const errores = validationResult(req);
    var ers = []
    errores.errors.forEach(e=>{
        ers.push({
            campo: e.path, 
            mensaje: e.msg
        });
    });

    if(ers.length > 0){
        enviaRespuesta(res, {
            msg: "Se encontraron los siguientes errores en la peticion",
            errores: ers
        });
    }else{
        const {id} = req.query;
        await modeloBarrio.destroy({
            where: {
                id
            }
        })
        .then(data=>{
            enviaRespuesta(res, {msg: "Registro eliminado"})
        })
        .catch(e=>{
            enviaRespuesta(res, {
                msg: "Excepcion encontrada el realizar la eliminacion",
                Excepcion: e
            })
        })
    }
}

function enviaRespuesta(res, jsonObject) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(jsonObject)
}

