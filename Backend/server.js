import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import usuariosRoutes from './routes/usuarios.routes.js'
import movimientosRoutes from './routes/movimientos.routes.js'
import authRoutes from './routes/auth.routes.js'
import categoriasRoutes from './routes/categorias.routes.js'
import { extend } from '@vue/shared'
import { nextTick } from 'vue'

dotenv.config()

const app = express()

// Configuracion de CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Autorization']
}

app.use(cors(Options))
app.use(express.json())
app.use(expres.urlencoded({ extended: true }))

// Middleware para logging basico
app.use((req, res, next) =>{
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
})

// Rutas
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/movimientos', movimientosRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/categorias', categoriasRoutes)

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

// Inicio del sevidor con manejo de errores 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
}).on('error', (err) => {
    console.error('Error al iniciar el servidor: ', err)
    process.exit(1)
})

// Manejo de señales de terminacion
process.on('SIGTERM', () => {
    console.log('Recibida señal SIFTERM. Cerrando servidor...')
    process.exit(0)
})

process.on('SIGINT', () =>{
    console.log('Recibida señal SIGINT. Cerrando servidor...')
    process.exit(0)
})


