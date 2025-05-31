import express from "express";
import { getCategorias, postCategoria } from "../controllers/categorias.controller";
import { autenticar } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', autenticar, getCategorias)
router.post('/', autenticar, postCategoria)

export default router