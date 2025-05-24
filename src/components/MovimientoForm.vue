<template>
    <form @submit.prevent='agregarMovimiento'>
        <input v-model="descripcion" type="text" placeholder="Description" required />
        <input v-model.number="monto" type="number" placeholder="Monto" required />
        <select v-model="tipo">
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
        </select>
        <button type="submit">Agregar</button>
    </form>
</template>

<script setup>
import { ref, watch } from 'vue'

// Variables del formulario
const descripcion = ref('')
const monto = ref(0)
const tipo = ref('ingreso')

// Evento al enviar el formulario
const emit = defineEmits(['nuevo-movimiento']);

//aceptar props
const props = defineProps({
    editar: Object,
    modoEdicion: Boolean
})

function agregarMovimiento() {
    if (!descripcion.value || monto.value === 0) {
        return
    }
    
    const nuevo = {
        id: Date.now(),
        descripcion: descripcion.value,
        monto: tipo.value === 'gasto' ? -Math.abs(monto.value) : Math.abs(monto.value),
        tipo: tipo.value
    }

    emit('nuevo-movimiento', nuevo)

    // Limpiar el formulario
    descripcion.value = ''
    monto.value = 0
    tipo.value = 'ingreso'
}
function enviarMovimiento() {
    if (!descripcion.value || monto.value <= 0)return

    emit('nuevo-movimiento', {
        id: props.editar?.id ?? Date.now(),
        descripcion: descripcion.value,
        monto: monto.value,
        tipo: tipo.value
    })

    // Reiniciar formulario
    descripcion.value = ''
    monto.value = 0
    tipo.value = 'ingreso'
}

//llena los datos cuando haya datos a editar
watch(() => props.editar, (nuevo) => {
      console.log("Cargando datos en el formulario:", nuevo)

    if (nuevo) {
        descripcion.value = nuevo.descripcion
        monto.value = Math.abs(nuevo.monto)
        tipo.value = nuevo.tipo
    }
})

</script>