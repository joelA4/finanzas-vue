import express from 'express'
import {
    obtenerMovimientos,
    crearMovimiento,
    eliminarMovimiento
} from '../controllers/movimientos.controller.js'

const router = express.Router()
router.get('/prueba', (req, res)=>{ res.json({ mensaje: 'Ruta de prueba OK'});});
router.get('/', obtenerMovimientos)
router.post('/', crearMovimiento)
router.delete('/:id', eliminarMovimiento)

export default router