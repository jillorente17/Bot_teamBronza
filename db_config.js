var mysql = require('mysql');

// Credenciales de la Base de datos.
var DBConfig = {
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: "db4free.net",
    port: 3306,
    database: "db_b",
    user: "bowshot721",
    password: "7912312Jose"
};

var pool = mysql.createPool(DBConfig);

pool.on('connection', (connection) => {
	console.log('Conexión establecida con la DB.');
  
	connection.on('error', (err) => {
	  console.error(new Date(), 'Error de MySQL: ', err.code);
	
  });
	connection.on('close', (err) => {
	  console.error(new Date(), 'Conexión cerrada con la DB.', err);
	});
});

module.exports.pool = pool;

