<script setup>
import { ref } from 'vue'
import axios from 'axios'

const nombre = ref('')
const email = ref('')
const nombreusuario = ref('')
const password = ref('')
const mensaje = ref('')
const exito = ref(false)

const registrarUsuario = async () => {
    try {
        console.log({
            nombre: nombre.value,
            email: email.value,
            nombreusuario: nombreusuario.value,
            password: password.value
        });
        const res = await axios.post('http://localhost:3000/api/auth/registro', {
            nombre: nombre.value,
            email: email.value,
            nombreusuario: nombreusuario.value,
            password: password.value
        })

        mensaje.value = 'Usario registrado correctamente'
        exito.value = true
        console.log(res.data)

    } catch (error) {
        mensaje.value = error.response?.data?.mensaje || 'Error al registrar'
        exito.value = false
    }
}
</script>

<template>
    <h2>Registro de Usuariooo</h2>
    <form @submit.prevent="registrarUsuario">
        <input v-model="nombre" placeholder="Nombre completo" required>
        <input v-model="email" type="email" placeholder="Correo electrónico" required />
        <input v-model="nombreusuario" placeholder="Nombre de usuario" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Registrarse</button>
    </form>

    <p v-if="mensaje" :style="{ color: exito ? 'green' : 'red' }"> {{ mensaje }} </p>
</template>

<style scoped>
    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
    }
</style>