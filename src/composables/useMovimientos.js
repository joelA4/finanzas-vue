import { ref, onMounted } from 'vue';
import axios from 'axios';
export function useMovimientos() {
    const movimientos = ref([])
    const modoEdicion = ref(false)
    const movimientoActual = ref(null)
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const API = 'http://localhost:3000/api/movimientos';

    const headers = () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`
    })
    
    const cargarMovimientos = async () => {
        try {
            const res = await axios.get(API, { headers: headers() })
            movimientos.value = res.data
        } catch (error) {
            console.error("Error al cagar movimientos:", error)
        }
    }

    const agregarMovimiento = async (nuevo) => {
        if (!usuario || !usuario.id) {
            console.error('No hay usuario logueado')
            return
        }

        if (modoEdicion.value && movimientoActual.value){
            await actualizarMovimiento(nuevo)
        } else {
            try {
                const res = await axios.post(API, { ...nuevo, usuario_id: usuario.id}, {headers: headers() })
                movimientos.value.push(res.data)
            } catch (error) {
                console.error('Error al guardar el movimiento', error)
            }
        }
    }
    
    const editarMovimiento = (mov) => {
        modoEdicion.value = true
        movimientoActual.value = { ...mov }
    }

    const eliminarMovimiento =  async (id) => {
        try {
            await axios.delete(`${API}/${id}`, {headers: headers()});
            movimientos.value = movimientos.value.filter(m => m.id !== id)
        } catch (error) {
            console.error("Error al eliminar movimiento", error);
        }
    }


    const actualizarMovimiento = async (movimiento) => {
        try {
            const res = await axios.put(`${API}/${movimiento.id}`, movimiento, {headers:headers()
            })
            const index = movimientos.value.findIndex(m => m.id === movimiento.id)
            if (index !== -1) {
                movimientos.value[index] = res.data
            }
            modoEdicion.value = false
            movimientoActual.value = null
        } catch (error) {
            console.error("Error al actualizar movimiento: ", error)
        }
    }

    // llamar autamicamente al montar
    onMounted(() => {
        cargarMovimientos()
    })

    return {
        movimientos,
        modoEdicion,
        movimientoActual,
        agregarMovimiento,
        eliminarMovimiento,
        editarMovimiento,
        actualizarMovimiento
    }
}