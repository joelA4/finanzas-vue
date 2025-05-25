<script setup>
import { ref, watch } from 'vue'
import { nanoid } from 'nanoid'

const props = defineProps({
  editar: Object,
  modoEdicion: Boolean
})

const emit = defineEmits(['nuevo-movimiento'])

const descripcion = ref('')
const monto = ref('')

// Si estamos editando, llenar los campos automáticamente
watch(
  () => props.editar,
  (nuevo) => {
    if (props.modoEdicion && nuevo) {
      descripcion.value = nuevo.descripcion
      monto.value = nuevo.monto
    }
  },
  { immediate: true }
)

function manejarSubmit() {
  if (!descripcion.value || !monto.value) return

  const movimiento = {
    id: props.modoEdicion && props.editar ? props.editar.id : nanoid(),
    descripcion: descripcion.value,
    monto: parseFloat(monto.value)
  }

  emit('nuevo-movimiento', movimiento)

  // Limpiar campos
  descripcion.value = ''
  monto.value = ''
}
</script>

<template>
  <form @submit.prevent="manejarSubmit">
    <input v-model="descripcion" type="text" placeholder="Descripción" />
    <input v-model="monto" type="number" placeholder="Monto" />
    <button type="submit">
      {{ props.modoEdicion ? 'Actualizar' : 'Agregar' }} Movimiento
    </button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
input, button {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
