import { formToJSON, onMounted, ref } from 'vue'
import axios from 'axios'

export function useCategorias(){
    const categorias = ref([])
    const nuevaCategoria = ref ('')
    const API = 'http://localhost:3000/api/categorias'

    const headers = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`
    })

    const cargarCategorias = async () => {
        try {
            const res = await axios.get(API, { headers: headers() })
            categorias.value = res.data
        } catch (error) {
            console.error('Error al cargaar categorias: ', error)
        }
    }

    const agregarCategoria = async () => {
        if (!nuevaCategoria.value.trim()) return
        try {
            const res = await axios.post(API, {nombre: nuevaCategoria.value }, { headers: headers() })
            categorias.value.push(res.data)
            nuevaCategoria.value = ''
        } catch (error) {
            console.error('Error al agregar categoria: ', error)
        }
    }

    onMounted(() => {
        cargarCategorias()
    })

    return {
        categorias,
        nuevaCategoria,
        cargarCategorias,
        agregarCategoria
    }
}