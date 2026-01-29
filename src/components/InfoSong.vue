<template>
  <div class="info-song" v-if="song">
    <h2>{{ song.title }}</h2>
    <img v-if="song.album && song.album.cover_xl" :src="song.album.cover_xl" alt="Album Cover" class="album-cover" />
    <p v-if="song.artist">Artista: {{ song.artist.name }}</p>
    <p v-if="song.album">Álbum: {{ song.album.title }}</p>
    <button @click="playSong">Reproducir</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '@/stores/stores';

// Obtenemos la instancia de la ruta actual
const route = useRoute();

// Definimos una referencia reactiva para almacenar los datos de la canción
const song = ref(null);

// Obtenemos la instancia del store principal
const store = useMainStore();

// Función para obtener los datos de la canción desde la API de Deezer
const fetchSong = async (songId) => {
  try {
    // Realizamos una solicitud a la API de Deezer para obtener los datos de la canción
    const response = await fetch(`http://localhost:8080/https://api.deezer.com/track/${songId}`);
    if (!response.ok) throw new Error('Error al obtener datos de la canción');
    const data = await response.json();
    // Almacenamos los datos de la canción en la referencia reactiva
    song.value = data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Función para reproducir la canción
const playSong = () => {
  // Establecemos la canción actual en el store
  store.setCurrentSong(song.value);
};

// Cuando el componente se monta, obtenemos los datos de la canción utilizando el ID de la ruta
onMounted(() => {
  fetchSong(route.params.id);
});
</script>

<style scoped>
.info-song {
  text-align: center;
  font-size: 0.9em;
  padding-bottom: 100px; /* Add padding to avoid overlap with the fixed music player */
}
.info-song img {
  max-width: 30%; /* Reduce image size */
}
button {
  margin-top: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
button:hover {
  background-color: #218838;
  transform: scale(1.05);
}
</style>