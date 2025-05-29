import { ref } from 'vue';
import axios from 'axios';
export function useMovimientos() {
    const movimientos = ref([])
    const modoEdicion = ref(false)
    const movimientoActual = ref(null)
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const agregarMovimiento = async (nuevo) => {
        const usuario = JSON.parse(localStorage.getItem('usuario0'))
        if (!usuario || !usuario.id) {
            console.error('No hay usuario logueado')
            return
        }

        if (modoEdicion.value && movimientoActual.value){
                //EDITAR EL MOVIMIENTO EN EL BACKEND
            const index = movimientos.value.findIndex(m => m.id === movimientoActual.value.id)
            
            if (index !== -1){
                movimientos.value[index] = { ...nuevo }
            }
            modoEdicion.value = false
            movimientoActual.value = null
        } else {
            try {
                const res = await axios.post('http:/localhost:3000/api/movimientos',{
                    ...nuevo,
                    usuario_id: usuario.id
                })
                movimientos.value.push(res.data)
            } catch (error) {
                console.error('Error al guardar movimiento', error)
            }
        }
    }

    const eliminarMovimiento = (id) => {
        movimientos.value = movimientos.value.filter(m => m.id !== id)
    }
    const editarMovimiento = (mov) => {
        movimientoActual.value = { ...mov }
        modoEdicion.value = true
    }

    return {
        movimientos,
        modoEdicion,
        movimientoActual,
        agregarMovimiento,
        eliminarMovimiento,
        editarMovimiento
    }
}