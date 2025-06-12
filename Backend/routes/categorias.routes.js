import express from "express";
import { 
    getCategorias,
    postCategoria,
    updateCategoria,
    deleteCategoria 
    } from "../controllers/categorias.controller.js";
import { autenticar } from '../middleawares/auth.js'

const router = express.Router()
// Todas las rutas requieren autenticacion
router.use(autenticar)

// Rutas de categoria
router.get('/', getCategorias)
router.post('/', postCategoria)
router.put('/', updateCategoria)
router.delete('/', deleteCategoria)

export default router
