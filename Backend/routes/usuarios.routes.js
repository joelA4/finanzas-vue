import express from 'express'
import { 
    obtenerUsuarios,
    obtenerPerfil,
    actualizarPerfil
} from '../controllers/usuarios.controller.js'
import { autenticar } from '../middleawares/auth.js'

const router = express.Router()

//Todas las rutas requieren autenticacion
router.use(autenticar)

//Rutas de usuario
router.get('/', obtenerUsuarios) //Solo admin
router.get('/perfil', obtenerPerfil)
router.put('/perfil', actualizarPerfil)

export default router
