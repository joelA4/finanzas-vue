<script setup> 
import { ref, computed } from 'vue'
import { useCategorias  } from '../composables/useCategorias.js';
import { ESModulesEvaluator } from 'vite/module-runner';
import { eliminarMovimiento } from '../../Backend/controllers/movimientos.controller.js';

const {
    categorias,
    nuevaCategoria,
    agregarCategoria,
    eliminarCategoria,
    editarCategoria,
    error: categoriasError
} = useCategorias()

const nombreCategoria = ref('')
const modoEdicion = ref(false)
const categoriaEditando = ref(null)
const mostrarConfirmacion = ref(false)
const categoriaAEliminar = ref(null)
const isLoading = ref(false)
const mensaje = ref({ texto: '', tipo: '' })

const categoriaValida = computed(() => {
    return nombreCategoria.value.trim().length >= 2
})

async function handleSubmit() {
    if (!categoriaValida.value) {
        mensaje.value = {
            texto: 'El nombre debe de tener al menos 2 caracteres',
            tipo: 'error'
        }
        return
    }

    isLoading.value = true
    try {
        if (modoEdicion.value) {
            await editarCategoria({
                ...categoriaEditando.value,
                nombre: nombreCategoria.value.trim()
            })
            mensaje.value = {
                texto: 'Categoria actualizada exitosamente',
                tipo: 'success'
            }
            modoEdicion.value = false
            categoriaEditando.value = null
        } else {
            await agregarCategoria(nombreCategoria.value.trim())
            mensaje.value = {
                texto: 'Categoria creada exitosamente', 
                tipo: 'success'
            }
        }
        nombreCategoria.value = ''
    } catch (err) {
        mensaje.value = {
            texto: categoriasError.value || 'Error al procesar la categoria',
            tipo: 'error'
        }
    } finally {
        isLoading.value = false
        setTimeout(() => {
            mensaje.value = { texto: '', tipo: '' }
        }, 3000)
    }
}

function iniciarEdicion(categoria) {
    modoEdicion.value = true
    categoriaEditando.value = categoria
    nombreCategoria.value = categoria.nombre
}

function cancelarEdicion(){
    modoEdicion.value = false
    categoriaEditando.value = null
    nombreCategoria.value = ''
}

function confirmarEliminacion(categoria) {
    categoriaAEliminar.value = categoria
    mostrarConfirmacion.value = true
}

async function handleEliminar() {
    if (!categoriaAEliminar.value) {
        return
    }

    isLoading.value = true
    try {
        await eliminarCategoria(categoriaAEliminar.value.id)
        mensaje.value = {
            texto: 'Categoria eliminada exitosamente',
            tipo: 'success'
        }
    } catch (err) {
        mensaje.value = {
            texto: categoriasError.value || 'Error al eliminar la categoria',
            tipo: 'error'
        }
    } finally {
        isLoading.value = false
        mostrarConfirmacion.value = false 
        categoriaAEliminar.value = null
        setTimeout(() => {
            mensaje.value = { texto: '', tipo: ''}
        }, 3000)
    }
}

</script>

