/*Programa principal donde va a estar toda la logica */

//Asignacion de los npm importados
const express = require('express');
const morgan = require('morgan');

const db = require('./configuraciones/db');
const modeloCargo = require('./modelos/cargo');
const modeloEmpleado = require('./modelos/empleado');
const modeloUsuario = require('./modelos/usuario');

//Ubicacion
const modeloDepartamento = require('./modelos/ubicacion/departamento');
const modeloMunicipio = require('./modelos/ubicacion/municipio');
const modeloCiudad = require('./modelos/ubicacion/ciudad');
const modeloBarrio = require('./modelos/ubicacion/barrio');
const modeloClienteDireccion = require('./modelos/ubicacion/clienteDireccion');


//Info del cliente. 
const modeloCliente = require('./modelos/cliente');
const modeloClienteTelefono = require('./modelos/clienteTelefono');

db.authenticate()
.then( async (data)=>{
    console.log('Conexion exitosa');

    //definir relaciones
    modeloCargo.hasMany(modeloEmpleado);
    modeloEmpleado.belongsTo(modeloCargo);
    /*
    modeloEmpleado.hasMany(modeloUsuario);
    modeloUsuario.belongsTo(modeloEmpleado);
*/
    //relaciones ubicacion
    modeloDepartamento.hasMany(modeloMunicipio);
    modeloMunicipio.belongsTo(modeloDepartamento);

    modeloMunicipio.hasMany(modeloCiudad);
    modeloCiudad.belongsTo(modeloMunicipio);

    modeloCiudad.hasMany(modeloBarrio);
    modeloBarrio.belongsTo(modeloCiudad);

    modeloBarrio.hasMany(modeloClienteDireccion);
    modeloClienteDireccion.belongsTo(modeloBarrio);
    
    modeloCliente.hasMany(modeloClienteTelefono);
    modeloClienteTelefono.belongsTo(modeloCliente);

    modeloCliente.hasMany(modeloClienteDireccion);
    modeloClienteDireccion.belongsTo(modeloCliente);

    await modeloCargo.sync().then((data)=>{
        console.log('Modelo cargo de manera exitosa');
    }).catch((er)=>{
        console.log('Error cargando el modelo: ' + er);
    });

    await modeloEmpleado.sync().then((data)=>{
        console.log('Modelo empleado cargado');
    }).catch((er)=>{
        console.log('Error cargando empleado:' + er);
    });
/*
    await modeloUsuario.sync().then((data)=>{
        console.log('Modelo usuario cargado');
    }).catch((er)=>{
        console.log('Error cargando usuario: ' + er);
    });
*/
    await modeloDepartamento.sync().then((data)=>{
        console.log('modelo departamento cargado Exitosamente');
    }).catch((er)=>{
        console.log('Error cargando departamento');
    });
    
    await modeloMunicipio.sync().then((data)=>{
        console.log('modelo Municipio cargado Exitosamente');
    }).catch((er)=>{
        console.log('Error cargando Municipio');
    });

    await modeloCiudad.sync().then((data)=>{
        console.log('modelo Ciudad cargado Exitosamente');
    }).catch((er)=>{
        console.log('Error cargando Ciudad');
    });

    await modeloBarrio.sync().then((data)=>{
        console.log('modelo Barrio cargado Exitosamente');
    }).catch((er)=>{
        console.log('Error cargando Barrio');
    });

    await modeloCliente.sync().then((data)=>{
        console.log('modelo Cliente cargado Exitosamente');
    }).catch((er)=>{
        console.log('Error cargando Cliente');
    });

    await modeloClienteTelefono.sync().then((data)=>{
        console.log('modelo ClienteTelefono cargado Exitosamente');
    }).catch((er)=>{
        console.log('Error cargando ClienteTelefono');
    });

    await modeloClienteDireccion.sync().then((data)=>{
        console.log('modelo ClienteDireccion cargado Exitosamente');
    }).catch((er)=>{
        console.log('Error cargando ClienteDireccion');
    });


})
.catch((er)=>{
    console.log("Error al conectar: " + er);
});

const app = express();
app.set('port', 3002);
app.use(morgan('dev'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api', require('./rutas'));

app.use('/api/cargos', require('./rutas/rutasCargo'));
app.use('/api/departamentos', require('./rutas/rutasDepartamento'));
app.use('/api/municipios', require('./rutas/rutasMunicipio'));
app.use('/api/ciudades', require('./rutas/rutasCiudad'));
app.use('/api/barrios', require('./rutas/rutasBarrio'));

app.listen(app.get('port'), ()=>{
    console.log('Servidor iniciado en el puerto '+ app.get('port'));
});