import jwt from 'jsonwebtoken'

export const autenticar = (req, res, next) => {
    const authHeader = req.header.authorization
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' })
    }
    
    const token = authHeader.split(' ')[1]
    try {
        const verificado = jwt.verify(token, 'secreto')
        req.usuario = verificado
        next()
    } catch (error) {
        res.status(401).json({ mensaje: 'Token invalido' })        
    }
}