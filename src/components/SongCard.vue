<template>
  <div class="song-card">
    <!-- Imagen del álbum, al hacer clic redirige a la página del álbum -->
    <img :src="song.album.cover_xl" alt="Album cover" class="album-cover" @click="navigateToInfo('album', song.album.id)" />
    <div class="song-info">
      <!-- Título de la canción, al hacer clic redirige a la página de la canción -->
      <p><strong @click="navigateToInfo('song', song.id)" class="hover-underline">{{ song.title }}</strong></p>
      <!-- Artista de la canción, al hacer clic redirige a la página del artista -->
      <p><em @click="navigateToInfo('artist', song.artist.id)" class="hover-underline">{{ song.artist.name }}</em></p>
    </div>
    <div class="button-container">
      <!-- Botón para añadir o quitar de la playlist -->
      <button @click="alternarListaReproducción(song)" >
        {{ isInPlaylist(song) ? 'Quitar de Playlist' : 'Añadir a Playlist' }}
      </button>
      <!-- Botón para añadir o quitar de favoritos -->
      <button @click="alternaFavoritos(song)" >
        {{ isFavorite(song) ? '❤️ Quitar de Favoritos' : '🤍 Añadir a Favoritos' }}
      </button>
      <!-- Botón para reproducir la canción -->
      <button @click="playSong(song)">Reproducir</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'; // Importamos useRouter para la navegación
import { useMainStore } from '@/stores/stores'; // Importamos el store para gestionar la lista de reproducción y favoritos

// Definimos las propiedades
const props = defineProps({
  song: Object,
  songList: {
    type: Array,
    default: () => []
  }
});

const store = useMainStore(); // Instanciamos el store
const router = useRouter(); // Instanciamos el router

// Función para navegar a la información de canción, artista o álbum
const navigateToInfo = (type, id) => {
  router.push({ name: 'Info', params: { type, id } });
};

// Función para agregar o quitar la canción de la lista de reproducción
const alternarListaReproducción = (song) => {
  if (isInPlaylist(song)) {
    store.removeSongFromPlaylist(song.id);
  } else {
    store.addSongToPlaylist(song);
  }
};

// Función para verificar si la canción está en la lista de reproducción
const isInPlaylist = (song) => {
  return store.getPlaylist.songs.some(s => s.id === song.id);
};

// Función para agregar o quitar la canción de los favoritos
const alternaFavoritos = (song) => {
  if (isFavorite(song)) {
    store.removeFromFavorites(song.id);
  } else {
    store.addToFavorites(song);
  }
};

// Función para verificar si la canción está en los favoritos comprobando si el id de la canción está en la lista de favoritos
const isFavorite = (song) => {
  return store.favorites.some(fav => fav.id === song.id); 
};

// Función para reproducir la canción
const playSong = (song) => {
  // Si hay lista de canciones, usar cola; si no, reproducir individual
  if (props.songList && props.songList.length > 0) {
    store.playWithQueue(song, props.songList);
  } else {
    store.setCurrentSong(song);
  }
};
</script>

<style scoped>
.song-card {
  display: flex;
  align-items: center;
  gap: 20px; /* Espacio mayor entre la imagen y los detalles */
  background-color: #1f1f1f; /* Fondo oscuro para la tarjeta */
  padding: 15px;
  border-radius: 10px; /* Esquinas redondeadas */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra sutil */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%; /* Que ocupe el 100% del contenedor */
}

.song-card:hover {
  transform: translateY(-5px); /* Efecto hover para levantar la tarjeta */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); /* Sombra más intensa en hover */
}

.album-cover {
  width: 90px; /* Tamaño de la imagen más grande */
  height: 90px;
  border-radius: 5px; /* Esquinas redondeadas para la imagen */
  object-fit: cover; /* Ajuste de la imagen */
}

.song-info {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra el texto verticalmente */
  flex: 1; /* La columna de información ocupará el espacio restante */
}

.song-info p {
  margin: 5px 0; /* Espacio entre los elementos de información */
}

.song-info p strong {
  font-size: 1.1rem;
  color: #fff;
  font-weight: bold;
}

.song-info p em {
  font-size: 0.9rem;
  color: #bbb;
}

.hover-underline:hover {
  text-decoration: underline;
  cursor: pointer;
}

.button-container {
  display: flex;
  gap: 15px; /* Espacio entre los botones */
  margin-left: auto; /* Esto hará que los botones se alineen a la derecha */
  justify-content: flex-end; /* Alinea los botones a la derecha */
}

button {
  padding: 8px 15px;
  background-color: #1DB954;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

button:hover {
  background-color: #188d41;
}

/* Media Queries para hacer la tarjeta responsive */
@media (max-width: 768px) {
  .song-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .album-cover {
    width: 70px;
    height: 70px;
  }

  .button-container {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }

  button {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .song-card {
    padding: 10px;
  }

  .album-cover {
    width: 60px;
    height: 60px;
  }

  .song-info p strong {
    font-size: 1rem;
  }

  .song-info p em {
    font-size: 0.8rem;
  }

  button {
    padding: 5px 8px;
    font-size: 0.7rem;
  }
}
</style>
