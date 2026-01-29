<template>
  <div class="music-player" :class="{ 'no-song': !currentSong, 'expanded': isExpanded }">
    
    <!-- Modal de imagen grande -->
    <Transition name="image-modal">
      <div class="image-modal-overlay" v-if="showImageModal" @click="showImageModal = false">
        <div class="image-modal-content" @click.stop>
          <button class="close-modal-btn" @click="showImageModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
          <img 
            v-if="currentSong" 
            :src="currentSong?.album?.cover_xl || currentSong?.album?.cover_big" 
            alt="Album cover" 
            class="modal-album-cover"
          />
          <div class="modal-song-info">
            <h2>{{ currentSong?.title }}</h2>
            <p>{{ currentSong?.artist?.name }}</p>
            <span class="modal-album-name">{{ currentSong?.album?.title }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Vista Expandida -->
    <div class="expanded-view" v-if="isExpanded">
      <div class="expanded-content">
        <div class="expanded-left">
          <img v-if="currentSong" :src="currentSong?.album?.cover_xl || currentSong?.album?.cover_big" alt="Album cover" class="expanded-cover" />
          <div v-else class="expanded-cover empty">
            <i class="bi bi-music-note-beamed"></i>
          </div>
          <h2 class="expanded-title">{{ currentSong?.title || 'No hay canción' }}</h2>
          <p class="expanded-artist">{{ currentSong?.artist?.name || 'Selecciona una canción' }}</p>
        </div>
        <div class="expanded-right">
          <div class="queue-header">
            <h3><i class="bi bi-music-note-list"></i> Cola de reproducción</h3>
            <span class="queue-count">{{ queue.length }} canciones</span>
          </div>
          <div class="queue-list">
            <div 
              v-for="(song, index) in queue" 
              :key="song.id" 
              class="queue-item"
              :class="{ active: index === queueIndex }"
              @click="playFromQueue(index)"
            >
              <span class="queue-number">{{ index + 1 }}</span>
              <img :src="song.album?.cover_small" alt="" class="queue-cover" />
              <div class="queue-info">
                <span class="queue-song-title">{{ song.title }}</span>
                <span class="queue-song-artist">{{ song.artist?.name }}</span>
              </div>
              <span class="queue-duration">0:30</span>
            </div>
          </div>
        </div>
      </div>
      <button class="close-expanded" @click="isExpanded = false">
        <i class="bi bi-chevron-down"></i>
      </button>
    </div>

    <!-- Player Principal -->
    <div class="player-main">
      <!-- Left: Song Info -->
      <div class="player-left">
        <div class="album-cover" @click="openImageModal">
          <img v-if="currentSong" :src="currentSong?.album?.cover_medium" alt="Album cover" />
          <div v-else class="empty-cover">
            <i class="bi bi-music-note-beamed"></i>
          </div>
          <div class="cover-overlay" v-if="currentSong">
            <i class="bi bi-arrows-fullscreen"></i>
          </div>
        </div>
        <div class="player-info">
          <h3 class="song-title" @click="navigateToAlbum">{{ currentSong?.title || 'No hay canción' }}</h3>
          <p class="artist-name" @click="navigateToArtist">{{ currentSong?.artist?.name || 'Selecciona una canción' }}</p>
        </div>
        <button 
          v-if="currentSong"
          class="like-btn"
          :class="{ active: isFavorite }"
          @click="toggleFavorite"
        >
          <i :class="isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </button>
      </div>

      <!-- Center: Controls -->
      <div class="player-center">
        <div class="control-buttons">
          <button class="control-btn" @click="shuffle" :class="{ active: isShuffled }">
            <i class="bi bi-shuffle"></i>
          </button>
          <button class="control-btn" @click="previousSong">
            <i class="bi bi-skip-start-fill"></i>
          </button>
          <button class="play-btn" @click="togglePlay" :disabled="!currentSong">
            <i class="bi" :class="isPlaying ? 'bi-pause-fill' : 'bi-play-fill'"></i>
          </button>
          <button class="control-btn" @click="nextSong">
            <i class="bi bi-skip-end-fill"></i>
          </button>
          <button class="control-btn" @click="toggleRepeat" :class="{ active: repeatMode !== 'off' }">
            <i class="bi" :class="repeatMode === 'one' ? 'bi-repeat-1' : 'bi-repeat'"></i>
          </button>
        </div>
        <div class="progress-container">
          <span class="time-current">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <input 
              type="range" 
              v-model="currentTime" 
              :max="duration || 30" 
              class="progress-bar" 
              @input="seek"
              :disabled="!currentSong"
            />
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="time-total">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Right: Volume & Extra -->
      <div class="player-right">
        <div class="queue-container">
          <button class="control-btn" @click="toggleQueuePopup" :class="{ active: showQueuePopup }">
            <i class="bi bi-music-note-list"></i>
          </button>
          
          <!-- Mini Queue Popup -->
          <transition name="queue-popup">
            <div class="queue-popup" v-if="showQueuePopup">
              <div class="queue-popup-header">
                <h4>Cola de reproducción</h4>
                <span class="queue-popup-count">{{ queue.length }} canciones</span>
                <button class="close-queue-btn" @click="showQueuePopup = false">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <div class="queue-popup-list" v-if="queue.length">
                <div 
                  v-for="(song, index) in queue" 
                  :key="song.id" 
                  class="queue-popup-item"
                  :class="{ active: index === queueIndex }"
                  @click="playFromQueue(index)"
                >
                  <span class="queue-popup-num">{{ index + 1 }}</span>
                  <img :src="song.album?.cover_small" alt="" />
                  <div class="queue-popup-info">
                    <span class="queue-popup-title">{{ song.title }}</span>
                    <span class="queue-popup-artist">{{ song.artist?.name }}</span>
                  </div>
                  <button class="remove-from-queue" @click.stop="removeFromQueue(index)">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
              <div class="queue-popup-empty" v-else>
                <i class="bi bi-music-note-list"></i>
                <p>La cola está vacía</p>
                <span>Añade canciones desde el buscador o artistas</span>
              </div>
            </div>
          </transition>
        </div>
        <button class="control-btn" @click="toggleMute">
          <i class="bi" :class="volumeIcon"></i>
        </button>
        <div class="volume-wrapper">
          <input 
            type="range" 
            v-model="volume" 
            min="0" 
            max="100" 
            class="volume-bar"
            @input="changeVolume"
          />
          <div class="volume-fill" :style="{ width: volume + '%' }"></div>
        </div>
        <button class="control-btn expand-btn" @click="toggleExpand">
          <i class="bi bi-arrows-fullscreen"></i>
        </button>
      </div>
    </div>

    <!-- Audio Element -->
    <audio 
      ref="audio" 
      :src="currentSong?.preview" 
      @ended="handleEnded" 
      @timeupdate="updateProgress"
      @loadedmetadata="onLoadedMetadata"
      v-if="currentSong"
    ></audio>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/stores';

const store = useMainStore();
const router = useRouter();

// State
const currentSong = computed(() => store.getCurrentSong);
const queue = computed(() => store.getQueue);
const queueIndex = computed(() => store.getQueueIndex);
const audio = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(30);
const volume = ref(80);
const previousVolume = ref(80);
const isShuffled = computed(() => store.isShuffled);
const repeatMode = ref('off'); // 'off', 'all', 'one'
const isExpanded = ref(false);
const showQueuePopup = ref(false);
const showImageModal = ref(false);

// Computed
const isFavorite = computed(() => {
  if (!currentSong.value) return false;
  return store.favorites.some(fav => fav.id === currentSong.value.id);
});

const progressPercent = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

const volumeIcon = computed(() => {
  if (volume.value === 0) return 'bi-volume-mute-fill';
  if (volume.value < 50) return 'bi-volume-down-fill';
  return 'bi-volume-up-fill';
});

// Watchers
watch(currentSong, (newSong) => {
  if (audio.value) {
    audio.value.pause();
    audio.value.currentTime = 0;
  }

  if (newSong) {
    duration.value = 30; // Preview duration
    isPlaying.value = true;

    setTimeout(() => {
      if (audio.value) {
        audio.value.volume = volume.value / 100;
        audio.value.play().catch(() => {});
      }
    }, 100);
  } else {
    isPlaying.value = false;
  }
});

watch(volume, (newVolume) => {
  if (audio.value) {
    audio.value.volume = newVolume / 100;
  }
});

// Methods
const togglePlay = () => {
  if (audio.value) {
    if (isPlaying.value) {
      audio.value.pause();
    } else {
      audio.value.play().catch(() => {});
    }
    isPlaying.value = !isPlaying.value;
  }
};

const seek = () => {
  if (audio.value) {
    audio.value.currentTime = currentTime.value;
  }
};

const updateProgress = () => {
  if (audio.value) {
    currentTime.value = audio.value.currentTime;
  }
};

const onLoadedMetadata = () => {
  if (audio.value) {
    duration.value = audio.value.duration || 30;
    audio.value.volume = volume.value / 100;
  }
};

const handleEnded = () => {
  if (repeatMode.value === 'one') {
    audio.value.currentTime = 0;
    audio.value.play().catch(() => {});
  } else if (repeatMode.value === 'all' || store.hasNextSong) {
    // Si hay siguiente canción o está en modo repeat all, pasar a la siguiente
    store.nextSong();
  } else {
    // Si no hay más canciones y no es repeat, parar
    isPlaying.value = false;
  }
};

const nextSong = () => {
  // Usar el sistema de cola del store
  const next = store.nextSong();
  if (next) {
    isPlaying.value = true;
  }
};

const previousSong = () => {
  // Si han pasado más de 3 segundos, reiniciar la canción actual
  if (audio.value && currentTime.value > 3) {
    audio.value.currentTime = 0;
  } else {
    // Si no, ir a la canción anterior
    const prev = store.previousSong();
    if (prev) {
      isPlaying.value = true;
    }
  }
};

const toggleMute = () => {
  if (volume.value > 0) {
    previousVolume.value = volume.value;
    volume.value = 0;
  } else {
    volume.value = previousVolume.value;
  }
};

const changeVolume = () => {
  if (audio.value) {
    audio.value.volume = volume.value / 100;
  }
};

const shuffle = () => {
  store.toggleShuffle();
};

const toggleRepeat = () => {
  const modes = ['off', 'all', 'one'];
  const currentIndex = modes.indexOf(repeatMode.value);
  repeatMode.value = modes[(currentIndex + 1) % modes.length];
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const openImageModal = () => {
  if (currentSong.value) {
    showImageModal.value = true;
  }
};

const playFromQueue = (index) => {
  store.playSongAtIndex(index);
  isPlaying.value = true;
};

const toggleQueuePopup = () => {
  showQueuePopup.value = !showQueuePopup.value;
};

const removeFromQueue = (index) => {
  store.removeFromQueueAtIndex(index);
};

const toggleFullscreen = () => {
  isExpanded.value = !isExpanded.value;
};

const toggleFavorite = () => {
  if (!currentSong.value) return;
  if (isFavorite.value) {
    store.removeFromFavorites(currentSong.value.id);
  } else {
    store.addToFavorites(currentSong.value);
  }
};

const navigateToArtist = () => {
  if (currentSong.value?.artist?.id) {
    router.push({ name: 'Info', params: { type: 'artist', id: currentSong.value.artist.id } });
  }
};

const navigateToAlbum = () => {
  if (currentSong.value?.album?.id) {
    router.push({ name: 'Info', params: { type: 'album', id: currentSong.value.album.id } });
  }
};

const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
</script>

<style lang="scss" scoped>
$deezer-purple: #A238FF;
$deezer-pink: #EF5466;
$deezer-gradient: linear-gradient(135deg, #A238FF 0%, #EF5466 100%);
$bg-player: #181818;
$bg-player-border: #282828;
$text-primary: #ffffff;
$text-secondary: #b3b3b3;

// ========== IMAGE MODAL ==========
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.image-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  cursor: default;
  max-width: 90vw;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.close-modal-btn {
  position: fixed;
  top: 30px;
  right: 30px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: $text-primary;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.modal-album-cover {
  width: min(500px, 80vw);
  height: min(500px, 80vw);
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
}

.modal-song-info {
  text-align: center;
  
  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0 0 8px;
    color: $text-primary;
  }
  
  p {
    font-size: 1.2rem;
    color: $text-secondary;
    margin: 0 0 4px;
  }
  
  .modal-album-name {
    font-size: 0.95rem;
    color: rgba($text-secondary, 0.7);
  }
}

.image-modal-enter-active,
.image-modal-leave-active {
  transition: all 0.3s ease;
}

.image-modal-enter-from,
.image-modal-leave-to {
  opacity: 0;
  
  .image-modal-content {
    transform: scale(0.8);
  }
}

.music-player {
  position: fixed;
  bottom: 0;
  left: 250px; // Deja espacio para el sidebar
  right: 0;
  height: 90px;
  background: $bg-player;
  border-top: 1px solid $bg-player-border;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 16px;
  transition: all 0.3s ease;

  &.no-song {
    .player-center, .player-right {
      opacity: 0.4;
      pointer-events: none;
    }
  }
}

.player-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

// ========== LEFT SECTION ==========
.player-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 180px;
  width: 30%;
}

.album-cover {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .empty-cover {
    width: 100%;
    height: 100%;
    background: #282828;
    display: flex;
    align-items: center;
    justify-content: center;
    
    i {
      color: $text-secondary;
      font-size: 1.5rem;
    }
  }

  .cover-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;

    i { color: $text-primary; font-size: 1.2rem; }
  }

  &:hover .cover-overlay {
    opacity: 1;
  }
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  min-width: 0;
}

.song-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: $text-primary;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}

