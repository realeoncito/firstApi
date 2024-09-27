const modeloCargo = require('../modelos/cargo');
const {validationResult} =  require('express-validator');

exports.inicio = (req, res)=> {
    var  info = {
        rutas: [
            {  
                descripcion: 'Informacion general de las rutas de cargos',
                metodo: 'get',
                url: 'servidor:3002/api/cargos/',
                parametros: 'ninguno'
            },
            
            {
                descripcion: 'Lista todos los cargos',
                metodo: 'get',
                url: 'servidor:3002/api/cargos/listar',
                parametros: 'ninguno'
            }
        ]
        
    }

    res.statusCode = 200
    res.setHeader("Content-Type", "application/json");
    res.json(info);
};

exports.listar =  async (req, res) =>{
    
    try {
        await modeloCargo.findAll()
        .then((data)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        })
        .catch((er)=>{
            console.log(er);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en la consulta"});

        });
    }catch(error) {
        console.log(error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({msg: "Error en el servidor"});
    }
}


exports.guardar = async (req, res) => {
    console.log(req.body);
    const {nombre} = req.body;
    console.log(nombre);

    const errores = validationResult(req);
    console.log(errores);

    var ers = []
    errores.errors.forEach(e => {
        ers.push({campo: e.path, mensaje: e.msg});
    });

    if(ers.length > 0){
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(ers);
    }else{

        try {
            //req body empareja toda la peticion. 
            await modeloCargo.create({...req.body})
            .then((data)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro guardado " + data});
            }).catch((er)=>{
                console.log(er);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Error en la consulta"});
            });
            
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }

        
};

exports.modificar = async(req, res) => {
    console.log(req.body);
    const {nombre} = req.body;
    console.log(nombre);

    const errores = validationResult(req);
    console.log(errores);

    var ers = []
    errores.errors.forEach(e => {
        ers.push({campo: e.path, mensaje: e.msg});
    });

    if(ers.length > 0){
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(ers);
    }else{

        try {
            const {id} = req.query;

            await modeloCargo.update(
                {
                    ...req.body
                },
                {
                    where: {
                        id: id
                    }
                }
            )
            .then((data)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro guardado " + data});
            }).catch((er)=>{
                console.log(er);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Error en la consulta"});
            });
            //req body empareja toda la peticion. 

            /*
            await modeloCargo.create({...req.body})
            .then((data)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro guardado " + data});
            }).catch((er)=>{
                console.log(er);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Error en la consulta"});
            });
            */
            
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }
}


exports.eliminar = async(req, res) => {
    console.log(req.body);
    const {nombre} = req.body;
    console.log(nombre);

    const errores = validationResult(req);
    console.log(errores);

    var ers = []
    errores.errors.forEach(e => {
        ers.push({campo: e.path, mensaje: e.msg});
    });

    if(ers.length > 0){
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(ers);
    }else{

        try {
            const {id} = req.query;

            await modeloCargo.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
            .then((data)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro guardado " + data});
            }).catch((er)=>{
                console.log(er);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Error en la consulta"});
            });
            
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }

}