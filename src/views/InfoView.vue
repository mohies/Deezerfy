<template>
  <div class="info-view">
    <!-- Carga dinámica del componente y pasa tanto id como type (reactivos) -->
    <component :is="DynamicComponent" :id="id" :type="type" :key="type + '-' + id"></component>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

// Obtener los parámetros de la ruta de forma reactiva
const route = useRoute();

// Computeds reactivos para type e id
const type = computed(() => route.params.type);
const id = computed(() => route.params.id);

// Cargar dinámicamente el componente según el tipo
const DynamicComponent = computed(() => {
  if (type.value === 'artist') {
    return defineAsyncComponent(() => import('@/components/InfoArtist.vue'));
  } else if (type.value === 'album') {
    return defineAsyncComponent(() => import('@/components/InfoAlbum.vue'));
  } else if (type.value === 'song') {
    return defineAsyncComponent(() => import('@/components/InfoSong.vue'));
  }
});
</script>

<style lang="scss" scoped>
.info-view {
  min-height: 100vh;
  background: #121212;
}
</style>