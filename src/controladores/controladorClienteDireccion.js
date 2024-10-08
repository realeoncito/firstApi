
const { application } = require('express');
const modeloClienteDireccion = require('../modelos/ubicacion/clienteDireccion');
const { validationResult } = require('express-validator');
const { Op, where, json } = require('sequelize');

exports.listar = async (req, res) => {
    try {
        await modeloClienteDireccion.findAll()
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

exports.listarBarrio = async (req, res) => {
    const errores = validationResult(req);
    var ers = []

    errores.errors.forEach((e) => {
        ers.push({ campo: e.path, mensaje: e.msg });
    });

    if (ers.length > 0) {
        enviaRespuesta(res, ers)
    } else {
        try {
            const { barrioId } = req.query;
            await modeloClienteDireccion.findAll({
                where: {
                    barrioId
                }
            }).then((data) => {
                enviaRespuesta(res, data);
            }).catch((er) => {
                enviaRespuesta(res,
                    {
                        msg: "Error en la consulta " + er
                    }
                )
            })

        } catch (ex) {
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

            await modeloClienteDireccion.create({ ...req.body })
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
            msg: "Error al modificar el barrio",
            errores: ers
        })

    } else {

        try {
            //Variables para determinar la nulidad de los campos
            var direccionNull = false;
            var barNull = false;
            var cliNull = false;

            //Mensaje para enviar dependiendo del campo que arroje error
            var msjError = ''

            //Extraemos los datos provenientes del body del request
            const { id } = req.query;
            const { direccion, barrioId, clienteId } = req.body;

            if (!direccion) {
                direccionNull = true;
            }

            if (!barrioId) {
                barNull = true;
            }

            if (!clienteId) {
                cliNull = true;
            }

            if (direccionNull && barNull && cliNull) {
                enviaRespuesta(res, { msg: "No hay nada que modificar" })
            } else {
                
                await modeloClienteDireccion.update(
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
        await modeloClienteDireccion.destroy({
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

