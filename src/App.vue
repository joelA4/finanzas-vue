<script setup>
import MovimientoForm from './components/MovimientoForm.vue'
import { useMovimientos } from './composables/useMovimientos.js'

// Composable que encapsula la lógica
const {
  movimientos,
  modoEdicion,
  movimientoActual,
  agregarMovimiento,
  eliminarMovimiento,
  editarMovimiento
} = useMovimientos()
</script>

<template>
  <main>
    <h1>Finanzas Semanales</h1>

    <MovimientoForm
      :editar="movimientoActual"
      :modo-edicion="modoEdicion"
      @nuevo-movimiento="agregarMovimiento"
    />

    <ul>
      <li v-for="m in movimientos" :key="m.id">
        {{ m.descripcion }} - ${{ m.monto }}
        <button @click="editarMovimiento(m)">Editar</button>
        <button @click="eliminarMovimiento(m.id)">Eliminar</button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
main {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #5b5b5b;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
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
