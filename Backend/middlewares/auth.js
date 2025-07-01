import jwt from 'jsonwebtoken'

export const autenticar = (req, res, next) => {
   
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                mensaje: 'Token no proporcionado', 
                error: 'AUTH_NO_TOKEN'
            })
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                mensaje: 'Formato de token inválido',
                error: 'AUTH_INVALID_FORMAT'
            })
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                mensaje: 'Token no encontrado',
                error: 'AUTH_TOKEN_MISSING'
            })            
        }

        try {
            const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secreto')

            if (!verificado.id || !verificado.nombreusuario) {
                return res.status(401).json({
                    mensaje: 'Token malformado',
                    error: 'AUTH_TOKEN_MALFORMED'
                })
            }

            req.usuario = verificado
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError'){
                return res.status(401).json({
                    mensaje: 'Token expirado',
                    error: 'AUTH_TOKEN_EXPIRED'
                })
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    mensaje: 'Token inválido',
                    error: 'AUTH_TOKEN_INVALID'
                })
            }
            throw error
        }
    } catch (error) {
        console.error('Error de autenticación: ', error)
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: 'AUTH_SERVER_ERROR'
        })
    }
} 