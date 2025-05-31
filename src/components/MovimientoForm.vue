<script setup>
import { ref, watch, onMounted } from 'vue'
import categorias from './categorias.vue'
import axios from 'axios'

const emit = defineEmits(['nuevo-movimiento'])

const descripcion = ref('')
const monto = ref('')
const tipo = ref(true) // true = ingreso and false - gasto/egreso
const categoria_id = ref('')

const props = defineProps({
  editar: Object,
  modoEdicion: Boolean,
  categorias: Array
})

// const categorias = ref([])

// Si estamos editando, llenar los campos automáticamente
watch(() => props.editar, (nuevo) => {
    if (props.modoEdicion && nuevo) {
      descripcion.value = nuevo.descripcion
      monto.value = nuevo.monto
      tipo.value = nuevo.tipo
      id.value = nuevo.id
      categoria_id.value = nuevo.categoria_id || ''
    }
  }, { immediate: true }
)

function manejarSubmit() {
  if (!descripcion.value || !monto.value) return

  const movimiento = {
    descripcion: descripcion.value,
    monto: parseFloat(monto.value),
    tipo: tipo.value,
    categoria_id: categoria_id.value
  }

  if (props.modoEdicion) {
    movimiento.id = id.value
    emit('movimimiento-actualizado', movimiento)
  } else {
    emit('nuevo-movimiento', movimiento)
  }

  onMounted(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/categorias')
      categorias.value = res.data
    } catch (error) {
      console.error("Error al cargar categorias ", error)
    }
  })

  // Limpiar campos
  descripcion.value = ''
  monto.value = ''
  tipo.value = true
  id.value = null
}
</script>

<template>
  <form @submit.prevent="manejarSubmit">
    <input v-model="descripcion" type="text" placeholder="Descripción" />
    <input v-model="monto" type="number" placeholder="Monto" />
    <!--Registrar si es gasto o ingreso-->
    <label>
      <input type="radio" v-model="tipo" :value="true"> Ingreso
    </label>
    <label>
      <input type="radio" v-model="tipo" :value="false"> gasto
    </label>
    <!-- Boton para actualizar o agregar dependiendo del estado del modoEdicion-->
    <button type="submit">
      {{ props.modoEdicion ? 'Actualizar' : 'Agregar' }} <br/> Movimiento
    </button>
    <select v-model="categoria_id">
      <option disabled value="">Selecciona Categoria </option>
      <option v-for="cat in props.categorias" :key="cat.id" value="cat.id">{{ cat.nombre }} </option>
    </select>

  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
input, button {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