.artist-name {
  font-size: 0.75rem;
  color: $text-secondary;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    color: $text-primary;
    text-decoration: underline;
  }
}

.like-btn {
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover { color: $text-primary; transform: scale(1.1); }
  &.active { color: $deezer-pink; }
}

// ========== CENTER SECTION ==========
.player-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 722px;
  width: 40%;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;
  border-radius: 50%;

  &:hover { color: $text-primary; transform: scale(1.1); }
  &.active { color: $deezer-purple; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
}

.play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: $text-primary;
  border: none;
  color: #000;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) { 
    transform: scale(1.08); 
    background: $text-primary;
  }
  
  &:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
  }
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.time-current, .time-total {
  font-size: 0.7rem;
  color: $text-secondary;
  min-width: 40px;
  text-align: center;
}

.time-current { text-align: right; }
.time-total { text-align: left; }

.progress-bar-wrapper {
  position: relative;
  flex: 1;
  height: 4px;
  background: #4d4d4d;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    height: 6px;
    
    .progress-fill { background: $deezer-purple; }
    .progress-bar::-webkit-slider-thumb { opacity: 1; }
  }
}

.progress-bar {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $text-primary;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: $text-primary;
  border-radius: 2px;
  pointer-events: none;
  transition: background 0.2s ease;
}

