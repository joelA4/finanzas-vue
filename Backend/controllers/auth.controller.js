import { pool } from '../config/db.js'

//registro de usuarios
export const registrar = async (req, res) => {
    const { nombre, email, nombreusuario, password } = req.body

    try {
        //validacion de correo o usuario
        const existente = await pool.query(
            `SELECT * FROM usuarios WHERE email = $1 OR nombreusuario = $2`,
            [email, nombreusuario]
        )

        if (existente.rows.length > 0){
            return res.status(400).json({ mensaje: 'El correo o nombre de usuario ya esta en uso' })
        }

        const nuevo = await pool.query(
            `INSERT INTO usuarios (nombre, email, nombreusuario, password, creado_en)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING id, nombre, email, nombreusuario, creado_en`, 
            [nombre, email, nombreusuario, password ]
        )

        res.status(201).json(nuevo.rows[0])
        
    } catch (error) {
        console.error(error)
        res.status(500).json({mensaje: 'Error al registrar usuario, intentalo mas tarde ' })
    }
}

//login
export const login = async (req, res) => {
    const { identificador, password} = req.body

    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE (email = $1 OR nombreusuario = $1) AND password = $2', 
            [identificador, password]
        )
        if (result.rows.length == 0 ){
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
        }

        //Devolver lo necesario
        const usuario = result.rows[0]
        res.json({
            id: usuario.id,
            mombre: usuario.nombre,
            email: usuario.email,
            nombreusuario: usuario.nombreusuario
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al iniciar sesion' })
    }
} 