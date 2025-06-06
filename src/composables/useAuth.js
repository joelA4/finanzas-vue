import { ref } from 'vue'
import axios from 'axios'

export function useAuth() {
    const usuario = ref(null)
    const cargando = ref(true)
    const error = ref(null)

    const verificarAuth = async () => {
        const token = localStorage.getItem('token')
        const usuarioGuardado = localStorage.getItem('usuario')

        if (token && usuarioGuardado) {
            try {
                usuario.value = JSON.parse(usuarioGuardado)
                // Configurar el token por defecto para todas las peticiones
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            } catch (err) {
                console.error('Error al cargar la sesión:', err)
                cerrarSesion()
            }
        }
        cargando.value = false
    }

    const iniciarSesion = async (credenciales) => {
        try {
            error.value = null
            const res = await axios.post('http://localhost:3000/api/auth/login', credenciales)
            
            const { token, usuario: userData } = res.data
            
            // Guardar en localStorage
            localStorage.setItem('token', token)
            localStorage.setItem('usuario', JSON.stringify(userData))
            
            // Actualizar estado
            usuario.value = userData
            console.log('Usuario actualizado en useAuth: ', usuario.value)
            
            // Configurar axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            return true
        } catch (err) {
            console.error('Error de inicio de sesión:', err)
            error.value = err.response?.data?.mensaje || 'Error al iniciar sesión'
            return false
        }
    }

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        usuario.value = null
        delete axios.defaults.headers.common['Authorization']
    }

    // Verificar autenticación al inicio
    verificarAuth()

    return {
        usuario,
        cargando,
        error,
        iniciarSesion,
        cerrarSesion,
        verificarAuth
    }
}