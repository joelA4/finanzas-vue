<template>
  <h1>Hello, joel bienvenido de vuelta </h1> <!-- futuro agregar un login y de ahi que el nombre de usuario sea reactivo --> 
  <p>Un progrma para la administracion de finanzas</p>

  <!-- Ingresos y gastos-->
  <!-- <MovimientoForm @nuevo-movimiento="agregarMovimiento" /> -->
  <!--Pasar props-->
  <MovimientoForm
  :editar="movimientoActual"
  :modo-edicion ="modoEdicion"
  @nuevo-movimiento="agregarMovimiento"
  />

  <ul>
    <li v-for="m in movimientos" :key="m.id">
      {{ m.descripcion }} - {{ m.monto }} USD ({{ m.tipo }})
    </li>
  </ul>
  <p><strong>Total: </strong> {{ total }} USD </p>

  <!--botones de eliminar y editar movimientos -->
  <ul>
    <li v-for="m in movimientos" :key="m.id" >
      {{ m.descripcion }} - {{ m.monto }} USD ({{ m.tipo }})
      <button @click="eliminarMovimiento(m.id)">🗑️</button>
      <button @click="editarMovimiento(m)">✏️</button>
    </li>
  </ul>

  <!-- Pagos mensuales recurrentes -->
  <h2>Pagos menusales recurrentes</h2>
  <PagoRecurrenteForm @nuevo-pago = "agregarPagoMensual" />
  <ul>
    <li v-for="p in pagosMensuales" :key="p.id">
      {{ p.descripcion }} - {{ p.monto }} USD/mes
    </li>
  </ul>

  <!--RESUMEN-->
  <p><strong>Total movimientos: </strong>{{ total }} USD </p>
  <p><strong>Total de pagos mensuales: </strong>{{ totalMensual }} USD </p>
  <p><strong>Balamce semanal estimado: </strong>{{ balanceSemanal }} USD </p>

</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import MovimientoForm from './components/MovimientoForm.vue'
  import PagorecurrenteForm from './components/PagoRecurrenteForm.vue'

  // const movimientos = ref([]) // Con estas lineas los datos se guardan en la pagina
  // const pagosMensuales = ref([]) // pero al recargar estos se eliminan

  //Cargar los datos guardados en localStorage (si existen) y los convierte en listas reactivas
  // 'movimientos' representa los gsatos registrados, y 'pagos mensuales' los pagos fijos mensuales
  const movimientos = ref(JSON.parse(localStorage.getItem('movimientos')) || [])
  const pagosMensuales = ref(JSON.parse(localStorage.getItem('pagosMensuales')) || [])

  //variables para manejar el formulario del 'modo edicion'
  const modoEdicion = ref(false)
  const movimientoActual = ref(null)


  function agregarMovimiento(nuevo){
    if (modoEdicion.value && movimientoActual.value) {
      const index = movimientos.value.findIndex(m => m.id === movimientoActual.value.id)
      if (index !== -1) {
        movimientos.value[index] = { ...nuevo, id: movimientoActual.value.id }
      }
      modoEdicion.value = false
      movimientoActual.value = null
    } else {
      movimientos.value.push(nuevo)
    }
  }
  function agregarPagoMensual(nuevo) {
    pagosMensuales.value.push(nuevo)
  }

  const total = computed(() => { 
    return movimientos.value.reduce((acc, m) => acc + m.monto, 0)
  })
  const totalMensual = computed(() =>{
    return pagosMensuales.value.reduce((acc, p) => acc + p.monto, 0)
  })

  //asumiendo 4 semanas al mes para calcular el impacto semanal
  const balanceSemanal = computed(() =>
    total.value - totalMensual.value / 4
  )

  //
  watch(movimientos, (nuevos) => {
    localStorage.setItem('movimientos', JSON.stringify(nuevos))
  }, { deep: true})
  
  watch(pagosMensuales, (nuevos) => {
    localStorage.setItem('pagosMensuales', JSON.stringify(nuevos))
  }, { deep: true})

  function eliminarMovimiento(id) {
    movimientos.value = movimientos.value.filter(m => m.id !== id)
  }
  function editarMovimiento(movimiento) {
    movimientoActual.value = { ...movimiento} 
    modoEdicion.value = true
  }


</script>
