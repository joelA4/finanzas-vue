import { ref, VueElement } from "vue";

export function useMovimientos() {
    const movimientos = ref([])
    const modoEdicion = ref(false)
    const movimientoActual = ref(null)
    
}