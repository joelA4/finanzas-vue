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

// validacion de campos
const errores = ref({
  descripcion: '',
  monto: '',
  categoria_id: ''
})

const isLoading = ref(false)
const formSubmitted = ref(false)

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

//validacion de campos
watch(descripcion, (nuevoValor) => {
  if (formSubmitted.value) {
    validarDescripcion(nuevoValor)
  }
})

watch(monto, (nuevoValor) => {
  if (formSubmitted.value) {
    validarMonto(nuevoValor)
  }
})

watch(categoria_id, (nuevoValor) => {
  if (formSubmitted.value) {
    validarCategoria(nuevoValor)
  }
})

//funciones de validacion
function validarDescripcion(valor) {
  if (!valor.trim()) {
    errores.value.descripcion = 'La descripcion es obligatoria'
    return false
  }
  errores.value.descripcion = ''
  return true
}

function validarMonto(valor) {
  const montoNumerico = parseFloat(valor)
  if (!valor) {
    errores.value.monto = 'El monto es obligatorio'
    return false
  }
  if (isNaN(montoNumerico) || montoNumerico <= 0) {
    errores.value.monto = 'El monto debe ser un numero mayor que cero'
    return false
  }
  errores.value.monto = ''
  return true
}

function validarCategoria(valor) {
  if (!valor) {
    errores.value.categoria_id = 'Debes seleccionar una categoria'
    return false
  }
  errores.value.categoria_id = ''
  return true
}

async function manejarSubmit() {
  formSubmitted.value = true

  // validar todos los campos
  const descripcionValida = validarDescripcion(descripcion.value)
  const montoValido = validarMonto(monto.value)
  const categoriaValida = validarCategoria(categoria_id.value)

  //si hay algun error, no continuar
  if (!descripcionValida || !montoValido || !categoriaValida) {
    return
  }

  try {
    isLoading.value = true

    const movimiento = {
      descripcion: descripcion.value.trim(),
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
  
    // Limpiar campos y estados
    descripcion.value = ''
    monto.value = ''
    tipo.value = true
    categoria_id.value = ''
    formSubmitted.value = false
    Object.keys(errores.value).forEach(key => errores.value[key] = '')
    
  } catch (error) {
    console.error('Error al procesar el movimiento: ', error)
  } finally {
  isLoading.value = false
  }
}

</script>

<template>
  <form @submit.prevent="manejarSubmit" class="formulario">

    <div class="campo">
      <input v-model="descripcion" 
        type="text"
        placeholder="Descripción"
        :class="{ 'error': errores.descripcion}"
      />
      <span class="error-mensaje" v-if="errores.descripcion">
        {{ errores.descripcion }}
      </span>
    </div>

    <div class="campo">
      <input
        v-model="monto"
        type="number"
        placeholder="Monto"
        :class="{ 'error': errores.monto }"
      /> 
      <span class="error-mensaje" v-if="errores.monto">
        {{ errores.monto }}
      </span>
    </div>

    <!--Registrar si es gasto o ingreso-->
    <div class="campo-radio">
      <label>
        <input type="radio" v-model="tipo" :value="true"> Ingreso
      </label>
      <label>
        <input type="radio" v-model="tipo" :value="false"> gasto
      </label>    
    </div>

    <div class="campo">
      <select v-model="categoria_id" 
      :class="{ 'error': errores.categoria_id }">
        <option disabled value="">Selecciona Categoria </option>
        <option 
          v-for="cat in props.categorias" 
          :key="cat.id" 
          :value="cat.id"> {{ cat.nombre }} </option>
      </select>
      <span class="error-mensaje" v-if="errores.categoria_id">
        {{ errores.categoria_id }}
      </span>
    </div>
  
    <!-- Boton para actualizar o agregar dependiendo del estado del modoEdicion-->
    <button 
      type="submit"
      :disabled="isLoading"
      class="submit-button"
    >
      <span v-if="isLoading">Procesando...</span>
      <span v-else>
        {{ props.modoEdicion ? 'Actualizar' : 'Agregar' }} <br/> Movimiento
      </span>
    </button>
  </form>
</template>

<style scoped>
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input, select, button {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px, solid #ccc;
  border-radius: 4px;
}

.error {
  border-color: #dc3545;
}

.error-mensaje {
  color: #dc3545;
  font-size: 0.875rem;
}

.campo-radio {
  display: flex;
  gap: 1rem;
}

.submit-button {
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>
