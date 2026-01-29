<template>
  <div class="favorites-page">
    <!-- Hero Section -->
    <section class="favorites-hero">
      <div class="hero-gradient"></div>
      <div class="hero-content">
        <div class="hero-cover">
          <i class="bi bi-heart-fill"></i>
        </div>
        <div class="hero-info">
          <span class="hero-label">Playlist</span>
          <h1 class="hero-title">Tus Me Gusta</h1>
          <p class="hero-meta">
            <span class="meta-item">{{ favorites.length }} canciones</span>
            <span class="meta-separator">•</span>
            <span class="meta-item">{{ formatTotalDuration() }}</span>
          </p>
        </div>
      </div>
      <div class="hero-actions">
        <button class="btn-play-all" @click="playAll" :disabled="favorites.length === 0">
          <i class="bi bi-play-fill"></i>
        </button>
        <button class="btn-shuffle" @click="shufflePlay" :disabled="favorites.length === 0">
          <i class="bi bi-shuffle"></i>
        </button>
      </div>
    </section>

    <!-- Songs List -->
    <section class="songs-section" v-if="favorites.length > 0">
      <div class="songs-header">
        <div class="col-num">#</div>
        <div class="col-title">Título</div>
        <div class="col-album">Álbum</div>
        <div class="col-duration">
          <i class="bi bi-clock"></i>
        </div>
        <div class="col-actions"></div>
      </div>

      <div class="songs-list">
        <div 
          v-for="(song, index) in favorites" 
          :key="song.id" 
          class="song-row"
          :class="{ playing: currentSong?.id === song.id }"
          @dblclick="playSong(song)"
        >
          <div class="col-num">
            <span class="track-number">{{ index + 1 }}</span>
            <button class="play-btn-mini" @click="playSong(song)">
              <i class="bi bi-play-fill"></i>
            </button>
          </div>
          <div class="col-title">
            <img :src="song.album?.cover_small || song.album?.cover_medium" :alt="song.title" class="song-cover" />
            <div class="song-info">
              <span class="song-title" :class="{ active: currentSong?.id === song.id }">{{ song.title }}</span>
              <span class="song-artist" @click="navigateToArtist(song.artist?.id)">{{ song.artist?.name }}</span>
            </div>
          </div>
          <div class="col-album">
            <span class="album-name" @click="navigateToAlbum(song.album?.id)">{{ song.album?.title }}</span>
          </div>
          <div class="col-duration">
            {{ formatDuration(song.duration) }}
          </div>
          <div class="col-actions">
            <button class="action-btn active" @click="removeFromFavorites(song.id)" title="Quitar de Me Gusta">
              <i class="bi bi-heart-fill"></i>
            </button>
            <button class="action-btn" @click="addToQueue(song)" title="Añadir a la cola">
              <i class="bi bi-plus-circle"></i>
            </button>
            <button class="action-btn" @click="addToPlaylist(song)" title="Añadir a playlist">
              <i class="bi bi-music-note-list"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <section class="empty-state" v-else>
      <div class="empty-icon">
        <i class="bi bi-heart"></i>
      </div>
      <h2>Aún no tienes canciones favoritas</h2>
      <p>Guarda tus canciones favoritas tocando el icono del corazón</p>
      <router-link to="/search" class="btn-explore">
        <i class="bi bi-search"></i>
        Explorar música
      </router-link>
    </section>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-notification">
        <i class="bi bi-check-circle-fill"></i>
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useMainStore } from '@/stores/stores';
import { useRouter } from 'vue-router';

const store = useMainStore();
const router = useRouter();

const showToast = ref(false);
const toastMessage = ref('');

