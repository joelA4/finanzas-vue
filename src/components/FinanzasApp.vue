<script setup>
import MovimientoForm from './MovimientoForm.vue'
import { useMovimientos } from '../composables/useMovimientos.js'

import PagoForm from './PagoForm.vue'
import { usePagos } from '../composables/usePagos.js'

import categorias from './categorias.vue'

//Seccion de categorias 
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categoriasLista = ref([])

const obtenerCategorias = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/categorias', { 
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    categoriasLista.value = res.data
  } catch (error) {
    console.error('Error al cargar categorias: ', error)
  }
}

onMounted(() =>{
  obtenerCategorias()
})

// Composable que encapsula la lógica
const {
    movimientos,
    modoEdicion,
    movimientoActual,
    agregarMovimiento,
    eliminarMovimiento,
    editarMovimiento
} = useMovimientos()

const {
    pagos, 
    agregarPago,
    eliminarPago,
    editarPago,
    pagoActual,
    modoEdicionPago
} = usePagos()

const cerrarSesion = () => {
    localStorage.removeItem('usuario')
    window.location.reload()
}

</script>

<template>
    <main>
        <button @click="cerrarSesion">Cerrar sesion</button>
        <h1>Hola, Joel <!--agregar nombre de usuario--> a tu app de FinanzasApp</h1>

    <MovimientoForm
      :editar="movimientoActual"
      :modo-edicion="modoEdicion"
      :categorias="categoriasLista"
      @nuevo-movimiento="agregarMovimiento"
      @movimiento-actualizado="actualizarMovimiento"
    />


    <ul>
      <li v-for="m in movimientos" :key="m.id">
        <strong>{{ m.descripcion }}</strong> -${{ m.monto }}
        <br />
        <small>
          {{ m.tipo ? 'Ingreso' : 'Gasto' }} |
          Categoria: {{ m.categoria_nombre || 'sin categoria' }} |
          Fecha: {{ new Date(m.fecha).toDateString() }}
        </small>
        <br />
        
        <button @click="editarMovimiento(m)">Editar</button>
        <button @click="eliminarMovimiento(m.id)">Eliminar</button>
      </li>
    </ul>

    <!--Seccion de Categorias-->
    <categorias />

    <h2>pagos Mensuales Recurrentes</h2>
    <pagoForm 
      :editar = "pagoActual"
      :modo-edicion = "modoEdicionPago"
      @nuevo-pago="agregarPago"
    />

    <ul>
      <li v-for="p in pagos" :key="p.id">
        {{ p.descripcion }} - ${{ p.monto }} (cada {{ p.diaDePago }} de cada mes)
        <button @click="editarPago(p)">Editar</button>
        <button @click="eliminarPago(p.id)">Eliminar</button>
      </li>
    </ul>
    <RegistroUsuario />
  </main>
</template>

<style scoped>
main {
  max-width: 700px;
  margin: auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #727272;
}
h2 {
  text-align: center;
  font-size: 2rem;
  color: #5c5c5c;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #5b5b5b;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
