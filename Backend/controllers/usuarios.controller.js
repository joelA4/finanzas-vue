import { pool } from '../config/db.js'

export const obtenerUsuarios = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios')
        res.json(resultado.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'error al obtener usuarios :('})
    }
}