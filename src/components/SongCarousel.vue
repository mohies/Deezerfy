<template>
  <div id="song-carousel" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item" :class="{ active: index === 0 }" v-for="(song, index) in songs" :key="song.id">
        <div class="carousel-content">
          <img :src="song.album.cover_xl" class="d-block w-100 carousel-image" alt="Song Cover" />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ song.title }}</h5>
            <p>{{ song.artist.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Controles del carrusel -->
    <button class="carousel-control-prev" type="button" data-bs-target="#song-carousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#song-carousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Siguiente</span>
    </button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { Carousel } from "bootstrap"; // Importa el módulo de Bootstrap

defineProps({
  songs: {
    type: Array,
    required: true,
  },
});

// Inicializa el carrusel cuando el componente esté montado
onMounted(() => {
  const carouselElement = document.querySelector("#song-carousel");
  if (carouselElement) {
    new Carousel(carouselElement, {
      interval: 3000, // Cambia automáticamente cada 3 segundos
      ride: "carousel", // Inicia el carrusel al cargar
      pause: false, // Evita que el carrusel se detenga al pasar el mouse
    });
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles.scss' as *;

.carousel-content {
  height: 500px;
  /* Mantén una altura consistente */
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-content img {
  border-radius: 15px;
  max-height: 100%;
  /* Limita la altura máxima */
  object-fit: cover;
  /* Ajusta la imagen sin deformarla */
}

.carousel-image {
  width: 100%;
  height: 100%;
  /* Mantén una altura consistente */
  object-fit: cover;
}

.carousel-caption {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  padding: 10px;
}
</style>
