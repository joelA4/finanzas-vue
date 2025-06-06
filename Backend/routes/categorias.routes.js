import express from "express";
import { getCategorias, postCategoria } from "../controllers/categorias.controller.js";
import { autenticar } from '../middleawares/auth.js'

const router = express.Router()

router.get('/', autenticar, getCategorias)
router.post('/', autenticar, postCategoria)

export default router