<template>
    <div class="categorias-container">
        <h3>Gestion de Categorias</h3>

        <!-- Formulario -->
         <form @submit.prevent = "handleSubmit" class="categoria-form">
            <div class="input-group">
                <input
                    v-model="nombreCategoria"
                    type="text"
                    :placeholder="modoEdicion ? 'editar categoria' : 'Nueva Categoria'"
                    :disabled="isLoading"
                    class="categoria-input"
                    :class="{ 'error': !categoriaValidar && nombreCategoria}"
                >
                <div class="form-buttons">
                    <button
                    type="submit"
                    :disabled="!categoriaValida || isLoading"
                    class="btn-submit"
                    :class="{ 'loading': isLoading }"
                    >
                        {{ modoEdicion ? 'Actualizar' : 'Agregar' }}
                    </button>
                    <button 
                    v-if="modoEdicion"
                    type="button"
                    @click="cancelarEdicion"
                    class="btn-cancelar"
                    :disabled="isLoading"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
         </form>

         <!-- Mensaje de feedback -->
          <div
          v-if="mensaje.texto"
          class="mensaje"
          :class="mensaje.tipo"
          >
            {{ mensaje.texto }}
          </div>

          <!-- Lista de categorias -->
           <ul class="categorias-lista">
            <li v-for="cat in categorias" :key="cat.id" class="categoria-item">
                <span class="categoria-nombre">{{ cat.nombre }}</span>
                <div class="categoria-acciones">
                    <button 
                        @click="iniciarEdicion(cat)"
                        class="btn-editar"
                        :disabled="isLoading"
                    >
                        Editar
                    </button>
                    <button
                        @click="confirmarEliminacion(cat)"
                        class="btn-eliminar"
                        :disabled="isLoading"
                    >
                        Eliminar
                    </button>
                </div>
            </li>
        </ul>

        <!-- Modal de confirmacion -->
         <div v-if="mostrarConfirmacion" class="modal-overloay">
            <div class="modal-content">
                <h4>Confirmar Eliminación</h4>
                <p>
                    Estas seguro de que deseas eliminar la categoria
                    "{{ categoriaAEliminar?.nombre }}"?
                </p>
                <div class="modal-actions">
                    <button
                        @click="handleEliminar"
                        class="btn-confirmar"
                        :disabled="isLoading"
                    >
                        Confirmar
                    </button>
                    <button
                        @click="mostrarConfirmacion = false"
                        class="btn-cancelar"
                        :disabled="isLoading"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
         </div>
    </div>
</template>

<style scoped>
.categorias-container {
    padding: 1rem;
    background: #2c2c2c;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
    color: #e0e0e0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    text-align: center;
}

.categoria-form {
    margin-bottom: 1.5rem;
}

.input-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.categoria-input {
    flex: 1;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #444;
    background: #1c1c1c;
    color: #e0e0e0;
    border-radius: 4px;
    min-width: 200px;
}

.categoria-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.categoria-input.error {
    border-color: #dc3545;
}

.form-buttons {
    display: flex;
    gap: 0.5rem;
}

.btn-submit {
    padding: 0.75rem 1.5rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
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

.btn-cancelar {
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: #dc3545;
    border: 1px solid #dc3545;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
}

.btn-cancelar:hover:not(:disabled) {
    background: #dc3545;
    color: white;
}

.mensaje {
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
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

.categorias-lista {
    list-style: none;
    padding: 0;
    margin: 0;
}

.categoria-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #1c1c1c;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    transition: transform 0.2s;
}

.categoria-item:hover {
    transform: translateX(4px);
}

.categoria-nombre {
    color: #e0e0e0;
    font-size: 1rem;
}

.categoria-acciones {
    display: flex;
    gap: 0.5rem;
}

.btn-editar,
.btn-eliminar {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

.btn-editar {
    background: #4CAF50;
    color: white;
}

.btn-editar:hover:not(:disabled) {
    background: #45a049;
}

.btn-eliminar {
    background: #dc3545;
    color: white;
}

.btn-eliminar:hover:not(:disabled) {
    background: #c82333;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: #2c2c2c;
    padding: 2rem;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
}

.modal-content h4 {
    color: #e0e0e0;
    margin: 0 0 1rem;
    font-size: 1.2rem;
}

.modal-content p {
    color: #888;
    margin-bottom: 1.5rem;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn-confirmar {
    padding: 0.75rem 1.5rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
}

.btn-confirmar:hover:not(:disabled) {
    background: #c82333;
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

@media (max-width: 768px) {
    .input-group {
        flex-direction: column;
    }

    .categoria-input {
        width: 100%;
    }

    .form-buttons {
        width: 100%;
    }

    .btn-submit,
    .btn-cancelar {
        flex: 1;
    }

    .categoria-item {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }

    .categoria-acciones {
        width: 100%;
        justify-content: center;
    }
}

</style>