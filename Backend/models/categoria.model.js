import pool from '../config/db.js'

export const obtenerCategorias = async (usuario_id) => {
    const result = await pool.query(
        `SELECT * FROM categorias WHERE usuario_id = $1`, [usuario_id])
        return result.rows
}

export const crearCategoria = async ({ nombre, usuario_id }) => {
    const result = await pool.query(
        'INSERT INTO categorias (nombre, usuario_id) VALUES ($1, $2) RETURNING *',
        [nombre, usuario_id]
    ) 
    return result.rows[0]
}
