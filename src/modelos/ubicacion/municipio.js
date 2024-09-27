const sequelize = require('sequelize');
const db = require('../../configuraciones/db');

const Municipio= db.define(
    "municipio",
    {
        codMunicipio: {
            type: sequelize.STRING(2),
            allowNull: false
        },

        nombreMunicipio: {
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
        tableName : 'municipios'
    }

);

module.exports = Municipio;