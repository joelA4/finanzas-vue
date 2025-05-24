<template>
<form @submit.prevent = "agregarPago">
    <input v-model="descripcion" type="text" placeholder="Descripcion" required/>
    <input v-model="monto" type="number" placeholder="Monto mensual" required /> 
    <button type="submit">Agregar Pago recurrente</button>
</form>
</template>

<script setup>
import { ref } from 'vue'

const descripcion = ref('')
const monto = ref(0)

const emit = defineEmits(['nuevo-pago'])

function agregarPago() {
    if (!descripcion.value || monto.value <= 0) return

    emit('nuevo-pago', {
        id: Date.now(),
        descripcion : descripcion.value,
        monto: monto.value
    })

    descripcion.value = ''
    monto.value = 0
}
</script>