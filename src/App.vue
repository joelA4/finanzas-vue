<script setup>
import { ref, watch, onMounted } from 'vue'
import RegistroUsuario from './components/RegistroUsuario.vue'
import LoginUsuario from './components/LoginUsuario.vue'
import FinanzasApp from './components/FinanzasApp.vue'
import { useAuth } from './composables/useAuth'

const { usuario, cargando, error, cerrarSesion, verificarAuth } = useAuth()

// Verificar autenticacion al montar componentes
onMounted(async () => {
  try {
    await verificarAuth()
  } catch (erro) {
    mensajeError.value = 'Error al verificar la autentificacion'
    mostrarError.value = true
  }
})

// Observar cambios en el usuario para debugging y manejo de errores
watch(usuario, (nuevoValor) => {
  console.log('Estado de usuario actualizado:', nuevoValor)
})
watch(error, (nuevoError) => {
  if (nuevoError) {
    mensajeError.value = nuevoError
    mostrarError.value = true
    setTimeout(() => {
      mostrarError.value = false
      mensajeError.value = ''
    }), 500
  }
})

async function handleCerrarSesion() {
  try {
    await cerrarSesion()
  } catch (err) {
    mensajeError.value = 'Error al iniciar sesion'
    mostrarError.value = error
  }
}
</script>

<template>
  <div class="app-container">
    <!-- Mensaje se error global -->
  <div v-if="mostrarError" class="error-mensaje">
    {{ mensajeError }}
    <button @click="mostrarError = false" class="cerrar-error" >&times;</button>
  </div>

     <!-- Indicador de carga -->
    <div v-if="cargando" class="loading">
      <div class="loading-spinner"></div>
      <p>Cargando...</p>
    </div>
    
    <div v-else>
      <!-- Pantalla de autenticacion -->
      <div v-if="!usuario" class="auth-container">
        <div class="auth-tabs">
          <LoginUsuario />
          <RegistroUsuario />
        </div>
      </div>

      <!-- Aplicacion principal -->
      <div v-else>
        <div class="header">
          <div class="user-info">
            <span class="welcome-text">Bienvenido, {{ usuario.nombreusuario }}</span>
            <span class="user-email"> {{ usuario.email }}</span>
          </div>
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
  position: relative;
}

.error-mensaje {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #dc3545;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 100;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: rotateX(0);
    opacity: 1;
  }
}

.cerrar-error {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
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

.auth-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #2c2c2c;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #2c2c2c;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.welcome-text {
  font-size: 1.2rem;
  color: #e0e0e0;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.9rem;
  color: #888;
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

@media (max-width: 768px) {
  .auth-tabs {
    grid-template-columns: 1fr;
  }
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
