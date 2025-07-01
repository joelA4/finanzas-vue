import { DatabaseError } from 'pg'
import { pool } from '../config/db.js'

// Obtener todos los movimientos
export const obtenerMovimientos = async (req, res) => {
    const { usuario_id } = req.params
    try {
        const result = await pool.query(`
            SELECT 
                movimientos.id,
                movimientos.descripcion,
                movimientos.tipo,
                movimientos.monto,
                movimientos.fecha,
                movimientos.categoria_id,
                categorias.nombre AS categoria_nombre
            FROM movimientos
            LEFT JOIN categorias ON movimientos.categoria_id = categorias.id
            WHERE movimientos.usuario_id = $1
            ORDER BY movimientos.fecha DESC
        `, [usuario_id])

        res.json(result.rows)
    } catch (error) {
        console.error('Error al obtener movimientos: ', error)
        res.status(500).json({
            mensaje: 'Error al obtener movimientos',
            error: error.message
        });
    }
}


//Validacion de datos para movimientos
export const validarMovimiento = (datos) => {
    const errores = []

    if ((!datos.descripcion || datos.descripcion.trim().length === 0)) {
        errores.push('La descripcion es requerida')
    }
    if (!datos.monto || isNaN(datos.monto) || datos.monto <= 0) {
        errores.push('El monto debe ser un numero positivo')
    }
    if (typeof datos.tipo !== 'boolean') {
        errores.push('El tipo debe ser verdadero (ingreso) o falso (gasto)')
    }
    if (!datos.fecha || isNaN(new Date(datos.fecha).getTime())) {
        errores.push('La fecha es invalida')
    }

    return errores
}

// Crear un nuevo movimiento
export const crearMovimiento = async (req, res) => {
    const {
        descripcion,
        monto,
        usuario_id,
        categoria_id,
        fecha,
        tipo
    } = req.body

    //validar datos
    const errores = validarMovimiento(req.body)
    if (errores.length > 0) {
        return res.status(400).json({
            mensaje: 'Error de validacion',
            errores
        })
    }

    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const result = await client.query(
            'INSERT INTO movimientos (descripcion, monto, fecha, tipo, usuario_id, categoria_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
            [descripcion, monto, fecha, tipo, usuario_id, categoria_id] 
        )

        // Si hay categoria, verificar que exista
        if (categoria_id) {
            const catResult = await client.query(
                'SELECT id FROM categorias WHERE id = $1 AND usuario_id = $2',
                [categoria_id, usuario_id]
            )

            if (catResult.rows.length === 0) {
                throw new Error('Categoria no encontrada')
            }
        }

        await client.query('COMMIT')
        res.status(201).json(result[0])
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error al crear movimiento: ', error)
        res.status(500).json({
            mensaje: 'Error al crear movimiento',
            error: error.message
        })
    } finally {
        client.release()
    }
}

//editar un movimiento
export const actualizarMovimiento = async (req, res) => {
    const { id } = req.params
    const { descripcion, monto, fecha, categoria_id, tipo } = req.body

    // Validar datos 
    const errores = validarMovimientos(req.body)
    if (errores.length > 0) {
        return res.status(400).json({
            mensaje: 'Error de validacion',
            errores
        })
    }

    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Verificar que el movimiento exista y pertenezca al usuario
        const existeMovimiento = await client.query(
            'SELECT id FROM movimientos WHERE id = $1 AND usuario_id = $2', 
            [id, req.usuario_id]
        )
        
        if (existeMovimiento.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Movimiento no encontrado :/'
            })
        }

        const result = await client.query(
            `UPDATE movimientos
            SET descripcion = $1, monto = $2, fecha = $3, categoria_id = $4, tipo = $5 WHERE id = $6
            RETURNING *`,
            [descripcion, monto, fecha, categoria_id, tipo, id]
        )

        await client.query('COMMIT')
        res.json(result.rows[0])
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error al actualizar movimiento:', error)
        res.status(500).json({
            mensaje: 'Error al actualizar movimiento', 
            error: error.message
        })
    } finally {
        client.release()
    }
}


//eliminar un movimiento
export const eliminarMovimiento = async (req, res) => {
    const { id } = req.params
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        //verificar que el movimiento exista y pertenezca al usuario
        const existeMovimiento = await client.query(
            'SELECT id FROM movimiento WHERE id = $1 AND usuario_id = $2',
            [id, req.usuario_id]
        )

        if (existeMovimiento.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Movimiento no encontrado'
            })
        }

        //        await pool.query('DELETE FROM movimientos WHERE id = $1', [id]) cambiar a pool antes de lanzamiento del beta
        await client.query('DELETE FROM movimientos WHERE id = $1', [id])
        await client.query('COMMIT')

        res.status({ mensaje: "Movimiento eliminado con exito" });   
    
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error al eliminar el movimeinto: ', error)
        res.status(500).json({ 
            mensaje: 'Error al eliminar movimiento',
            error: error.message
        })        
    } finally {
        client.release()
    }
}