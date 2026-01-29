<template>
  <div class="search-page">
    <!-- Toast Notification -->
    <transition name="toast">
      <div class="toast-notification" v-if="showToast">
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- Search Header -->
    <div class="search-header">
      <div class="search-box">
        <i class="bi bi-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch"
          placeholder="¿Qué quieres escuchar?" 
          class="search-input"
          ref="searchInput"
        />
        <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs" v-if="hasResults">
      <button 
        class="filter-tab" 
        :class="{ active: filterType === 'all' }"
        @click="filterType = 'all'"
      >
        Todo
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: filterType === 'songs' }"
        @click="filterType = 'songs'"
      >
        Canciones
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: filterType === 'artists' }"
        @click="filterType = 'artists'"
      >
        Artistas
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: filterType === 'albums' }"
        @click="filterType = 'albums'"
      >
        Álbumes
      </button>
    </div>

    <!-- Loading -->
    <div class="loading" v-if="isLoading">
      <div class="spinner"></div>
      <p>Buscando...</p>
    </div>

    <!-- Results -->
    <div class="search-results" v-else-if="hasResults">
      
      <!-- All Results View -->
      <template v-if="filterType === 'all'">
        <!-- Top Result -->
        <div class="results-grid" v-if="topResult">
          <div class="top-result-section">
            <h2 class="section-title">Resultado principal</h2>
            <div class="top-result-card" @click="playTopResult">
              <img :src="topResult.album?.cover_big || topResult.picture_big" :alt="topResult.title || topResult.name" />
              <div class="top-result-info">
                <h3>{{ topResult.title || topResult.name }}</h3>
                <p>
                  <span class="result-type">{{ topResult.type === 'track' ? 'Canción' : 'Artista' }}</span>
                  <span v-if="topResult.artist">• {{ topResult.artist.name }}</span>
                </p>
              </div>
              <button class="play-btn-float">
                <i class="bi bi-play-fill"></i>
              </button>
            </div>
          </div>

          <!-- Songs Preview -->
          <div class="songs-preview-section" v-if="searchResults.songs.length">
            <h2 class="section-title">Canciones</h2>
            <div class="songs-preview-list">
              <div 
                v-for="song in searchResults.songs.slice(0, 4)" 
                :key="song.id" 
                class="song-row"
                @click="playSong(song)"
              >
                <img :src="song.album.cover_small" :alt="song.title" />
                <div class="song-row-info">
                  <span class="song-row-title">{{ song.title }}</span>
                  <span class="song-row-artist">{{ song.artist.name }}</span>
                </div>
                <div class="song-row-actions">
                  <button class="action-btn" @click.stop="addToQueue(song)" title="Añadir a la cola">
                    <i class="bi bi-collection-play"></i>
                  </button>
                  <button class="action-btn" @click.stop="toggleFavorite(song)" :class="{ active: isFavorite(song) }">
                    <i :class="isFavorite(song) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                  </button>
                </div>
                <span class="song-row-duration">{{ formatDuration(song.duration) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Artists Row -->
        <section class="results-section" v-if="searchResults.artists.length">
          <h2 class="section-title">Artistas</h2>
          <div class="horizontal-scroll">
            <div 
              v-for="artist in searchResults.artists.slice(0, 6)" 
              :key="artist.id" 
              class="artist-card"
              @click="navigateTo('artist', artist.id)"
            >
              <div class="artist-image">
                <img :src="artist.picture_medium" :alt="artist.name" />
              </div>
              <h4>{{ artist.name }}</h4>
              <p>Artista</p>
            </div>
          </div>
        </section>

        <!-- Albums Row -->
        <section class="results-section" v-if="searchResults.albums.length">
          <h2 class="section-title">Álbumes</h2>
          <div class="horizontal-scroll">
            <div 
              v-for="album in searchResults.albums.slice(0, 6)" 
              :key="album.id" 
              class="album-card"
              @click="navigateTo('album', album.id)"
            >
              <div class="album-image">
                <img :src="album.cover_medium" :alt="album.title" />
                <button class="play-btn-overlay" @click.stop="playAlbum(album)">
                  <i class="bi bi-play-fill"></i>
                </button>
              </div>
              <h4>{{ album.title }}</h4>
              <p>{{ album.artist?.name }}</p>
            </div>
          </div>
        </section>
      </template>

      <!-- Songs Only -->
      <template v-else-if="filterType === 'songs'">
        <div class="songs-list">
          <div class="songs-header">
            <span class="col-num">#</span>
            <span class="col-title">Título</span>
            <span class="col-album">Álbum</span>
            <span class="col-duration"><i class="bi bi-clock"></i></span>
          </div>
          <div 
            v-for="(song, index) in searchResults.songs" 
            :key="song.id" 
            class="song-row-full"
            @click="playSong(song)"
          >
            <span class="col-num">{{ index + 1 }}</span>
            <div class="col-title">
              <img :src="song.album.cover_small" :alt="song.title" />
              <div class="song-info">
                <span class="song-name">{{ song.title }}</span>
                <span class="song-artist" @click.stop="navigateTo('artist', song.artist.id)">{{ song.artist.name }}</span>
              </div>
            </div>
            <span class="col-album" @click.stop="navigateTo('album', song.album.id)">{{ song.album.title }}</span>
            <div class="col-actions">
              <button class="action-btn" @click.stop="addToQueue(song)" title="Añadir a la cola">
                <i class="bi bi-collection-play"></i>
              </button>
              <button class="action-btn" @click.stop="toggleFavorite(song)" :class="{ active: isFavorite(song) }">
                <i :class="isFavorite(song) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
              </button>
              <button class="action-btn" @click.stop="addToPlaylist(song)">
                <i class="bi bi-plus-circle"></i>
              </button>
            </div>
            <span class="col-duration">{{ formatDuration(song.duration) }}</span>
          </div>
        </div>
      </template>

      <!-- Artists Only -->
      <template v-else-if="filterType === 'artists'">
        <div class="artists-grid">
          <div 
            v-for="artist in searchResults.artists" 
            :key="artist.id" 
            class="artist-card-big"
            @click="navigateTo('artist', artist.id)"
          >
            <div class="artist-image-big">
              <img :src="artist.picture_big" :alt="artist.name" />
            </div>
            <h3>{{ artist.name }}</h3>
            <p>Artista</p>
          </div>
        </div>
      </template>

      <!-- Albums Only -->
      <template v-else-if="filterType === 'albums'">
        <div class="albums-grid">
          <div 
            v-for="album in searchResults.albums" 
            :key="album.id" 
            class="album-card-big"
            @click="navigateTo('album', album.id)"
          >
            <div class="album-image-big">
              <img :src="album.cover_big" :alt="album.title" />
              <button class="play-btn-overlay" @click.stop="playAlbum(album)">
                <i class="bi bi-play-fill"></i>
              </button>
            </div>
            <h4>{{ album.title }}</h4>
            <p>{{ album.artist?.name }}</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Empty State -->
    <div class="empty-state" v-else-if="!searchQuery">
      <div class="browse-section">
        <h2>Explorar todo</h2>
        <div class="genre-grid">
          <div class="genre-card" style="background: linear-gradient(135deg, #E13300, #E8115B);" @click="quickSearch('pop')">
            <span>Pop</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #1E3264, #608108);" @click="quickSearch('hip hop')">
            <span>Hip Hop</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #8D67AB, #E61E32);" @click="quickSearch('rock')">
            <span>Rock</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #E8115B, #F59B23);" @click="quickSearch('latino')">
            <span>Latino</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #148A08, #27856A);" @click="quickSearch('reggaeton')">
            <span>Reggaetón</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #503750, #8C1932);" @click="quickSearch('electronic')">
            <span>Electrónica</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #477D95, #1D3264);" @click="quickSearch('jazz')">
            <span>Jazz</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #AF2896, #5000B0);" @click="quickSearch('indie')">
            <span>Indie</span>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div class="no-results" v-else-if="searchQuery && !hasResults && !isLoading">
      <i class="bi bi-search"></i>
      <h3>No se encontraron resultados para "{{ searchQuery }}"</h3>
      <p>Comprueba que no haya errores ortográficos o intenta buscar otra cosa.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/stores/stores';

const route = useRoute();
const router = useRouter();
const store = useMainStore();

const searchQuery = ref('');
const filterType = ref('all');
const isLoading = ref(false);
const searchTimeout = ref(null);
const searchInput = ref(null);
const toastMessage = ref('');
const showToast = ref(false);

const searchResults = ref({
  songs: [],
  albums: [],
  artists: []
});

// Computed
const hasResults = computed(() => {
  return searchResults.value.songs.length > 0 || 
         searchResults.value.albums.length > 0 || 
         searchResults.value.artists.length > 0;
});

const topResult = computed(() => {
  if (searchResults.value.songs.length > 0) {
    return { ...searchResults.value.songs[0], type: 'track' };
  }
  if (searchResults.value.artists.length > 0) {
    return { ...searchResults.value.artists[0], type: 'artist' };
  }
  return null;
});

// Methods
const handleSearch = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.trim()) {
      performSearch();
    } else {
      searchResults.value = { songs: [], albums: [], artists: [] };
    }
  }, 300);
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;
  
  isLoading.value = true;

  try {
    const [songResponse, albumResponse, artistResponse] = await Promise.all([
      fetch(`http://localhost:8080/https://api.deezer.com/search?q=${encodeURIComponent(searchQuery.value)}`),
      fetch(`http://localhost:8080/https://api.deezer.com/search/album?q=${encodeURIComponent(searchQuery.value)}`),
      fetch(`http://localhost:8080/https://api.deezer.com/search/artist?q=${encodeURIComponent(searchQuery.value)}`)
    ]);

    const [songData, albumData, artistData] = await Promise.all([
      songResponse.json(),
      albumResponse.json(),
      artistResponse.json()
    ]);

    searchResults.value = {
      songs: songData.data || [],
      albums: albumData.data || [],
      artists: artistData.data || []
    };
  } catch (error) {
    console.error('Error en la búsqueda:', error);
  } finally {
    isLoading.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = { songs: [], albums: [], artists: [] };
  filterType.value = 'all';
};

