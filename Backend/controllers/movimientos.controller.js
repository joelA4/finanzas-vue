import { pool } from '../config/db.js'

// Obtener todos los movimientos
export const obtenerMovimientos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movimientos ORDER BY fecha DESC')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            mensaje: 'Error al obtener movimientos '
        })
    }
}

//Crear un nuevo movimiento 
export const crearMovimiento = async (req, res) => {
    const {
        descripcion,
        monto,
        categoria_id,
        fecha,
        tipo,
        usuario_id
    } = req.body

    try {
        const result =await pool.query(
            'INSERT INTO movimientos (descripcion, monto, categoria_id, fecha, tipo, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
            [descripcion, monto, categoria_id, fecha, tipo, usuario_id]
        )

        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al crear movimiento' })
    }
}

//eliminar un movimiento
export const eliminarMovimiento = async (req, res) => {
    const { id } = req.params

    try {
        await pool.query('DELETE FROM movimientos WHERE id = $1', [id])
        res.status(204).send()   
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al eliminar movimiento' })        
    }
}