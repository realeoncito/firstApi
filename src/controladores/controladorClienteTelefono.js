
const { application } = require('express');
const modeloClienteTelefono = require('../modelos/clienteTelefono');
const { validationResult } = require('express-validator');
const { Op, where, json } = require('sequelize');

exports.listar = async (req, res) => {
    try {
        await modeloClienteTelefono.findAll()
            .then((data) => {
                enviaRespuesta(res, data)
            })
            .catch((er) => {
                enviaRespuesta(res, { msg: "Error en la consutla " + er })
            })

    } catch (error) {
        enviaRespuesta(res, { msg: "Error al listar " + error })

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

            await modeloClienteTelefono.create({ ...req.body })
                .then((data) => {
                    enviaRespuesta(res, { msg: "Registro guardado " + data })
                }).catch((ex) => {
                    enviaRespuesta(res, { msg: "Error al agregar el registro " + ex })
                })

        } catch (ex) {
            enviaRespuesta(res, { msg: "Error en el servidor " + ex })

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
            msg: "Error al modificar el telefono",
            errores: ers
        })

    } else {

        try {
            //Variables para determinar la nulidad de los campos
            var numeroNull = false;
            var cliNull = false;

            //Mensaje para enviar dependiendo del campo que arroje error
            var msjError = ''

            //Extraemos los datos provenientes del body del request
            const { id } = req.query;
            const { numero, clienteId } = req.body;

            if (!numero) {
                numeroNull = true;
            }

            if (!clienteId) {
                cliNull = true;
            }

            if (numeroNull && cliNull) {
                enviaRespuesta(res, { msg: "No hay nada que modificar" })
            } else {
                
                await modeloClienteTelefono.update(
                    { ...req.body },
                    {
                        where: {
                            id: id
                        }
                    }
                ).then((data) => {
                    enviaRespuesta(res, {
                        msg: "Registro actualizado con exito"
                    })

                }).catch((exc) => {
                    enviaRespuesta(res, {
                        msg: "Error al actualizar el registro " + exc
                    })

                });

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
    errores.errors.forEach(e => {
        ers.push({
            campo: e.path,
            mensaje: e.msg
        });
    });

    if (ers.length > 0) {
        enviaRespuesta(res, {
            msg: "Se encontraron los siguientes errores en la peticion",
            errores: ers
        });
    } else {
        const { id } = req.query;
        await modeloClienteTelefono.destroy({
            where: {
                id
            }
        })
            .then(data => {
                enviaRespuesta(res, { msg: "Registro eliminado" })
            })
            .catch(e => {
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

