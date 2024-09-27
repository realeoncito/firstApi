const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const Usuario = db.define(
    "usuario",
    {
        username : {
            type: sequelize.STRING(20), 
            allowNull :  false,
            unique : {
                args : true,
                msg : "Ya existe un usuario con ese nombre de usuario."
            }
        },

        password : {
            type: sequelize.STRING(30),
            allowNull : false
        },

        correoElectronico : {
            type : sequelize.STRING(50),
            allowNull : true
        }
    },
    {
        tableName : "Usuarios"
    }

);

module.exports = Usuario;