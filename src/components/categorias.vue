<script setup> 
import { useCategorias  } from '../composables/useCategorias.js';

const {
    categorias,
    nuevaCategoria, 
    agregarCategoria
} = useCategorias()
</script>

<template>
    <div>
        <h2>Categorias</h2>
        <form @submit.prevent="agregarCategoria">
            <input v-model="nuevaCategoria" placeholder="Nuevza Categoria">
            <button type="submit">Agregar</button>
        </form>

        <ul>
            <li v-for="cat in categorias" :key="cat.id">{{ cat.nombre }}</li>
        </ul>
    </div>
</template>

<style scoped>
input {
  margin-right: 0.5rem;
}
</style>