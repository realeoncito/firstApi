const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const Cargo = db.define(
    "cargo", //nombre del modelo o tabla en la bdd
    {
        nombre: {
            type : sequelize.STRING(50),
            allowNull :  false,
            unique : {
                args : true,
                msg: "Ya existe un este nombre del cargo"
            }

        },

        descripcion: {
            type: sequelize.TEXT,
            allowNull: true
        },

        activo : {
            type: sequelize.BOOLEAN,
            defaultValue: true,
            allowNull : true
        }

    },
    {
        tableName: "cargos"
    }

);

module.exports = Cargo;