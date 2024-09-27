exports.inicio = (req, res) => {
    res.send("Hola Mundo");
};
exports.otra = (req, res)=>{
    var info = {
        nombre : "Juanito",
        apellido: "Alcachofa",
        profesion: "Vago"
    };
    res.json(info);
};
exports.otra2 = (req, res)=>{
    var info = {
        nombre : "Juanito",
        apellido: "Alcachofa",
        profesion: "Vago"
    };

    res.statusCode = 500;

    res.json({nombreCompleto : info.nombre + ' ' + info.apellido});
};