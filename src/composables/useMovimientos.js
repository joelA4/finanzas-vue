import { ref, onMounted } from 'vue';
import axios from 'axios';
export function useMovimientos() {
    const movimientos = ref([])
    const modoEdicion = ref(false)
    const movimientoActual = ref(null)
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const API = 'http://localhost:3000/api/movimientos';

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
    
    const editarMovimiento = async (mov) => {
        try {
            await axios.put(`%{API}/${mov.id}`, mov)
            await cargarMovimientos();
        } catch (error) {
            console.error("Error al editar movimiento", error);
        }
    }

    const eliminarMovimiento =  async (id) => {
        try {
            await axios.delete(`${API}/$mov.id`);
            await cargarMovimientos(); // Vuelve a cargar desde el backend
        } catch (error) {
            console.error("Error al eliminar movimiento", error);
        }
    }

    const cargarMovimientos = async () => {
        try {
            const res = await axios.get(API)
            movimientos.value = res.data
        } catch (error) {
            console.error("Error al cagar movimientos:", error)
        }
    }

    const actualizarMovimiento = async (movimiento) => {
        try {
            await axios.put(`${API}/${movimientoEditado.id}`, movimientoEditado)
            modoEdicion.value = false
            movimientoActual.value = null
            await cargarMovimientos()
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