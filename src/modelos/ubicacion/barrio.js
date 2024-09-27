const sequelize = require('sequelize');
const db = require('../../configuraciones/db');

const Barrio= db.define(
    "barrio",
    {

        nombrebarrio: {
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
        tableName : 'barrios'
    }

);

module.exports = Barrio;