const sequelize = require('sequelize');
const db = require('../../configuraciones/db');

const Departamento= db.define(
    "departamento",
    {
        codDepartamento: {
            type: sequelize.STRING(2),
            allowNull: false
        },

        nombreDepartamento: {
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
        tableName : 'departamentos'
    }

);

module.exports = Departamento;