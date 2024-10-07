
const { application } = require('express');
const modeloCiudad = require('../modelos/ubicacion/ciudad');
const { validationResult } = require('express-validator');
const {Op, where, json} = require('sequelize');

exports.listar = async (req, res) => {
    try {
        await modeloCiudad.findAll()
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

exports.listarMunicipio = async (req, res) => {
    const errores = validationResult(req);
    var ers = []

    errores.errors.forEach((e)=>{
        ers.push({campo: e.path, mensaje: e.msg});
    }); 

    if(ers.length > 0){
        enviaRespuesta(res, ers)
    }else{
        try{
            const {municipioId} = req.query;
            await modeloCiudad.findAll({
                where: {
                    municipioId
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
                msg: "Error al listar los municipios de este departamento :" + ex
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
            const {nombreCiudad, municipioId} = req.body;
            //Realizar validaciones para cada uno de los campos. 

            const buscaNombre = await modeloCiudad.findOne({
                where: {
                    nombreCiudad : nombreCiudad, 
                    municipioId : municipioId
                }
            });

            if(buscaNombre){
                nomEncontrado = true
                msjError += 'El nombre de la ciudad ya existe dentro del municipio.'
            }

            if(nomEncontrado){
                enviaRespuesta(res, {
                    msj: 'Error en la integridad de datos', 
                    errores: msjError
                });
            }else{

                await modeloCiudad.create({ ...req.body })
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
            msg: "Error al modificar el departamento",
            errores: ers
        })

    } else {

        try {
            //Variables para determinar la nulidad de los campos
            var nombreNull = false;
            var estadoNull = false
            var munNull = false;

            //Variables para determinar la existencia de los registros
            var existeNom = false;

            //Mensaje para enviar dependiendo del campo que arroje error
            var msjError = ''

            //Extraemos los datos provenientes del body del request
            const {id} = req.query;
            const { nombreCiudad, estado, municipioId } = req.body;

            if(!nombreCiudad){
                nombreNull = true;
            }

            if(!estado){
                estadoNull = true;
            }

            if(!municipioId){
                munNull = true;
            }

            if(nombreNull && estadoNull && munNull){
                enviaRespuesta(res, {msg: "No hay nada que modificar"})
            }else{
                var munAuxiliar = ''

                if(!nombreNull){

                    //Si el departamento no viene en el body
                    if(munNull){
                        const {municipioId} = await modeloCiudad.findOne({
                            where : {
                                id
                            }
                        })
                        munAuxiliar = municipioId
                    }else{
                        munAuxiliar = municipioId
                    }
                    const buscaMunNom = await modeloCiudad.findOne({
                        where : {
                            nombreCiudad:nombreCiudad,
                            id: {[Op.ne] : id},
                            municipioId:munAuxiliar
                        }
                    })

                    if(buscaMunNom){
                        existeNom = true;
                        msjError += 'El nombre de la ciudad ya existe para este municipio\n'
                    }
                }

                //Si solo se va a cambiar de municipio
                if(!munNull && nombreNull){
                    //Recuperamos el municipio actual que se quiere actualizar
                    const {nombreCiudad} = await modeloCiudad.findOne({
                        where: {
                            id: id
                        }
                    })

                    //Validamos que no exista el codigo o el nombre en el nuevo departamento
                    const auxCiudad = await modeloCiudad.findOne({
                        where : {
                            nombreCiudad: nombreCiudad,
                            id: {[Op.ne]: id},
                            municipioId : municipioId
                        }
                    })

                    if(auxCiudad){
                        existeNom = true
                        msjError += 'El nombre del municipio ya existe para este departamento'
                    }

                }

                if(existeNom){
                    enviaRespuesta(res, {msg: msjError});
                    
                }else{
                    await modeloCiudad.update(
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
        await modeloCiudad.destroy({
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