const quickSearch = (genre) => {
  searchQuery.value = genre;
  performSearch();
};

const playSong = (song) => {
  store.playWithQueue(song, searchResults.value.songs);
};

const playTopResult = () => {
  if (topResult.value?.type === 'track') {
    store.playWithQueue(topResult.value, searchResults.value.songs);
  } else if (topResult.value?.type === 'artist') {
    navigateTo('artist', topResult.value.id);
  }
};

const playAlbum = async (album) => {
  try {
    const response = await fetch(`http://localhost:8080/https://api.deezer.com/album/${album.id}`);
    const data = await response.json();
    if (data.tracks?.data?.length > 0) {
      store.playWithQueue(data.tracks.data[0], data.tracks.data);
    }
  } catch (error) {
    console.error('Error loading album:', error);
  }
};

const addToQueue = (song) => {
  store.addToQueue(song);
  showNotification(`"${song.title}" añadida a la cola`);
};

const addToPlaylist = (song) => {
  store.addSongToPlaylist(song);
  showNotification(`"${song.title}" añadida a tu playlist`);
};

const showNotification = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const isFavorite = (song) => {
  return store.favorites.some(fav => fav.id === song.id);
};

const toggleFavorite = (song) => {
  if (isFavorite(song)) {
    store.removeFromFavorites(song.id);
  } else {
    store.addToFavorites(song);
  }
};

