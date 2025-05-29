import { pool } from '../config/db.js'

// Obtener todos los movimientos
export const obtenerMovimientos = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM movimientos WHERE id = $1`)
        [id]
    if (result.rows.length === 0) return res.status(404).json({ mensaje: 'movimiento no encontrado'});
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            mensaje: 'Error al obtener movimientoss '
        });
    }
};

//Editar un movimiento
export const actualizarMovimiento = async (req, res) => {
    const { id } = req.params;
    const { descripcion, monto, fecha, categoria_id, tipo } = req.body;
    try {
        await pool.query(
            `UPDATE movimientos
            SET descripcion = $1, monto = $2, fecha = $2, categoria_id = $4, tipo = $5 WHERE id $6`, 
            [descripcion, monto, fecha, categoria_id, tipo, id]
        );
        res.json({ mensaje: "movimiento actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el movimiento :( " });
    }
};

//Crear un nuevo movimiento 
export const crearMovimiento = async (req, res) => {
    const {
        descripcion,
        monto,
        categoria_id,
        fecha,
        tipo
    } = req.body

    try {
        const result =await pool.query(
            'INSERT INTO movimientos (descripcion, monto, categoria_id, fecha, tipo, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [descripcion, monto, categoria_id, fecha, tipo]
        )
        res.status(201).json(crearMovimiento.rows[0])
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
        res.status({ mensaje: "Movimiento eliminado con exito" });   
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'Error al eliminar movimiento' })        
    }
}