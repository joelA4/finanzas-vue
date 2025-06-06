<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const nombreusuario = ref('')
const password = ref('')
const mensaje = ref('')
const exito = ref(false)
const cargando = ref(false)

const { iniciarSesion, error: authError } = useAuth()

const loginUsuario = async () => {
    if (!nombreusuario.value || !password.value) {
        mensaje.value = 'Por favor, complete todos los campos'
        exito.value = false
        return
    }

    try {
        cargando.value = true
        mensaje.value = ''
        
        const resultado = await iniciarSesion({
            identificador: nombreusuario.value,
            password: password.value
        })

        if (resultado) {
            exito.value = true
            mensaje.value = '¡Inicio de sesión exitoso!'
            nombreusuario.value = ''
            password.value = ''
        } else {
            exito.value = false
            mensaje.value = authError.value || 'Error al iniciar sesión'
        }
    } catch (error) {
        console.error('Error en login:', error)
        exito.value = false
        mensaje.value = 'Error inesperado al iniciar sesión'
    } finally {
        cargando.value = false
    }
}
</script>

<template> 
    <div class="login-container">
        <h2>Inicio de sesión</h2>
        <form @submit.prevent="loginUsuario" class="login-form">
            <div class="form-group">
                <input 
                    v-model="nombreusuario" 
                    placeholder="Nombre de usuario" 
                    required 
                    class="form-input"
                    :disabled="cargando"
                />
            </div>
            <div class="form-group">
                <input 
                    v-model="password" 
                    type="password" 
                    placeholder="Contraseña" 
                    required 
                    class="form-input"
                    :disabled="cargando"
                />
            </div>
            <button 
                type="submit" 
                class="login-button"
                :disabled="cargando"
            >
                <span v-if="cargando">Iniciando sesión...</span>
                <span v-else>Iniciar sesión</span>
            </button>
        </form>
        <p v-if="mensaje" :class="{ 'success': exito, 'error': !exito }" class="mensaje">
            {{ mensaje }}
        </p>
    </div>
</template>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: rgb(46, 46, 43);
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

.form-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.login-button {
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
}

.login-button:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
}

.login-button:not(:disabled):hover {
    background-color: #45a049;
}

.mensaje {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 4px;
    text-align: center;
}

.success {
    color: #4CAF50;
    background-color: #e8f5e9;
}

.error {
    color: #f44336;
    background-color: #ffebee;
}
</style>