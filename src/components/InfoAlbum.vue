<template>
  <div class="info-album">
    <!-- Cargando -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando álbum...</p>
    </div>
    
    <!-- Contenido del álbum -->
    <div v-else-if="album" class="album-content">
      <div class="album-header">
        <img :src="album.cover_xl || album.cover_big || album.cover_medium" alt="Album Cover" class="album-cover" />
        <div class="album-details">
          <h1>{{ album.title }}</h1>
          <p v-if="album.artist" class="artist-name" @click="goToArtist">{{ album.artist.name }}</p>
          <p class="album-meta">
            <span v-if="album.release_date">{{ formatDate(album.release_date) }}</span>
            <span v-if="album.nb_tracks"> • {{ album.nb_tracks }} canciones</span>
          </p>
          <button class="play-all-btn" @click="playAll">
            <i class="bi bi-play-fill"></i> Reproducir todo
          </button>
        </div>
      </div>
      
      <h3 class="tracks-title">Lista de Canciones</h3>
      <div class="tracks-list">
        <div 
          v-for="(track, index) in album.tracks?.data" 
          :key="track.id" 
          class="track-row"
          @click="playTrack(track)"
        >
          <span class="track-number">{{ index + 1 }}</span>
          <div class="track-info">
            <span class="track-title">{{ track.title }}</span>
            <span class="track-duration">{{ formatDuration(track.duration) }}</span>
          </div>
          <button class="play-btn" @click.stop="playTrack(track)">
            <i class="bi bi-play-fill"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Error -->
    <div v-else class="error">
      <p>No se pudo cargar el álbum</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/stores/stores';

// Props recibidas del componente padre
const props = defineProps({
  id: [String, Number],
  type: String
});

const route = useRoute();
const router = useRouter();
const store = useMainStore();

const album = ref(null);
const loading = ref(false);

// Computed para obtener el ID actual (de props o de ruta)
const currentId = computed(() => props.id || route.params.id);

// Función para obtener los datos del álbum desde la API de Deezer
const fetchAlbum = async (albumId) => {
  if (!albumId) return;
  
  loading.value = true;
  album.value = null;
  
  try {
    const response = await fetch(`http://localhost:8080/https://api.deezer.com/album/${albumId}`);
    if (!response.ok) throw new Error('Error al obtener datos del álbum');
    const data = await response.json();
    album.value = data;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

// Formatear duración de segundos a mm:ss
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Formatear fecha
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Reproducir una pista con cola del álbum
const playTrack = (track) => {
  const tracks = album.value?.tracks?.data || [];
  store.playWithQueue(track, tracks);
};

// Reproducir todo el álbum
const playAll = () => {
  const tracks = album.value?.tracks?.data || [];
  if (tracks.length > 0) {
    store.playWithQueue(tracks[0], tracks);
  }
};

// Navegar al artista
const goToArtist = () => {
  if (album.value?.artist?.id) {
    router.push({ name: 'Info', params: { type: 'artist', id: album.value.artist.id } });
  }
};

// Cargar al montar
onMounted(() => {
  if (currentId.value) fetchAlbum(currentId.value);
});

// Observar cambios en el ID
watch(currentId, (newId) => {
  if (newId) fetchAlbum(newId);
});
</script>

<style scoped>
.info-album {
  min-height: 100vh;
  background: linear-gradient(180deg, #2a1f4e 0%, #121212 30%);
  padding: 40px;
  padding-bottom: 120px;
  color: #fff;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(162, 56, 255, 0.3);
  border-top-color: #A238FF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.album-header {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.album-cover {
  width: 250px;
  height: 250px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  object-fit: cover;
}

.album-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.album-details h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
}

.artist-name {
  font-size: 1.2rem;
  color: #A238FF;
  cursor: pointer;
  margin: 0 0 10px 0;
}

.artist-name:hover {
  text-decoration: underline;
}

.album-meta {
  color: #b3b3b3;
  font-size: 0.9rem;
  margin: 0 0 20px 0;
}

.play-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #A238FF;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;
}

.play-all-btn:hover {
  background: #b85fff;
  transform: scale(1.05);
}

.tracks-title {
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #fff;
}

.tracks-list {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.track-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.track-row:hover {
  background: rgba(255, 255, 255, 0.1);
}

.track-number {
  width: 30px;
  text-align: center;
  color: #b3b3b3;
  font-size: 0.9rem;
}

.track-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.track-title {
  font-size: 1rem;
}

.track-duration {
  color: #b3b3b3;
  font-size: 0.85rem;
}

.play-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.track-row:hover .play-btn {
  opacity: 1;
}

.error {
  text-align: center;
  padding: 60px;
  color: #b3b3b3;
}

@media (max-width: 768px) {
  .info-album {
    padding: 20px;
  }
  
  .album-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .album-cover {
    width: 200px;
    height: 200px;
  }
  
  .album-details h1 {
    font-size: 1.8rem;
  }
}
</style>