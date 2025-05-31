import { pool } from '../config/db.js'

// Obtener todos los movimientos
export const obtenerMovimientos = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
            movimientos.id,
            movimientos.descripcion,
            movimientos.tipo,
            movimientos.fecha,
            movimientos.categoria_id,
            movimientos.nombre AS categoria_nombre
            FROM movimientos
            LEFT JOIN categorias ON movimmientos.categoria_id = categorias.id
            WHERE movimientos.usuario.id = $1
            ORDER BY movimientos.fecha DESC
            `, [usuario_id])

            res.json(result.rows);
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
        usuario_id,
        categoria_id,
        fecha,
        tipo
    } = req.body

    try {
        const result =await pool.query(
            'INSERT INTO movimientos (descripcion, monto, fecha, tipo, usuario_id, categoria_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
            [descripcion, monto, fecha, tipo, usuario_id, categoria_id]
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