const favorites = computed(() => store.favorites);
const currentSong = computed(() => store.currentSong);

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatTotalDuration = () => {
  const totalSeconds = favorites.value.reduce((acc, song) => acc + (song.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} h ${mins} min`;
  }
  return `${mins} min`;
};

const playSong = (song) => {
  store.playWithQueue(song, favorites.value);
};

const playAll = () => {
  if (favorites.value.length > 0) {
    store.playWithQueue(favorites.value[0], favorites.value);
  }
};

const shufflePlay = () => {
  if (favorites.value.length > 0) {
    const shuffled = [...favorites.value].sort(() => Math.random() - 0.5);
    store.playWithQueue(shuffled[0], shuffled);
  }
};

const removeFromFavorites = (songId) => {
  store.removeFromFavorites(songId);
  showToastMessage('Eliminado de Me Gusta');
};

const addToQueue = (song) => {
  store.addToQueue(song);
  showToastMessage('Añadido a la cola');
};

const addToPlaylist = (song) => {
  store.addSongToPlaylist(song);
  showToastMessage('Añadido a la playlist');
};

const navigateToArtist = (artistId) => {
  if (artistId) router.push({ name: 'Info', params: { type: 'artist', id: artistId } });
};

const navigateToAlbum = (albumId) => {
  if (albumId) router.push({ name: 'Info', params: { type: 'album', id: albumId } });
};

const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => { showToast.value = false; }, 3000);
};
</script>

<style lang="scss" scoped>
$deezer-purple: #A238FF;
$deezer-pink: #EF5466;
$deezer-gradient: linear-gradient(135deg, #A238FF 0%, #EF5466 100%);
$bg-dark: #121212;
$bg-card: #181818;
$bg-hover: #282828;
$text-primary: #ffffff;
$text-secondary: #b3b3b3;

.favorites-page {
  min-height: 100vh;
  background: $bg-dark;
  padding-bottom: 120px;
}

// ========== HERO SECTION ==========
.favorites-hero {
  position: relative;
  padding: 60px 32px 30px;
  background: linear-gradient(180deg, rgba(162, 56, 255, 0.4) 0%, $bg-dark 100%);
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at top left, rgba($deezer-purple, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.hero-cover {
  width: 232px;
  height: 232px;
  background: $deezer-gradient;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  
  i {
    font-size: 6rem;
    color: $text-primary;
  }
}

.hero-info {
  flex: 1;
  padding-bottom: 10px;
}

.hero-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 10px 0 20px;
  letter-spacing: -2px;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: $text-secondary;
  font-size: 0.95rem;
}

.meta-separator {
  opacity: 0.5;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 32px;
}

.btn-play-all {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $deezer-gradient;
  border: none;
  color: $text-primary;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba($deezer-purple, 0.4);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-shuffle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    color: $text-primary;
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// ========== SONGS LIST ==========
.songs-section {
  padding: 0 32px;
}

.songs-header {
  display: grid;
  grid-template-columns: 50px 4fr 3fr 100px 120px;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);
  color: $text-secondary;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.songs-list {
  margin-top: 8px;
}

.song-row {
  display: grid;
  grid-template-columns: 50px 4fr 3fr 100px 120px;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: $bg-hover;
    
    .track-number { display: none; }
    .play-btn-mini { display: flex; }
    .col-actions { opacity: 1; }
  }
  
  &.playing {
    background: rgba($deezer-purple, 0.15);
  }
}

.col-num {
  display: flex;
  align-items: center;
  justify-content: center;
}

.track-number {
  color: $text-secondary;
  font-size: 0.95rem;
}

.play-btn-mini {
  display: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: $text-primary;
  font-size: 0.9rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.col-title {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.song-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.song-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.song-title {
  font-size: 0.95rem;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &.active {
    color: $deezer-purple;
  }
}

.song-artist {
  font-size: 0.85rem;
  color: $text-secondary;
  cursor: pointer;
  
  &:hover {
    color: $text-primary;
    text-decoration: underline;
  }
}

.col-album {
  min-width: 0;
}

.album-name {
  font-size: 0.9rem;
  color: $text-secondary;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    color: $text-primary;
    text-decoration: underline;
  }
}

.col-duration {
  font-size: 0.9rem;
  color: $text-secondary;
  text-align: right;
}

.col-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.action-btn {
  background: none;
  border: none;
  color: $text-secondary;
  font-size: 1rem;
  cursor: pointer;
  padding: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    color: $text-primary;
    transform: scale(1.1);
  }
  
  &.active {
    color: $deezer-pink;
  }
}

// ========== EMPTY STATE ==========
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: $bg-card;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  
  i {
    font-size: 3.5rem;
    color: $text-secondary;
  }
}

.empty-state h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: $text-primary;
}

.empty-state p {
  color: $text-secondary;
  font-size: 1rem;
  margin: 0 0 30px;
}

.btn-explore {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: $deezer-gradient;
  color: $text-primary;
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 25px rgba($deezer-purple, 0.4);
  }
}

// ========== TOAST ==========
.toast-notification {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: $deezer-gradient;
  color: $text-primary;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

// ========== RESPONSIVE ==========
@media (max-width: 900px) {
  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .hero-cover {
    width: 180px;
    height: 180px;
    
    i { font-size: 4rem; }
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-meta {
    justify-content: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .songs-header {
    display: none;
  }
  
  .song-row {
    grid-template-columns: 1fr auto;
    
    .col-album, .col-duration { display: none; }
    .col-actions { opacity: 1; }
  }
}
</style>
