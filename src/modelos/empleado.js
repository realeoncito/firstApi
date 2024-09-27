const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const Empleado = db.define(
    "empleado", //nombre del modelo o tabla en la bdd
    {

        identidad: {
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

        sueldo: {
            type : sequelize.DOUBLE,
            allowNull:  true,
            defaultValue: 0
        },

        imagen:{
            type: sequelize.STRING(250),
            allowNull : true
        },

        estado : {
            type : sequelize.ENUM('AC', 'IN', 'BL'),
            allowNull: true,
            defaultValue : 'AC'
        }

    },
    {
        tableName: "empleados"
    }

);

module.exports = Empleado;