const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const ClienteTelefono= db.define(
    "clienteTelefono",
    {
        numero: {
            type : sequelize.STRING(15),
            allowNull :  false,

        }
    },

    {
        tableName : 'clienteTelefonos'
    }

);

module.exports = ClienteTelefono;