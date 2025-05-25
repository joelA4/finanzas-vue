<template>
    <form @submit.prevent="manejarSubmit">
        <input v-model="pago.descripcion" placeholder="Descripcion" required />
        <input v-model="pago.monto" type="number" placeholder="Monto" required />
        <input v-model="pago.diaDePago" type="number" min="1" max="31" placeholder="Dia de pago" required />
        <button type="submit">{{ modoEdicion ? 'Actualizar' : 'Agregar' }} Pago Mensual</button>
    </form>
</template>

<script setup>
    import {ref, watch} from 'vue'
    import {nanoid} from 'nanoid'

    const props = defineProps({
        editar: Object,
        modoEdicion: Boolean
    })

    const emit = defineEmits(['nuevo-pago'])

    const pago = ref({
        id: '',
        descripcion: '',
        monto: 0,
        diaDePago : 1
    }) 

    watch(() => props.editar, (nuevo)=>{
        if (props.modoEdicion && nuevo) {   
            pago.value = { ...nuevo }
        } else {
            pago.value = {
                id: '',
                descripcion: '',
                monto: 0,
                diaDePago: 1
            }
        }
    })

    const manejarSubmit = () => {
        emit('nuevo-pago', { ...pago.value})
        pago.value ={
            id: '',
            descripcion: '',
            monto: 0,
            diaDePago: 1
        }
    }

</script>

<style scoped>
form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
input, button {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