// ========== RIGHT SECTION ==========
.player-right {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
  width: 30%;
  justify-content: flex-end;
  position: relative;
}

.queue-container {
  position: relative;
}

// ========== QUEUE POPUP ==========
.queue-popup {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 350px;
  max-height: 400px;
  background: #282828;
  border-radius: 8px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 1000;
}

.queue-popup-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h4 {
    flex: 1;
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: $text-primary;
  }

  .queue-popup-count {
    color: $text-secondary;
    font-size: 0.8rem;
    margin-right: 12px;
  }

  .close-queue-btn {
    background: none;
    border: none;
    color: $text-secondary;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 4px;

    &:hover {
      color: $text-primary;
    }
  }
}

.queue-popup-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }
}

.queue-popup-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);

    .remove-from-queue {
      opacity: 1;
    }
  }

  &.active {
    background: rgba(162, 56, 255, 0.2);

    .queue-popup-title {
      color: $deezer-purple;
    }

    .queue-popup-num {
      color: $deezer-purple;
    }
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    object-fit: cover;
  }
}

.queue-popup-num {
  width: 20px;
  text-align: center;
  color: $text-secondary;
  font-size: 0.85rem;
}

.queue-popup-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.queue-popup-title {
  color: $text-primary;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.queue-popup-artist {
  color: $text-secondary;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-from-queue {
  background: none;
  border: none;
  color: $text-secondary;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  padding: 4px;

  &:hover {
    color: #ff4444;
    transform: scale(1.1);
  }
}

.queue-popup-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;

  i {
    font-size: 3rem;
    color: $text-secondary;
    margin-bottom: 16px;
  }

  p {
    color: $text-primary;
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  span {
    color: $text-secondary;
    font-size: 0.85rem;
  }
}

// Queue popup animation
.queue-popup-enter-active,
.queue-popup-leave-active {
  transition: all 0.2s ease;
}

.queue-popup-enter-from,
.queue-popup-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.volume-wrapper {
  position: relative;
  width: 100px;
  height: 4px;
  background: #4d4d4d;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    .volume-fill { background: $deezer-purple; }
    .volume-bar::-webkit-slider-thumb { opacity: 1; }
  }
}

.volume-bar {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $text-primary;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
}

.volume-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: $text-primary;
  border-radius: 2px;
  pointer-events: none;
  transition: background 0.2s ease;
}

