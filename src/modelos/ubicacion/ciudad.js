const sequelize = require('sequelize');
const db = require('../../configuraciones/db');

const Ciudad= db.define(
    "ciudad",
    {

        nombreCiudad: {
            type : sequelize.STRING(20),
            allowNull :  false,
        },

        estado: {
            type : sequelize.ENUM('AC', 'IN', 'BL'),
            allowNull: true,
            defaultValue : 'AC'
        }
    },

    {
        tableName : 'ciudades'
    }

);

module.exports = Ciudad;