const navigateTo = (type, id) => {
  router.push({ name: 'Info', params: { type, id } });
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Watch for URL query changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery;
    performSearch();
  }
});

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q;
    performSearch();
  }
  searchInput.value?.focus();
});
</script>

<style lang="scss" scoped>
$deezer-purple: #A238FF;
$deezer-pink: #EF5466;
$bg-primary: #121212;
$bg-secondary: #181818;
$bg-hover: #282828;
$text-primary: #ffffff;
$text-secondary: #b3b3b3;

.search-page {
  min-height: 100vh;
  padding-bottom: 120px;
}

// ========== SEARCH HEADER ==========
.search-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 24px;
  background: linear-gradient(180deg, $bg-secondary 0%, transparent 100%);
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: $bg-primary;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 14px 44px;
  border-radius: 500px;
  border: none;
  background: $text-primary;
  color: $bg-primary;
  font-size: 0.95rem;
  font-weight: 500;
  outline: none;

  &::placeholder {
    color: #757575;
  }
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: $bg-primary;
  }
}

// ========== FILTER TABS ==========
.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 0 24px 16px;
}

.filter-tab {
  padding: 8px 16px;
  border-radius: 500px;
  border: none;
  background: $bg-hover;
  color: $text-primary;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
  }

  &.active {
    background: $text-primary;
    color: $bg-primary;
  }
}

