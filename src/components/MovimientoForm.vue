<script setup>
import { ref, watch, onMounted, computed} from 'vue'
import { useMovimientos } from '../composables/useMovimientos'
import axios from 'axios'

const emit = defineEmits(['nuevo-movimiento', 'movimiento-actualizado'])

const descripcion = ref('')
const monto = ref('')
const tipo = ref(true) // true = ingreso and false - gasto/egreso
const categoria_id = ref('')
const fecha = ref(new Date().toISOString().split('T')[0])

const props = defineProps({
  editar: Object,
  modoEdicion: Boolean,
  categorias: {
    type: Array,
    default: () => []
  }
})

// estados del formulario
const errores = ref({
  descripcion: '',
  monto: '',
  categoria_id: '',
  fecha: ''
})

const isLoading = ref(false)
const formSubmitted = ref(false)

const formValido = computed(() => {
  return !Object.values(errores.value).some(error => error !== '') && 
  descripcion.value &&
  monto.value &&
  categoria_id.value && 
  fecha.value
})

// Llenar el formulario si estamos editando
watch(() => props.editar, (nuevo) => {
    if (props.modoEdicion && nuevo) {
      descripcion.value = nuevo.descripcion
      monto.value = nuevo.monto
      tipo.value = nuevo.tipo
      categoria_id.value = nuevo.categoria_id || ''
      fecha.value = nuevo.fecha.split('T')[0]
    }
  }, { immediate: true })

//validacion en tiempo real
watch(descripcion, (nuevoValor) =>  validarDescripcion(nuevoValor))
watch(monto, (nuevoValor) => validarMonto(nuevoValor))
watch(categoria_id, (nuevoValor) =>validarCategoria(nuevoValor))
watch(fecha, (nuevoValor) => vaidarFecha(nuevoValor))

// Funciones de validacion
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

function validarFecha(valor) {
  if (!valor) {
    errores.value.fecha = 'La fecha es obligatoria'
    return false
  }
  const fechaSeleccionada = new Date(valor)
  if (isNaN(fechaSeleccionada.getDate())) {
    errores.value.fecha = 'Fecha Invalida'
    return false
  }
  errores.value.fecha = ''
  return true
}

async function manejarSubmit() {
  formSubmitted.value = true

  // validar todos los campos
  const descripcionValida = validarDescripcion(descripcion.value)
  const montoValido = validarMonto(monto.value)
  const categoriaValida = validarCategoria(categoria_id.value)
  const fechaValida = validarFecha(fecha.value)

  //si hay algun error, no continuar
  if (!descripcionValida || !montoValido || !categoriaValida || !fecha) {
    return
  }

  try {
    isLoading.value = true

    const movimiento = {
      descripcion: descripcion.value.trim(),
      monto: parseFloat(monto.value),
      tipo: tipo.value,
      categoria_id: categoria_id.value,
      fecha: fecha.value
    }

    if (props.modoEdicion) {
      movimiento.id = id.value
      emit('movimiento-actualizado', movimiento)
    } else {
      emit('nuevo-movimiento', movimiento)
    }
  
    //Limpiar formulario
    resetearFormulario()
  } catch (error) {
    console.error('Error al procesar el movimiento: ', error)
  } finally {
    isLoading.value = false
  }
}

function resetearFormulario() {
  descripcion.value = ''
  monto.value = ''
  tipo.value = true
  categoria_id.value = ''
  fecha.value = new Date().toISOString().split('T')[0]
  formSubmitted.value = false
  Object.keys(errores.value).forEach(key => errores.value[key] = '')
}
</script>

<template>
  <form @submit.prevent="manejarSubmit" class="formulario" :class="{ 'loading' : isLoading }">

    <div class="campo">
      <label for="descripcion">Descripcion</label>
      <input 
        id="descripcion"
        v-model="descripcion" 
        type="text"
        placeholder="Descripción del movimiento"
        :class="{ 'error': errores.descripcion }"
        :disabled="isLoading"
      />
      <span class="error-mensaje" v-if="errores.descripcion">
        {{ errores.descripcion }}
      </span>
    </div>

    <div class="campo">
      <label for="monto">Monto</label>
      <input
        id="monto"
        v-model="monto"
        type="number"
        step="0.01"
        placeholder="0.00"
        :class="{ 'error': errores.monto }"
        :disabled="isLoading"
      /> 
      <span class="error-mensaje" v-if="errores.monto">
        {{ errores.monto }}
      </span>
    </div>

    <div class="campo">
      <label for="fecha">Fecha</label>
      <input 
      id="fecha"
      v-model="fecha"
      type="date"
      :class="{ 'error': errores.fecha }"
      :disabled="isLoading"
      >
      <span class="errores-mensaje" v-if="errores.fecha">
        {{ errores.fecha }}
      </span>
    </div>

    <div class="campo-radio">
      <label class="radio-label">
        <input
        type="radio"
        v-model="tipo"
        :value="true"
        :disabled="isLoading"
        >
        <span class="radio-text ingreso">Ingreso</span> 
      </label>
      <label class="radio-label">
        <input 
        type="radio"
        v-model="tipo"
        :value="false"
        :disabled="isLoading"
        >
        <span class="radio-text gasto">Gasto</span>
      </label>    
    </div>

    <div class="campo">
      <label for="categoria">Categoria</label>
      <select
        id="categoria" 
        v-model="categoria_id" 
        :class="{ 'error': errores.categoria_id }"
        :disabled="isLoading"
        >
        <option disabled value="">Selecciona Categoria</option>
        <option 
          v-for="cat in props.categorias" 
          :key="cat.id" 
          :value="cat.id"
          >
            {{ cat.nombre }} 
          </option>
      </select>
      <span class="error-mensaje" v-if="errores.categoria_id">
        {{ errores.categoria_id }}
      </span>
    </div>
  
    <button 
      type="submit"
      :disabled="isLoading || !formValido"
      class="submit-button"
      :class="{ 'disabled': !formValido }"
    >
      <span v-if="isLoading" class="loading-text">
        <span class="dots">...</span>
        Procesando
      </span>
      <span v-else>
        {{ props.modoEdicion ? 'Actualizar' : 'Agregar' }} Movimiento
      </span>
    </button>
  </form>
</template>

<style scoped>
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #2c2c2c;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
  opacity: 0.7;
  pointer-events: none;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #0e0e0e;
  font-size: 0.9rem;
}

input, select {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #444;
  background-color: #1c1c1c;
  color: #0e0e0e;
  border-radius: 4px;
  transition: all 0.2s;
}

input:focus, select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
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
  gap: 2rem;
  padding: 0.5rem 0;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.radio-text {
  font-size: 1rem;
}

.ingreso {
  color: #4CAF50;
}

.gasto {
  color: #dc3545;
}

.error-mensaje {
  color: #dc3545;
  font-size: 0.875rem;
}


.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button.disabled {
  background-color: #666;
  cursor: not-allowed;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.dots {
  animation: dots 1.4s infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60% { content: '...'; }
  80%, 100% { content: ''; }
}

@media (max-width: 768px) {
  .formulario {
    padding: 1rem;
  }

  .campo-radio {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
