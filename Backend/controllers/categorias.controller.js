import {
    obtenerCategorias,
    crearCategoria
} from '../models/categoria.model.js'

export const getCategorias = async (req, res) => {
    try {
        const categorias = await obtenerCategorias(req.usuario.id)
        res.json(categorias)    
    } catch (error) {
        res.status(500).json({mensaje: 'Error al obtener categorias'})    
    }
}

export const postCategoria = async (req, res) => {
    const { nombre } = req.body
    if (!nombre) return res.status(400).json({mensaje: 'Nombre requerido' })

        try {
            const nueva = await crearCategoria({
                nombre,
                usuario_id: req.usuario_id
            })
            res.status(201).json(nueva)
        } catch (error) {
            res.status(500).json({mensaje: 'Error al crear categoria' })
        }
}