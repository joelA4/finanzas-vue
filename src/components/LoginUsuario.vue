<script setup>
    import { ref } from 'vue'
    import axios from 'axios'

    const nombreusuario = ref('')
    const password = ref('')
    const mensaje = ref('')
    const exito = ref('')

    const loginUsuario = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', {
                nombreusuario: nombreusuario.value,
                password: password.value
            })

            //Guardar el usuario o token en localstorage
            localStorage.setItem('usuario', JSON.stringify(res.data))
            exito.value = value
            mensaje.value = "Inicio de sesion exitoso!"
        } catch (error) {
            mensaje.value = error.response?.data?.mensaje || 'Error al iniciar sesion'
            exito.value = false
        }
    }
</script>

<template> 
    <h2>Inicio de sesion</h2>
    <form @submit.prevent="loginUsuario">
        <input v-model="nombreusuario" placeholder="Nombre de usuario" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar sesion</button>
    </form>
    <p v-if="mensaje" :style="{ color: exito ? 'green' : 'red' }" >{{ mensaje }}</p>

</template>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 300px;
}
</style>