<template>
  <div class="search-page">
    <h2>Resultados de la Búsqueda</h2>

    <div v-if="filterType === 'songs'" class="results-list">
      <div v-for="song in results" :key="song.id" class="song-item">
        <SongCard :song="song" :songList="results" />
      </div>
    </div>

    <div v-if="filterType === 'albums'" class="results-list">
      <div v-for="album in results" :key="album.id" class="album-item">
        <AlbumCard :album="album" />
      </div>
    </div>

    <div v-if="filterType === 'artists'" class="results-list">
      <div v-for="artist in results" :key="artist.id" class="artist-item">
        <ArtistCard :artist="artist" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import SongCard from '@/components/SongCard.vue';
import AlbumCard from '@/components/AlbumCard.vue';
import ArtistCard from '@/components/ArtistCard.vue';

defineProps({ //es la forma de definir las propiedades que el componente espera recibir
  results: Array, // Array de resultados de la búsqueda
  filterType: String // Tipo de filtro (canciones, álbumes, artistas)
});
</script>

<style scoped>
.search-page {
  background-color: #121212;
  /* Fondo oscuro para la página */
  padding: 20px;
  color: #fff;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #fff;
}

.results-list {
  display: flex;
  flex-direction: column;
  /* Asegura que las canciones se apilen verticalmente */
  gap: 15px;
  /* Espacio entre cada tarjeta */
}

.song-item,
.album-item,
.artist-item {
  display: flex;
  /* Usa flexbox para que los elementos se alineen en una fila */
  width: 100%;
  /* Hace que las tarjetas ocupen el 100% del ancho disponible */
  align-items: center;
  /* Centra los elementos verticalmente */
  gap: 15px;
  /* Espacio entre la imagen y los detalles */
  margin-bottom: 15px;
  /* Espacio entre cada tarjeta */
}

.song-card,
.album-card,
.artist-card {
  display: flex;
  /* Usamos flexbox para los elementos dentro de la tarjeta */
  width: 100%;
  /* Cada tarjeta ocupa el 100% de su contenedor */
  gap: 15px;
  /* Espacio entre la imagen y los detalles */
  align-items: center;
  /* Centra los elementos verticalmente */
}

.song-card .album-cover,
.album-card .album-cover,
.artist-card .album-cover {
  width: 50px;
  /* Tamaño reducido de la imagen */
  height: 50px;
  /* Mantener altura proporcional */
  border-radius: 5px;
  /* Esquinas redondeadas para la imagen */
}

.song-details,
.album-details,
.artist-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  /* Esto hace que los detalles ocupen el espacio restante */
  align-items: flex-start;
}

.song-item .song-card:hover,
.album-item .album-card:hover,
.artist-item .artist-card:hover {
  transform: translateY(-5px);
  /* Efecto hover para que la tarjeta suba */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  /* Efecto sombra en hover */
}

@media (max-width: 768px) {

  .song-item,
  .album-item,
  .artist-item {
    flex-direction: column;
    /* En pantallas más pequeñas, apilamos los elementos */
    align-items: center;
  }

  .song-card .album-cover,
  .album-card .album-cover,
  .artist-card .album-cover {
    width: 50px;
    /* En pantallas pequeñas, mantengo el tamaño reducido */
    height: 50px;
    /* Mantengo la relación de aspecto de la imagen */
    margin-bottom: 10px;
  }

  .song-details,
  .album-details,
  .artist-details {
    align-items: center;
    /* Centrar detalles cuando está en columna */
    text-align: center;
  }
}
</style>