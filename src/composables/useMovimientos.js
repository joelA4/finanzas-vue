import { ref } from 'vue';

export function useMovimientos() {
    const movimientos = ref([])
    const modoEdicion = ref(false)
    const movimientoActual = ref(null)

    const agregarMovimiento = (nuevo) => {
        if (modoEdicion.value && movimientoActual.value) {
            const index = movimientos.value.findIndex(m => m.id === movimientoActual.value.id)
            if (index !== -1)  {
                movimientos.value[index] = { ...nuevo }
            }
            modoEdicion.value = false
            movimientoActual.value = null
        } else {
            movimientos.value.push(nuevo)
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