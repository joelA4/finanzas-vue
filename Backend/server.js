import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import usuariosRoutes from './routes/usuarios.routes.js'
import movimientosRoutes from './routes/movimientos.routes.js'
import authRoutes from './routes/auth.routes.js'
import categoriasRoutes from './routes/categorias.routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/movimientos', movimientosRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/categorias', categoriasRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`)
})
