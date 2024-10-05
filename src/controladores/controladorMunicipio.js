
const { application } = require('express');
const modeloMunicipio = require('../modelos/ubicacion/municipio');
const { validationResult } = require('express-validator');
const {Op, where, json} = require('sequelize');

exports.listar = async (req, res) => {
    try {
        await modeloMunicipio.findAll()
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

exports.listarDepto = async (req, res) => {
    const errores = validationResult(req);
    var ers = []

    errores.errors.forEach((e)=>{
        ers.push({campo: e.path, mensaje: e.msg});
    }); 

    if(ers.length > 0){
        enviaRespuesta(res, ers)
    }else{
        try{
            const {departamentoId} = req.query;
            await modeloMunicipio.findAll({
                where: {
                    departamentoId
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
             
            var codEncontrado, nomEncontrado = false;
            var msjError = '';
            const {codMunicipio, nombreMunicipio, departamentoId} = req.body;
            //Realizar validaciones para cada uno de los campos. 

            const buscaCodigo = await modeloMunicipio.findOne({
                where: {
                    codMunicipio : codMunicipio,
                    departamentoId : departamentoId
                }
            });

            if(buscaCodigo){
                codEncontrado = true;
                msjError += 'El codigo del municipio ya existe dentro del departamento.'
            }else{
                const buscaNombre = await modeloMunicipio.findOne({
                    where: {
                        nombreMunicipio : nombreMunicipio, 
                        departamentoId : departamentoId
                    }
                });

                if(buscaNombre){
                    nomEncontrado = true
                    msjError += 'El nombre del municipio ya existe dentro del departamento.'
                }
            }

            if(codEncontrado || nomEncontrado){
                enviaRespuesta(res, {
                    msj: 'Error en la integridad de datos', 
                    errores: msjError
                });
            }else{

                await modeloMunicipio.create({ ...req.body })
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
            var codNull = false;
            var nombreNull = false;
            var estadoNull = false
            var deptoNull = false;

            //Variables para determinar la existencia de los registros
            var existeCod = false;
            var existeNom = false;

            //Mensaje para enviar dependiendo del campo que arroje error
            var msjError = ''

            //Extraemos los datos provenientes del body del request
            const {id} = req.query;
            const { nombreMunicipio, codMunicipio, estado, departamentoId } = req.body;
            console.log(departamentoId);

            if(!nombreMunicipio){
                nombreNull = true;
            }

            if(!codMunicipio){
                codNull = true;
            }

            if(!estado){
                estadoNull = true;
            }

            if(!departamentoId){
                deptoNull = true;
            }

            if(codNull && nombreNull && estadoNull && deptoNull){
                enviaRespuesta(res, {msg: "No hay nada que modificar"})
            }else{
                var deptoAuxiliar = ''
                //Validamos que no exista un municipio con ese mismo codigo. 
                if(!codNull){
                    //Si el departamento id no viene en el body, hay que recuperarlo
                    if(deptoNull){
                        const {departamentoId} = await modeloMunicipio.findOne({
                            where : {
                                id
                            }
                        })
                        deptoAuxiliar = departamentoId
                    }else{
                        //El que viene por parametro
                        deptoAuxiliar = departamentoId
                    }
                    console.log('Departamento Id : ' + deptoAuxiliar)

                    const buscaMunicipio = await modeloMunicipio.findOne({
                        where: { 
                            codMunicipio : codMunicipio,
                            id: {[Op.ne]: id},
                            departamentoId :  deptoAuxiliar
                        }
                    });

                    console.log(buscaMunicipio)

                    if(buscaMunicipio){
                        existeCod = true
                        msjError+= "El codigo del municipio ya existe en este departamento\n"
                    }
                }

                if(!nombreNull){

                    //Si el departamento no viene en el body
                    if(deptoNull){
                        const {departamentoId} = await modeloMunicipio.findOne({
                            where : {
                                id
                            }
                        })
                        deptoAuxiliar = departamentoId
                    }else{
                        deptoAuxiliar = departamentoId
                    }
                    const buscaMunNom = await modeloMunicipio.findOne({
                        where : {
                            nombreMunicipio:nombreMunicipio,
                            id: {[Op.ne] : id},
                            departamentoId:deptoAuxiliar
                        }
                    })

                    if(buscaMunNom){
                        existeNom = true;
                        msjError += 'El nombre del municipio ya existe para este departamento\n'
                    }
                }

                //Si solo se va a cambiar de departamento
                if(!deptoNull && codNull && nombreNull){
                    //Recuperamos el municipio actual que se quiere actualizar
                    const {codMunicipio, nombreMunicipio} = await modeloMunicipio.findOne({
                        where: {
                            id: id
                        }
                    })
                    console.log(codMunicipio + ' ' + nombreMunicipio);

                    //Validamos que no exista el codigo o el nombre en el nuevo departamento
                    const auxMunicipio = await modeloMunicipio.findOne({
                        where : {
                            codMunicipio: codMunicipio, 
                            id: {[Op.ne]: id}, 
                            departamentoId: departamentoId
                        }
                    })

                    if(auxMunicipio){
                        existeCod = true;
                        msjError += 'El codigo del municipio ya existe para este departamento'
                    }else{
                        const auxMunicipio = await modeloMunicipio.findOne({
                            where : {
                                nombreMunicipio: nombreMunicipio,
                                id: {[Op.ne]: id},
                                departamentoId : departamentoId
                            }
                        })

                        if(auxMunicipio){
                            existeNom = true
                            msjError += 'El nombre del municipio ya existe para este departamento'
                        }
                    }

                }

                if(existeCod || existeNom){
                    enviaRespuesta(res, {msg: msjError});
                    
                }else{
                    await modeloMunicipio.update(
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
        await modeloMunicipio.destroy({
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

