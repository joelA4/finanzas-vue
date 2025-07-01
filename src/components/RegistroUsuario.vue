<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

const { registrar, error: authError, usuario } = useAuth()

const nombre = ref('')
const email = ref('')
const nombreusuario = ref('')
const password = ref('')
const isLoading = ref(false)
const mensaje = ref({ texto: '', tipo: '' })

// Observar cambios en el usuario para redirección automática
watch(usuario, (nuevoUsuario) => {
    if (nuevoUsuario) {
        // Usuario registrado y autenticado exitosamente
        mensaje.value = {
            texto: '¡Usuario registrado exitosamente! Redirigiendo...',
            tipo: 'success'
        }
        // Limpiar el formulario
        nombre.value = ''
        email.value = ''
        nombreusuario.value = ''
        password.value = ''
        isLoading.value = false
    }
})

const registrarUsuario = async () => {
    if (!nombre.value || !email.value || !nombreusuario.value || !password.value) {
        mensaje.value = {
            texto: 'Por favor, completa todos los campos',
            tipo: 'error'
        }
        return
    }

    isLoading.value = true
    mensaje.value = { texto: '', tipo: '' }

    try {
        const resultado = await registrar({
            nombre: nombre.value,
            email: email.value,
            nombreusuario: nombreusuario.value,
            password: password.value
        })
        
        if (!resultado) {
            mensaje.value = {
                texto: authError.value || 'Error al registrar usuario',
                tipo: 'error'
            }
            isLoading.value = false
        }
    } catch (err) {
        mensaje.value = {
            texto: authError.value || 'Error al registrar usuario',
            tipo: 'error'
        }
        isLoading.value = false
    }
}
</script>

<template>
    <div class="registro-container">
        <h2>Registro de Usuario</h2>
        <form @submit.prevent="registrarUsuario" class="registro-form">
            <div class="form-group">
                <label for="nombre">Nombre completo</label>
                <input 
                    id="nombre"
                    v-model="nombre" 
                    type="text"
                    placeholder="Tu nombre completo" 
                    :disabled="isLoading"
                    required
                />
            </div>

            <div class="form-group">
                <label for="email">Correo electrónico</label>
                <input 
                    id="email"
                    v-model="email" 
                    type="email" 
                    placeholder="ejemplo@correo.com" 
                    :disabled="isLoading"
                    required 
                />
            </div>

            <div class="form-group">
                <label for="nombreusuario">Nombre de usuario</label>
                <input 
                    id="nombreusuario"
                    v-model="nombreusuario" 
                    type="text"
                    placeholder="Tu nombre de usuario" 
                    :disabled="isLoading"
                    required 
                />
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input 
                    id="password"
                    v-model="password" 
                    type="password" 
                    placeholder="Tu contraseña" 
                    :disabled="isLoading"
                    required 
                />
            </div>

            <!-- Mensaje de feedback -->
            <div
                v-if="mensaje.texto"
                class="mensaje"
                :class="mensaje.tipo"
            >
                {{ mensaje.texto }}
            </div>

            <button 
                type="submit" 
                :disabled="isLoading"
                :class="{ 'loading': isLoading }"
            >
                {{ isLoading ? 'Registrando...' : 'Registrarse' }}
            </button>
        </form>
    </div>
</template>

<style scoped>
.registro-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: #2c2c2c;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #e0e0e0;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
}

.registro-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    color: #e0e0e0;
    font-size: 0.9rem;
}

input {
    padding: 0.75rem;
    border: 1px solid #444;
    background: #1c1c1c;
    color: #e0e0e0;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.2s;
}

input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.mensaje {
    padding: 1rem;
    border-radius: 4px;
    text-align: center;
    animation: fadeIn 0.3s ease-out;
}

.mensaje.success {
    background: #4CAF50;
    color: white;
}

.mensaje.error {
    background: #dc3545;
    color: white;
}

button {
    padding: 0.75rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover:not(:disabled) {
    background: #45a049;
}

button:disabled {
    background: #666;
    cursor: not-allowed;
}

button.loading {
    position: relative;
    color: transparent;
}

button.loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    margin: -8px 0 0 -8px;
    border: 2px solid transparent;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>