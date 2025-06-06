import { onMounted, ref } from 'vue'
import axios from 'axios'

export function useCategorias(){
    const categorias = ref([])
    const nuevaCategoria = ref('')
    const error = ref(null)
    const API = 'http://localhost:3000/api/categorias'

    const headers = () => {
        const token = localStorage.getItem('token')
        console.log('Token actual:', token) // Debug
        if (!token) {
            throw new Error('No hay token de autenticación')
        }
        return {
            Authorization: `Bearer ${token}`
        }
    }

    const cargarCategorias = async () => {
        try {
            error.value = null
            const res = await axios.get(API, { headers: headers() })
            categorias.value = res.data
        } catch (err) {
            console.error('Error al cargar categorias:', err)
            error.value = 'Error al cargar las categorías'
            if (err.response?.status === 401) {
                error.value = 'Sesión expirada o inválida'
            }
        }
    }

    const agregarCategoria = async () => {
        if (!nuevaCategoria.value.trim()) return
        try {
            error.value = null
            console.log('Intentando agregar categoría...') // Debug
            const res = await axios.post(API, 
                { nombre: nuevaCategoria.value.trim() }, 
                { headers: headers() }
            )
            console.log('Respuesta del servidor:', res.data) // Debug
            categorias.value.push(res.data)
            nuevaCategoria.value = ''
        } catch (err) {
            console.error('Error completo al agregar categoria:', err)
            error.value = 'Error al agregar la categoría'
            if (err.response?.status === 401) {
                error.value = 'Sesión expirada o inválida'
            }
        }
    }

    onMounted(() => {
        cargarCategorias()
    })

    return {
        categorias,
        nuevaCategoria,
        error,
        cargarCategorias,
        agregarCategoria
    }
}