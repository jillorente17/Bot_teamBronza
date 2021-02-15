const mongoose = require('mongoose')

const URI = (process.env.mongoURI || 'mongodb+srv://admin:7912312jose@cluster0.2nwfn.mongodb.net/teamBronza_db?retryWrites=true&w=majority');


// Abriendo Conexion
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Conexion Existosa
mongoose.connection.on('connected', () => {
  console.log(`Base de Datos Conectada`)
})

// Error en Conexion
mongoose.connection.on('error', (err) => {
  console.log('Error conectado a la base de datos', err)
})

// Desconexion de Base de Datos
mongoose.connection.on('disconnected', () => {
  console.log('Base de Datos Desconectada')
})

// Desconexion por Cierre de Aplicacion Proccess(0)
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Base de Datos Desconectada por Terminacion de Aplicacion')
    process.exit(0)
  })
})
