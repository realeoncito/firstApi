const { Router } = require('express');
const controladorInicio = require('../controladores/controladorInicio');
const ruta = Router();

ruta.get('/', controladorInicio.inicio );

ruta.get('/otra', controladorInicio.otra);
ruta.get('/otra2', controladorInicio.otra2);

module.exports = ruta;