// ========== EXPANDED VIEW ==========
.music-player.expanded {
  height: 100vh;
  left: 250px;
  top: 0;
  bottom: 0;
  flex-direction: column;
  padding: 0;
  background: linear-gradient(180deg, #1a1a1a 0%, #121212 100%);
}

.expanded-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.expanded-content {
  display: flex;
  flex: 1;
  padding: 40px;
  gap: 60px;
  overflow: hidden;
}

.expanded-left {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.expanded-cover {
  width: 350px;
  height: 350px;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
  object-fit: cover;
  margin-bottom: 30px;

  &.empty {
    background: #282828;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 5rem;
      color: $text-secondary;
    }
  }
}

.expanded-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 10px 0;
  text-align: center;
}

.expanded-artist {
  font-size: 1.2rem;
  color: $text-secondary;
  margin: 0;
}

.expanded-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.queue-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    font-size: 1.3rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .queue-count {
    color: $text-secondary;
    font-size: 0.9rem;
  }
}

.queue-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }
}

.queue-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: rgba(162, 56, 255, 0.2);

    .queue-song-title {
      color: $deezer-purple;
    }
  }
}

.queue-number {
  width: 24px;
  text-align: center;
  color: $text-secondary;
  font-size: 0.85rem;
}

.queue-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.queue-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.queue-song-title {
  font-size: 0.95rem;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.queue-song-artist {
  font-size: 0.8rem;
  color: $text-secondary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.queue-duration {
  color: $text-secondary;
  font-size: 0.85rem;
}

.close-expanded {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: $text-primary;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.music-player.expanded .player-main {
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
}

// ========== RESPONSIVE ==========
@media (max-width: 900px) {
  .player-right {
    .volume-wrapper { display: none; }
    .expand-btn { display: none; }
    gap: 8px;
  }

  .player-left { width: 35%; }
  .player-center { width: 50%; }
  .player-right { width: 15%; min-width: auto; }
}

@media (max-width: 600px) {
  .music-player {
    height: 70px;
    padding: 0 12px;
  }

  .album-cover {
    width: 48px;
    height: 48px;
  }

  .player-left {
    width: 50%;
    gap: 10px;
  }

  .like-btn { display: none; }

  .player-center {
    width: 40%;
  }

  .control-buttons {
    gap: 8px;

    .control-btn:not(.play-btn) {
      &:first-child, &:last-child { display: none; }
    }
  }

  .progress-container { display: none; }

  .player-right {
    width: 10%;
    
    .control-btn:not(:last-child) { display: none; }
  }

  .control-btn { font-size: 0.9rem; padding: 6px; }
  .play-btn { width: 32px; height: 32px; font-size: 1rem; }
}
</style>