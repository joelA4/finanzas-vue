<script setup>
import { ref } from 'vue'
import RegistroUsuario from './components/RegistroUsuario.vue'
import LoginUsuario from './components/LoginUsuario.vue'
import FinanzasApp from './components/FinanzasApp.vue' //Aqui iria el App principal

const usuario = ref(null)

if (localStorage.getItem('usuario')){
  usuario.value = JSON.parse(localStorage.getItem('usuario'))
}

</script>

<template>
  <div v-if="!usuario">
    <LoginUsuario />
    <RegistroUsuario />
  </div>

  <div v-else>
    <FinanzasApp :usuario="usuario" />
  </div>
</template>