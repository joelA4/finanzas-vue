import { extractRuntimeProps } from 'vue/compiler-sfc'
import { pool } from '../config/db.js'

/**
 * Obtener todos los usuarios (solo para administradores)
 * @routes GET /api/usuarios 
 */
export const obtenerUsuarios = async (req, res) => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Verificar si el usuario es administrador
        const esAdmin = await client.query(
            'SELECT es_admin FROM usuarios WHEREE id = $1',
            [req.usuario.id]
        )

        if (!esAdmin.rows[0]?.es_admin) {
            return res.status(403).json({
                mensaje: 'No tienes permisos para ver esta informacion'
            })
        }

        const resultado = await client.query(`
            SELECT 
                id, 
                nombre, 
                email, 
                nombreusuario, 
                creado_en, 
                es_admin
            FROM usuarios
            ORDER BY creado_en DESC
            `)

            await client.query('COMMIT')
        res.json(resultado.rows)
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error al obtener usuarios:', error)
        res.status(500).json({
            mensaje: 'Error al obtener usuarios',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        client.release()
    }
}

/**
 * Obtener perfil del usuario actual
 * @route GET /api/usuario/perfil
 */
export const obtenerPerfil = async (req, res) => {
    const client = await pool.connect() 
    try {
        const client  = await client.query(
            `
            SELECT
                id,
                nombre,
                email,
                nombreusuario,
                creado_en
                FROM usuarios
                WHERE is = $1`,
                [req.usuario.id]
        )

        if (resultado.rows.length === 0) {
            return res.status(400).json({
                mensaje: 'Usuario no encontrado'
            })
        }

        res.json(resultado.rows[0])
    } catch (error) {
        console.error('Error al obtener perfil:', error)
        res.status(500).json({
            mensaje: 'Error al obtener perfil',
            error: process.env.NODE_ENV === 'development' ? error.mensaje : undefined
        })
    } finally {
        client.release()
    }
}

/**
 * Actualizar perfil del usario
 * @route PUT /api/usuario/perfil
 */
export const actualizarPerfil = async (req, res) => {
    const { nombre, email } = req.body
    const usuario_id = req.usuario.id

    // Validacion basico
    if (!nombre || !email) {
        return res.status(400).json({
            mensaje: 'Nombre y email son requerido'
        })
    }

    try {
        await client.query('BEGIN')
    
        // Verificar si el email ya esta en uso por otro usuario
        const emailExistente = await client.query(
            'SELECT id FROM usuarios WHERE email = $1 AND id != $2',
            [email, usuario_id]
        )
    
        if (emailExistente.rows.length > 0) {
            return res.status(400).json({
                mensaje: 'El email ya esta en uso'
            })
        }

        const resultado = await client.query(
            `UPDATE usuarios
            SET nombre = $1, email = $2, actualizado_en = CURRENT_TIMESTAMP\
            WHERE id = $3
            RETURNING id, nombre, email, nombreusuario, creado_en, actualizado_en`,
            [nombre, email, usuario_id]
        )

        await client.query('COMMIT')
        res.json({
            mensaje: 'Perfil actualizado exitosamente',
            usuario: resultado.rows[0]
        })
    } catch (error) {
        await client.query('ROLLBACK')
        await client.query('Error al actualizar perfil:', error)
        res.status(500).json({
            mensaje: 'Error al actualizar perfil',
            error: process.env.NODE_ENV ==='development' ? error.message : undefined
        })
    } finally {
        client.release()
    }
}