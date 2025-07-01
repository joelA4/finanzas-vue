import express from 'express'
import {
    obtenerMovimientos,
    validarMovimiento,
    crearMovimiento,
    actualizarMovimiento,
    eliminarMovimiento
} from '../controllers/movimientos.controller.js'
import { autenticar } from '../middlewares/auth.js';

const router = express.Router()

// Todas las rutas requieren autenticacion
router.use(autenticar)

// Rutas de movimiento
//router.get('/prueba', (req, res)=>{ res.json({ mensaje: 'Ruta de prueba OK'});});
router.get('/', obtenerMovimientos)
router.post('/', crearMovimiento)
router.post('/:id', actualizarMovimiento)
router.delete('/:id', eliminarMovimiento)

export default router
