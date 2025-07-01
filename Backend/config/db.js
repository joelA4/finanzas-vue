import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const { Pool } = pkg

//Validación de variables de entorno requeridas
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_PASSWORD', 'DB_DATABASE', 'DB_PORT']
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
    throw new Error(`Variables de entorno faltantes: ${missingEnvVars.join(', ')}`);
}

const dbPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

// Prueba de conexión inicial
dbPool.connect((err, client, release) =>{
    if (err) {
        console.error('Error al conectar con la base de datos:', err.stack )
    } else {
        console.log('Conexión exitosa con la base de datos')
        release()
    }
})

//Manejo de errores de la pool
dbPool.on('error', (err) =>{
    console.error('Error inesperado en el pool de conexiones: ', err)
})

export { dbPool as pool }
