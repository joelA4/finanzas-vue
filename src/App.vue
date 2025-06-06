<script setup>
import { watch } from 'vue'
import RegistroUsuario from './components/RegistroUsuario.vue'
import LoginUsuario from './components/LoginUsuario.vue'
import FinanzasApp from './components/FinanzasApp.vue'
import { useAuth } from './composables/useAuth'

const { usuario, cargando, cerrarSesion } = useAuth()

// Observar cambios en el usuario para debugging
watch(usuario, (nuevoValor) => {
  console.log('Estado de usuario actualizado:', nuevoValor)
})

function handleCerrarSesion() {
  cerrarSesion()
}
</script>

<template>
  <div class="app-container">
    <div v-if="cargando" class="loading">
      <div class="loading-spinner"></div>
      <p>Cargando...</p>
    </div>
    
    <div v-else>
      <div v-if="!usuario">
        <LoginUsuario />
        <RegistroUsuario />
      </div>

      <div v-else>
        <div class="header">
          <span class="welcome-text">Bienvenido, {{ usuario.nombreusuario }}</span>
          <button @click="handleCerrarSesion" class="logout-button">
            Cerrar Sesión
          </button>
        </div>
        <FinanzasApp :usuario="usuario" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  padding: 1rem;
  min-height: 100vh;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  margin-bottom: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-text {
  font-size: 1.1rem;
  color: #333;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>