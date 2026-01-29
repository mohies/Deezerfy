<template>
  <div class="info-view">
    <!-- Carga dinámica del componente y pasa tanto id como type -->
    <component :is="DynamicComponent" :id="id" :type="type"></component>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

// Obtener los parámetros de la ruta
const route = useRoute();
const { type, id } = route.params;

// Cargar dinámicamente el componente según el tipo
const DynamicComponent = computed(() => {
  if (type === 'artist') {
    return defineAsyncComponent(() => import('@/components/InfoArtist.vue'));
  } else if (type === 'album') {
    return defineAsyncComponent(() => import('@/components/InfoAlbum.vue'));
  } else if (type === 'song') {
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