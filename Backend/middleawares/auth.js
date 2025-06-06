import jwt from 'jsonwebtoken'

export const autenticar = (req, res, next) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' })
    }
    
    const token = authHeader.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({ mensaje: 'Formato de token inválido' })
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secreto')
        req.usuario = verificado
        next()
    } catch (error) {
        console.error('Error de autenticación:', error)
        res.status(401).json({ mensaje: 'Token inválido' })        
    }
}