// ========== LOADING ==========
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: $text-secondary;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid $bg-hover;
    border-top-color: $deezer-purple;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
}

// ========== RESULTS GRID ==========
.results-grid {
  display: grid;
  grid-template-columns: minmax(300px, 400px) 1fr;
  gap: 24px;
  padding: 0 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16px;
}

// Top Result Card
.top-result-card {
  position: relative;
  background: $bg-hover;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;

    .play-btn-float {
      opacity: 1;
      transform: translateY(0);
    }
  }

  img {
    width: 92px;
    height: 92px;
    border-radius: 4px;
    object-fit: cover;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }

  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 8px 0;
  }

  p {
    color: $text-secondary;
    margin: 0;
    font-size: 0.9rem;
  }

  .result-type {
    background: rgba(0,0,0,0.3);
    padding: 4px 12px;
    border-radius: 500px;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
    margin-right: 8px;
  }
}

.play-btn-float {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, $deezer-purple 0%, $deezer-pink 100%);
  border: none;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);

  &:hover {
    transform: scale(1.05) translateY(0);
    background: #1ed760;
  }
}

// Songs Preview
.songs-preview-list {
  display: flex;
  flex-direction: column;
}

.song-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: $bg-hover;

    .song-row-actions {
      opacity: 1;
    }
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
}

.song-row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.song-row-title {
  color: $text-primary;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-row-artist {
  color: $text-secondary;
  font-size: 0.8rem;
}

.song-row-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.song-row-duration {
  color: $text-secondary;
  font-size: 0.85rem;
  min-width: 40px;
  text-align: right;
}

.action-btn {
  background: none;
  border: none;
  color: $text-secondary;
  cursor: pointer;
  padding: 4px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    color: $text-primary;
    transform: scale(1.1);
  }

  &.active {
    color: $deezer-pink;
  }
}

// ========== HORIZONTAL SECTIONS ==========
.results-section {
  padding: 24px;
}

.horizontal-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }
}

.artist-card {
  flex-shrink: 0;
  width: 180px;
  padding: 16px;
  background: $bg-hover;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }

  .artist-image {
    width: 148px;
    height: 148px;
    margin-bottom: 16px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
  }

  h4 {
    color: $text-primary;
    font-size: 1rem;
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    color: $text-secondary;
    font-size: 0.85rem;
    margin: 0;
  }
}

