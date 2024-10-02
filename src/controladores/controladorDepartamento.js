/**
 * Definicion de los metodos o callbacks que hara la ruta
 */

const modeloDepartamento = require('../modelos/ubicacion/departamento');
//Guarda el resultado ejecutado por la consulta en la ruta
const {validationResult} = require('express-validator');

/**
 * Callbacks que hara la ruta para ejecutar los CRUDS
 */

exports.listar = async(req, res) => {
    try {
        await modeloDepartamento.findAll()
        .then((data)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        })
        .catch((er)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en la consulta" + er});
        })
        
    } catch (error) {
        res.statusCode = 200;
        res.setHeader("Content-Type")
    }
}

exports.guardar = async (req, res) => {
    //Errores traera todo lo que se incluya en validation result de la peticion. 
    const errores  = validationResult(req);
    var ers = []

    errores.error.forEach(element => {
        ers.push({campo: element.path, mensaje: element.msg})
    });

    if (ers.length > 0) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(ers);
    } else {
        try {
            //await espera a que la operacion retorne
            await modeloDepartamento.create({...req.body})
            .then((data)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro guardado " + data})
            })
        } catch (ex) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor " + ex})
        }
    }
}

exports.modificar = async (req, res) => {
    //const errores
    const errores =  validationResult(req);
    
}

