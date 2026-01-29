<template>
  <div class="search-bar">
    <input type="text" v-model="searchQuery" @keyup.enter="emitSearch" placeholder="Busca canciones, artistas o álbumes" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search']); // Define el evento "search"
const searchQuery = ref('');

// Emitir el término de búsqueda
const emitSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value); // Emitir búsqueda con el término actual y el evento "search" hacia el componente padre
  }
};
</script>

<style scoped>
.search-bar input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>