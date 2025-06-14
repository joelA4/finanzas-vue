<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login, error: authError } = useAuth()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const mensaje = ref({ texto: '', tipo: '' })

const validaciones = computed(() => ({
    email: {
        valido: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value),
        mensaje: 'Ingresa un correo electrónico válido'
    },
    password: {
        valido: password.value.length >= 6,
        mensaje: 'La contraseña debe tener al menos 6 caracteres'
    }
}))

const formValido = computed(() => 
Object.values(validaciones.value).every(v => v.valido)
)

async function handleSubmit() {
    if (!formValido.value) {
        mensaje.value = {
            texto: 'Por favor, corrige los errores en el formulario',
            tipo: 'error'
        }
        return
    }

    isLoading.value = true
    mensaje.value = { texto: '', tipo: '' }

    try {
        await login(email.value, password.value)
        mensaje.value = {
            texto: '¡Inicio de sesión exitoso!',
            tipo: 'success'
        }
    } catch (err) {
        mensaje.value = {
            texto: authError.value || 'Error al iniciar sesión',
            tipo: 'error'
        }
    } finally {
        isLoading.value = false
    }
}

function togglePassword() {
    showPassword.value = !showPassword.value
}
</script>

<template>
    <div class="login-container">
        <h2>Iniciar Sesión</h2>
        
        <form @submit.prevent="handleSubmit" class="login-form">
            <!-- Email -->
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input 
                    id="email"
                    v-model="email"
                    type="email"
                    :class="{ 'error': !validaciones.email.valido && email }"
                    :disabled="isLoading"
                    autocomplete="email"
                    placeholder="ejemplo@correo.com" 
                />
                <span
                    v-if="!validaciones.email.valido && email"
                    class="error-message"
                >
                    {{ validaciones.email.mensaje }}
                </span>
            </div>

            <!-- Password -->
            <div class="form-group">
                <label for="password">Contraseña</label>
                <div class="password-input">
                    <input
                        id="password"
                        v-model="password"
                        :type="showPassword ? 'text' : 'password'"
                        :class="{ 'error': !validaciones.password.valido && password }"
                        :disabled="isLoading"
                        autocomplete="current-password"
                        placeholder="Tu contraseña"
                    />
                    <button
                        type="button"
                        class="toggle-password"
                        @click="togglePassword"
                        :disabled="isLoading"
                    >
                        {{ showPassword ? '🙈' : '👁️' }}
                    </button>
                </div>
                <span
                    v-if="!validaciones.password.valido && password"
                    class="error-message"
                >
                    {{ validaciones.password.mensaje }}
                </span>
            </div>

            <!-- Mensaje de feedback -->
             <div
                v-if="mensaje.texto"
                class="mensaje"
                :class="mensaje.tipo"
             >
                {{ mensaje.texto }}
            </div>

            <!-- Submit Button -->
            <button 
                type="submit"
                class="btn-submit"
                :disabled="!formValido || isLoading"
                :class="{ 'loading': isLoading }"
            >
                {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
        </form>
    </div>
</template>

<style scoped>
.login-container {
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

.login-form {
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

input.error {
    border-color: #dc3545;
}

.password-input {
    position: relative;
    display: flex;
}

.password-input input {
    flex: 1;
    padding-right: 3rem;
}

.toggle-password {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
}

.toggle-password:hover:not(:disabled) {
    color: #e0e0e0;
}

.error-message {
    color: #dc3545;
    font-size: 0.8rem;
    margin-top: 0.25rem;
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

.btn-submit {
    padding: 0.75rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
    background: #45a049;
}

.btn-submit:disabled {
    background: #666;
    cursor: not-allowed;
}

.btn-submit.loading {
    position: relative;
    color: transparent;
}

.btn-submit.loading::after {
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

@media (max-width: 480px) {
    .login-container {
        margin: 1rem;
        padding: 1.5rem;
    }

    h2 {
        font-size: 1.5rem;
    }

    .btn-submit {
        padding: 1rem;
    }
}
</style>