.album-card {
  flex-shrink: 0;
  width: 180px;
  padding: 16px;
  background: $bg-hover;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;

    .play-btn-overlay {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .album-image {
    position: relative;
    width: 148px;
    height: 148px;
    margin-bottom: 16px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      object-fit: cover;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }

    .play-btn-overlay {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, $deezer-purple 0%, $deezer-pink 100%);
      border: none;
      color: white;
      font-size: 1.1rem;
      cursor: pointer;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
  }

  h4 {
    color: $text-primary;
    font-size: 1rem;
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    color: $text-secondary;
    font-size: 0.85rem;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// ========== FULL SONGS LIST ==========
.songs-list {
  padding: 0 24px;
}

.songs-header {
  display: grid;
  grid-template-columns: 40px 1fr 1fr auto 60px;
  gap: 16px;
  padding: 8px 16px;
  color: $text-secondary;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 16px;
}

.song-row-full {
  display: grid;
  grid-template-columns: 40px 1fr 1fr auto 60px;
  gap: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  align-items: center;

  &:hover {
    background: rgba(255,255,255,0.1);

    .col-actions {
      opacity: 1;
    }
  }

  .col-num {
    color: $text-secondary;
    text-align: center;
  }

  .col-title {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;

    img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }

    .song-info {
      display: flex;
      flex-direction: column;
      min-width: 0;

      .song-name {
        color: $text-primary;
        font-size: 0.95rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .song-artist {
        color: $text-secondary;
        font-size: 0.8rem;

        &:hover {
          text-decoration: underline;
          color: $text-primary;
        }
      }
    }
  }

  .col-album {
    color: $text-secondary;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      text-decoration: underline;
      color: $text-primary;
    }
  }

  .col-actions {
    display: flex;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .col-duration {
    color: $text-secondary;
    font-size: 0.85rem;
    text-align: right;
  }
}

// ========== ARTISTS GRID ==========
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  padding: 0 24px;
}

.artist-card-big {
  padding: 20px;
  background: $bg-hover;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }

  .artist-image-big {
    margin-bottom: 16px;

    img {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
  }

  h3 {
    color: $text-primary;
    font-size: 1.1rem;
    margin: 0 0 4px 0;
  }

  p {
    color: $text-secondary;
    font-size: 0.85rem;
    margin: 0;
  }
}

// ========== ALBUMS GRID ==========
.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  padding: 0 24px;
}

.album-card-big {
  padding: 16px;
  background: $bg-hover;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;

    .play-btn-overlay {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .album-image-big {
    position: relative;
    margin-bottom: 16px;

    img {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 4px;
      object-fit: cover;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }

    .play-btn-overlay {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, $deezer-purple 0%, $deezer-pink 100%);
      border: none;
      color: white;
      font-size: 1.3rem;
      cursor: pointer;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 16px rgba(0,0,0,0.3);
    }
  }

  h4 {
    color: $text-primary;
    font-size: 1rem;
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    color: $text-secondary;
    font-size: 0.85rem;
    margin: 0;
  }
}

// ========== EMPTY STATE ==========
.empty-state {
  padding: 24px;
}

.browse-section {
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 20px;
  }
}

.genre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
}

.genre-card {
  aspect-ratio: 1.5;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: scale(1.02);
  }

  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: $text-primary;
  }
}

// ========== NO RESULTS ==========
.no-results {
  text-align: center;
  padding: 80px 20px;

  i {
    font-size: 4rem;
    color: $text-secondary;
    margin-bottom: 24px;
  }

  h3 {
    color: $text-primary;
    font-size: 1.5rem;
    margin: 0 0 8px 0;
  }

  p {
    color: $text-secondary;
    margin: 0;
  }
}

// ========== RESPONSIVE ==========
@media (max-width: 900px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .songs-header,
  .song-row-full {
    grid-template-columns: 30px 1fr auto 50px;

    .col-album {
      display: none;
    }
  }

  .genre-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// ========== TOAST NOTIFICATION ==========
.toast-notification {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #A238FF 0%, #EF5466 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 9999;

  i {
    font-size: 1.2rem;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
