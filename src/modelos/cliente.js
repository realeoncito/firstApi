const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const Cliente = db.define(
    "cliente", 
    {
        identidadCliente : {
            type: sequelize.STRING(13),
            allowNull: false,
            unique: {
                args: true,
                msg: "Numero de identidad existente"
            }
        },

        primerNombre: {
            type : sequelize.STRING(50),
            allowNull :  false,

        },
        segundoNombre: {
            type : sequelize.STRING(50),
            allowNull :  true,

        },
        primerApellido: {
            type : sequelize.STRING(50),
            allowNull :  false,

        },
        segundoApellido: {
            type : sequelize.STRING(50),
            allowNull :  true,

        },

        imagen:{
            type: sequelize.STRING(250),
            allowNull : true
        },

        estado : {
            type : sequelize.ENUM('AC', 'IN'),
            allowNull: true,
            defaultValue : 'AC'
        }
    },

    {
        tableName : 'clientes'
    }

);

module.exports = Cliente;