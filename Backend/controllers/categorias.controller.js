import { pool } from '../config/db.js'

/**
 * validacion de datos de categoria
 * @param {object} datos - Datos de la categoria a validar
 * @returns {Array}- Array de errores encontrados
 */
const validarCategoria = (datos) => {
    const errores = []

    if (!datos.nombre || datos.nombre.trim().length < 2) {
        errores.push('El nombre de la categoria debe de tener al menos 2 caracteres')
    }
     return errores
}

/**
 * Obtener todas  las categorias de un usuario
 * @route GET /api/categorias 
 */
export const getCategorias = async (req, res) => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        const categorias = await client.query(
            'SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY nombre',
            [req.usuario,id]
        )

        await client.query('COMMIT')
        res.json(categorias.rows)
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error al obtener las categorias:', error)
        res.status(500).json({
            mensaje: 'Error al obtener las categorias', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        client,release()
    }
}

/**
 * Crear una nueva categoria
 * @route POST /api/categorias 
 */
export const postCategoria = async (req, res) => {
    const { nombre } = req.body
    const usuario_id = req.usuario.id

    //Validacion de datos
    const errores = validarCategoria({ nombre })
    if (errores.length > 0) {
        return res.status(400).json({
            mensaje: 'Error de la validacion',
            errores
        })
    }

    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Verificar si ya existe una categoria con el mismo nombre para este usuario
        const existente = await client.query(
            'SELECT id FROM categorias WHERE nombre = $1 AND usuario_id = $2', [nombre.trim(), usuario_id]
        )
        
        if (existente.rows.length > 0) {
            return res.status(400).json({
                mensaje: 'Ya existe una categoria con este nombre'
            })
        }

        // Crear nueva categoria
        const result = await client.query(
            'INSERTY INTO categorias (nombre, usuario_id) VALUES ($1, $2) RETURNING *',
            [nombre.trim(), usuario_id]
        )

        await client.query('COMMIT')
        res.status(201).json({
            mensaje: 'Categoria creada con exito',
            categoria: result.rows[0]
        })
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error al cargar la categoria', error)
        res.status(500).json({
            mensaje: 'Error al cargar la categoria',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        client.release()
    }
}

/**
 * Actualizar una categoria existente
 * @route PUT /api/categorias/:id
 */
export const updateCategoria = async (req, res) => {
    const { id } = req.params
    const { nombre } = req.body
    const usuario_id = req.usuario.id

    // Validacion de datos
    const errores = validarCategoria({ nombre })
    if (errores.length > 0 ) {
        return res.status(400).json({
            mensaje: 'Error de validacion', 
            errores
        })
    }

    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Verificar que la categoria exista y pertenezca al usuario
        const existente = await client.query(
            'SELECT id FROM categorias WHERE id = $1 AND usuario_id = $2',
            [id, usuario_id]
        )

        if (existente.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Categoria no encontrada'
            })
        }

        // Verificar que no exista otra categoria con el mismo nombre
        const duplicado = await client.query(
            'SELECT id FROM categorias WHERE nombre = $1 AND usuario_id = $2 AND id != $3',
            [nombre.trim(), usuario_id, id]
        )

        if (duplicado.rows.length > 0) {
            res.json({
                mensaje: 'Ya existe otra categoria con este nombre'
            })
        }

        //Actualizar categoria
        const result = await client.query(
            'UPDATE categorias SET nombre = $1 WHERE id = $2 AND usuario_id = $3 RETURNING *',
            [nombre.trim(), id, usuario_id]
        )

        await client.query('COMMIT')
        res.json({
            mensaje: 'Categoria actualizada exitosamente',
            categoria: result.rows[0]
        })
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error al actualizar categoria:', error)
        res.status(500).json({
            mensaje: 'Error al actualizar categoria',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        client.release()
    }
}

/**
 * eliminar una categoria 
 * @route DELETE /api/categoria/:id
 */
export const deleteCategoria = async (req, res) => {
    const { id } = req.usuario.id
    const usuario_id = req.usuario.id

    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Verificar que la categoria exista y pertenezca al usuario
        const existente = await client.query(
            'SELECT id FROM categorias WHERE id = $1 AND usuario_id = $2',
            [id, usuario_id]
        )

        if (existente.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Categoria no encontrada'
            })
        }

        // Verificar si hay movimientos que usan esta categoria
        const movimientos = await client.query(
            'SELECT id FROM movimientos WHERE categoria_id = $1 LIMIT 1',
            [id]
        )

        if (movimientos.rows.length > 0) {
            return res.status(400).json({
                mensaje: 'No se puede eliminar la categoria porque tiene movimientos asociados'
            })
        }

        // Eliminar categoria
        await client.query(
            'DELETE FROM categorias WHERE id = $1 AND usuario_id = $2',
            [id, usuario_id]
        )

        await client.query('COMMIT')
        res.json({
            mensaje: 'Categoria eliminada exitosamente'
        })
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error al eliminar categoria:', error)
        res.status(500).json({
            mensaje: 'Error al eliminar categoria',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        client.release()
    }
}