<template>
  <li class="song-item">
    <!-- Imagen del álbum, al hacer clic redirige a la página del álbum -->
    <img :src="song.album.cover_medium" alt="Album cover" class="album-cover" @click="navigateToInfo('album', song.album.id)" />
    
    <div class="song-info">
      <!-- Título de la canción, al hacer clic redirige a la página de la canción -->
      <p>
        <strong @click="navigateToInfo('song', song.id)" class="hover-underline">{{ song.title }}</strong>
      </p>
      
      <!-- Artista de la canción, al hacer clic redirige a la página del artista -->
      <p>
        <em @click="navigateToInfo('artist', song.artist.id)" class="hover-underline">{{ song.artist.name }}</em>
      </p>
    </div>
    
    <!-- Botón para reproducir la canción -->
    <button @click="playSong(song)" class="play-song-btn">Reproducir</button>
    
    <!-- Botón para quitar la canción -->
    <button @click="removeSong(song.id)" class="remove-song-btn">Quitar</button>
  </li>
</template>

<script setup>
import { useMainStore } from '@/stores/stores';
import { useRouter } from 'vue-router'; // Importamos useRouter para la navegación

// Definimos las propiedades que el componente espera recibir
const props = defineProps({
  song: {
    type: Object,
    required: true
  }
});

const store = useMainStore(); // Instanciamos el store de la aplicación para gestionar la lista de reproducción 
const router = useRouter(); // Instanciamos el router

// Función para navegar a la información de canción, artista o álbum
const navigateToInfo = (type, id) => {
  router.push({ name: 'Info', params: { type, id } });
};

// Función para reproducir la canción con cola de la playlist
const playSong = (song) => {
  const playlistSongs = store.getPlaylist.songs;
  store.playWithQueue(song, playlistSongs);
};

// Función para quitar la canción de la playlist
const removeSong = (songId) => {
  store.removeSongFromPlaylist(songId);
};
</script>

<style scoped>
.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #444;
}

.album-cover {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer; /* Asegura que la imagen sea clickeable */
}

.song-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.song-title {
  font-weight: bold;
  color: #fff;
}

.song-artist {
  color: #b3b3b3;
}

.play-song-btn, .remove-song-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 5px;
}

.play-song-btn:hover {
  background-color: #218838;
}

.remove-song-btn {
  background-color: #dc3545;
}

.remove-song-btn:hover {
  background-color: #c82333;
}

/* Estilo para los enlaces de texto */
.hover-underline:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
