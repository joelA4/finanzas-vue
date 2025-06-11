import { pool } from '../config/db.js'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

/**
 * Validacion de datos de usuario
 * @param {Object} datos - Datos del usuario a validar
 * @returns {Array} - Array de errores encontrados
 */

const validarDatosUsuario = (datos) => {
    const errores = []
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!datos.nombre || datos.nombre.trim().length < 2) {
        errores.push('El nombre debe tener al menos 2 caracteres')
    }
    if (!datos.email || !emailRegex.test(datos.email)) {
        errores.push('Email invalido')
    }
    if (!datos.nombreusuario || datos.nombreusuario.trim().length < 3) {
        errores.push('El nombre de usuario debe tener al menos 3 caracteres')
    }

    return errores
}

/**
 * Registro de nuevos usuarios
 * @route POST /api/auth/registro
 */
export const registrar = async (req, res) => {
    const { nombre, email, nombreusuario, password } = req.body

    try {
        // Validacion de datos
        const errores = validarDatosUsuario({ nombre, email, nombreusuario, password })
        if (errores.length > 0) {
            return res.status(400).json({
                mensaje: 'Error de validacion',
                errores
            })
        }

        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            //Verificar si el usuario ya existe
            const existente = await client.query(
                'SELECT * FROM usuarios WHERE email = $1 OR nombreusuario = $2',
                [email, nombreusuario]
            )

            if (existente.rows.length > 0) {
                return res.status(400).json({
                    mensaje: 'El correo o nombre de usuario ya esta en uso'
                })
            }

            //Encriptar contrasena
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // Insertar nuevo usuario
            const nuevo = await client.query(
                `INSERT INTO usuarios (nombre, email, nombreusuario, password, creado_en)
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                RETURNING id, nombre, email, nombreusuario. crceado_en`,
                [nombre, email, nombreusuario, hashedPassword]
            )

            //Generar token JWT
            const token = jwt.sign(
                {
                    id: nuevo.rows[0].id,
                    nombreusuario: nuevo.rows[0].nombreusuario
                },
                process.env.JWT_SECRET || 'secreto', 
                { expiresIn: '24h' }
            )

            await client.query('COMMIT')

            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                usuario: nuevo.rows[0],
                token
            })
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    } catch (error) {
        console.error('Error en registro:', error)
        res.status(500).json({
            mensaje: 'Error al registrar usuario', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Inicio de sesion de usuarios
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
    const { identificador, password } = req.body

    try {
        //Validacion basica
        if (!identificador || !password) {
            return res.status(400).json({
                mensaje: 'Identificador y contraseña son requeridos'
            })
        }

        const client = await pool.connect()
        
        try {
            // Buscar usuario
            const result = await client.query(
                'SELECT * FROM usuario WHERE email = $1 OR nombreusuario = $1',
                [identificador]
            )

            if (result.rows.length === 0) {
                return res.status(401).json({
                    mensaje: 'Credenciales incorrectas'
                })
            }

            const usuario = result.rows[0]

            //Verificar contrasena
            const passwordValida = await bcrypt.compare(password, usuario.password)
            if (!passwordValida) {
                return res.status(401).json({
                    mensaje: 'Credenciales incorrectas'
                })
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: usuario.id,
                    nombreusuario: usuario.nombreusuario
                },
                process.env.JWT_SECRET || 'secreto',
                { expiresIn: '24h' }
            )

            //Devolver respuesta sin la contrasena
            const { password: _, ...usuarioSinPassword } = usuario
            res.json({
                mensaje: 'Inicio de sesion ecitoso',
                token,
                usuario: usuarioSinPassword
            })
        } finally {
            client.release()
        }
    } catch (error) {
        console.error('Error en login:', error)
        res.status(500).json({
            mensaje: 'Error al iniciar sesion',
            error: process.env.NODE_ENV == 'development' ? error.menssage : undefined
        })
    }
}