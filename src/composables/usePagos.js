import { ref } from 'vue'
import { nanoid } from 'nanoid'

export function usePagos() {
    const pagos = ref([])
    const pagoActual = ref(null)
    const modoEdicionPago = ref(false)
    
    const agregarPago = (nuevo) => {
        if (modoEdicionPago.value && pagoActual.value){
            const index = pagos.value.findIndex(p => p.id === pagoActual.value.id)
            if (index !== -1 ) pagos.value[index] = { ...nuevo }
            modoEdicionPago.value = false
            pagoActual.value = null
        } else {
            pagos.value.push({ ...nuevo, id: nanoid() })
        }
    }

    const eliminarPago = (pago) => {
        pagoActual.value = { ...pago }
        modoEdicionPago.value = true
    }

    const editarPago = (pago) => {
        pagoActual.value = { ...pago }
        modoEdicionPago.value = true
    }

    return {
        pagos, 
        agregarPago,
        eliminarPago,
        editarPago,
        pagoActual,
        modoEdicionPago
    }
}