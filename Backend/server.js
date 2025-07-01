import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
// import usuariosRoutes from './routes/usuarios.routes.js'
// import movimientosRoutes from './routes/movimientos.routes.js'
import authRoutes from './routes/auth.routes.js'
// import categoriasRoutes from './routes/categorias.routes.js'

dotenv.config()

const app = express()

// Configuracion de CORS
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente' })
})

// Middleware para logging básico
app.use((req, res, next) =>{
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
})

// Rutas
// app.use('/api/usuarios', usuariosRoutes)
// app.use('/api/movimientos', movimientosRoutes)
app.use('/api/auth', authRoutes)
// app.use('/api/categorias', categoriasRoutes)

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' })
})

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        mensaje: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    })
})

const PORT = process.env.PORT || 3000

// Inicio del servidor con manejo de errores 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Error al iniciar el servidor: ', err)
    process.exit(1)
})

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('Recibida señal SIGTERM. Cerrando servidor...')
    process.exit(0)
})

process.on('SIGINT', () =>{
    console.log('Recibida señal SIGINT. Cerrando servidor...')
    process.exit(0)
})


