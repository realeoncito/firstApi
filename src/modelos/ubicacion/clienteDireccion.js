const sequelize = require('sequelize');
const db = require('../../configuraciones/db');

const clienteDireccion= db.define(
    "clienteDireccion",
    {
        direccion: {
            type : sequelize.TEXT,
            allowNull :  false,

        }
    },

    {
        tableName : 'clienteDirecciones'
    }

);

module.exports = clienteDireccion;