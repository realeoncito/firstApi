const sequelize = require('sequelize');
const db = new sequelize(
    "movil2", //Nombre de la bdd
    "root", //Usuario de la bdd
    "Josuela30", //pw de la bdd
    {
        host: "localhost",
        dialect: "mysql",
        port: 3306,

    }
);

module.exports = db;