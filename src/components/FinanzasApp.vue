<script setup>
import MovimientoForm from './MovimientoForm.vue'
import { useMovimientos } from '../composables/useMovimientos.js'
import PagoForm from './PagoForm.vue'
import { usePagos } from '../composables/usePagos.js'
import Categorias from './categorias.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Props
const props = defineProps({
  usuario: {
    type: Object,
    required: true
  }
})

//Sección de categorías 
const categoriasLista = ref([])
const cargandoCategorias = ref(true)
const errorCategorias = ref(null)

const obtenerCategorias = async () => {
  try {
    errorCategorias.value = null
    const res = await axios.get('http://localhost:3000/api/categorias')
    categoriasLista.value = res.data
  } catch (error) {
    console.error('Error al cargar categorias: ', error)
    errorCategorias.value = 'Error al cargar las categorías'
  } finally {
    cargandoCategorias.value = false
  }
}

onMounted(() => {
  obtenerCategorias()
})

// Composable de movimientos
const {
    movimientos,
    modoEdicion,
    movimientoActual,
    agregarMovimiento,
    eliminarMovimiento,
    editarMovimiento,
    actualizarMovimiento
} = useMovimientos()

// Composable de pagos
const {
    pagos, 
    agregarPago,
    eliminarPago,
    editarPago,
    pagoActual,
    modoEdicionPago
} = usePagos()
</script>

<template>
  <main class="finanzas-app">
    <header class="app-header">
      <h1>¡Hola, {{ props.usuario.nombre }}! 👋</h1>
      <h2>Bienvenido a tu app de Finanzas</h2>
    </header>

    <section class="movimientos-section">
      <h3>Movimientos</h3>
      <MovimientoForm
        :editar="movimientoActual"
        :modo-edicion="modoEdicion"
        :categorias="categoriasLista"
        @nuevo-movimiento="agregarMovimiento"
        @movimiento-actualizado="actualizarMovimiento"
      />

      <div v-if="movimientos.length === 0" class="empty-state">
        No hay movimientos registrados
      </div>

      <ul v-else class="movimientos-lista">
        <li v-for="m in movimientos" :key="m.id" :class="{ 'ingreso': m.tipo, 'gasto': !m.tipo }">
          <div class="movimiento-info">
            <strong>{{ m.descripcion }}</strong>
            <span class="monto">${{ m.monto }}</span>
          </div>
          <div class="movimiento-detalles">
            <span class="tipo">{{ m.tipo ? 'Ingreso' : 'Gasto' }}</span>
            <span class="categoria">{{ m.categoria_nombre || 'Sin categoría' }}</span>
            <span class="fecha">{{ new Date(m.fecha).toLocaleDateString() }}</span>
          </div>
          <div class="movimiento-acciones">
            <button @click="editarMovimiento(m)" class="btn-editar">
              Editar
            </button>
            <button @click="eliminarMovimiento(m.id)" class="btn-eliminar">
              Eliminar
            </button>
          </div>
        </li>
      </ul>
    </section>

    <section class="categorias-section">
      <h3>Categorías</h3>
      <div v-if="cargandoCategorias" class="loading">
        Cargando categorías...
      </div>
      <div v-else-if="errorCategorias" class="error">
        <Categorias />
        {{ errorCategorias }}

      </div>
      <Categorias v-else />
    </section>

    <section class="pagos-section">
      <h3>Pagos Mensuales Recurrentes</h3>
      <PagoForm 
        :editar="pagoActual"
        :modo-edicion="modoEdicionPago"
        @nuevo-pago="agregarPago"
      />

      <div v-if="pagos.length === 0" class="empty-state">
        No hay pagos recurrentes registrados
      </div>

      <ul v-else class="pagos-lista">
        <li v-for="p in pagos" :key="p.id">
          <div class="pago-info">
            <strong>{{ p.descripcion }}</strong>
            <span class="monto">${{ p.monto }}</span>
          </div>
          <div class="pago-detalles">
            Día de pago: {{ p.diaDePago }}
          </div>
          <div class="pago-acciones">
            <button @click="editarPago(p)" class="btn-editar">
              Editar
            </button>
            <button @click="eliminarPago(p.id)" class="btn-eliminar">
              Eliminar
            </button>
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.finanzas-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.app-header h2 {
  color: #666;
  font-weight: normal;
}

section {
  margin-bottom: 3rem;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.movimientos-lista, .pagos-lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.movimiento-info, .pago-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.movimiento-detalles, .pago-detalles {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.movimiento-detalles span {
  margin-right: 1rem;
}

.movimiento-acciones, .pago-acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-editar, .btn-eliminar {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-editar {
  background-color: #4CAF50;
  color: white;
}

.btn-editar:hover {
  background-color: #45a049;
}

.btn-eliminar {
  background-color: #dc3545;
  color: white;
}

.btn-eliminar:hover {
  background-color: #c82333;
}

.ingreso {
  border-left: 4px solid #4CAF50;
}

.gasto {
  border-left: 4px solid #dc3545;
}

.monto {
  font-weight: bold;
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.error {
  color: #dc3545;
  text-align: center;
  padding: 1rem;
  background: #ffebee;
  border-radius: 4px;
}
</style>
