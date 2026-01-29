<template>
  <div class="home-spotify">
    <!-- Hero Section con gradiente dinámico -->
    <section class="hero-section" :style="heroGradient">
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-badge">🔥 Trending Now</span>
          <h1 class="hero-title">{{ heroSong?.title || 'Descubre Música' }}</h1>
          <p class="hero-artist">{{ heroSong?.artist?.name || 'Los mejores hits del momento' }}</p>
          <div class="hero-actions">
            <button class="btn-play-hero" @click="playHeroSong">
              <i class="bi bi-play-fill"></i> Reproducir
            </button>
            <button class="btn-secondary-hero" @click="navigateToArtist(heroSong?.artist?.id)">
              Ver Artista
            </button>
          </div>
        </div>
        <div class="hero-image-container">
          <img 
            v-if="heroSong" 
            :src="heroSong.album.cover_xl" 
            :alt="heroSong.title"
            class="hero-album-art"
          />
          <div class="hero-glow"></div>
        </div>
      </div>
    </section>

    <!-- Quick Picks - Acceso rápido -->
    <section class="quick-picks">
      <div class="quick-grid">
        <div 
          v-for="song in quickPicks" 
          :key="song.id" 
          class="quick-card"
          @click="playSong(song)"
        >
          <img :src="song.album.cover_medium" :alt="song.title" />
          <span class="quick-title">{{ song.title }}</span>
          <button class="quick-play-btn">
            <i class="bi bi-play-fill"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Top Tracks Section -->
    <section class="music-section">
      <div class="section-header">
        <h2>Top Canciones</h2>
        <span class="see-all" @click="navigateToSearch('tracks')">Ver todo</span>
      </div>
      <div class="horizontal-scroll">
        <div 
          v-for="song in topTracks" 
          :key="song.id" 
          class="track-card"
          @click="playSong(song)"
        >
          <div class="track-image-container">
            <img :src="song.album.cover_xl" :alt="song.title" class="track-image" />
            <div class="track-overlay">
              <button class="play-btn-overlay" @click.stop="playSong(song)">
                <i class="bi bi-play-fill"></i>
              </button>
            </div>
            <span class="track-rank">{{ song.position }}</span>
          </div>
          <div class="track-info">
            <h4 class="track-title">{{ song.title }}</h4>
            <p class="track-artist" @click.stop="navigateToArtist(song.artist.id)">
              {{ song.artist.name }}
            </p>
          </div>
          <div class="track-actions">
            <button 
              class="action-btn" 
              :class="{ active: isFavorite(song) }"
              @click.stop="toggleFavorite(song)"
            >
              <i :class="isFavorite(song) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            </button>
            <button class="action-btn" @click.stop="addToPlaylist(song)">
              <i class="bi bi-plus-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Artists Section -->
    <section class="music-section">
      <div class="section-header">
        <h2>Artistas Populares</h2>
        <span class="see-all">Ver todo</span>
      </div>
      <div class="horizontal-scroll">
        <div 
          v-for="artist in topArtists" 
          :key="artist.id" 
          class="artist-card-spotify"
          @click="navigateToArtist(artist.id)"
        >
          <div class="artist-image-container">
            <img :src="artist.picture_xl" :alt="artist.name" class="artist-image" />
            <div class="artist-overlay">
              <button class="play-btn-overlay small">
                <i class="bi bi-play-fill"></i>
              </button>
            </div>
          </div>
          <h4 class="artist-name">{{ artist.name }}</h4>
          <p class="artist-type">Artista</p>
        </div>
      </div>
    </section>

    <!-- Top Albums Section -->
    <section class="music-section">
      <div class="section-header">
        <h2>Álbumes del Momento</h2>
        <span class="see-all">Ver todo</span>
      </div>
      <div class="horizontal-scroll">
        <div 
          v-for="album in topAlbums" 
          :key="album.id" 
          class="album-card-spotify"
          @click="navigateToAlbum(album.id)"
        >
          <div class="album-image-container">
            <img :src="album.cover_xl" :alt="album.title" class="album-image" />
            <div class="album-overlay">
              <button class="play-btn-overlay">
                <i class="bi bi-play-fill"></i>
              </button>
            </div>
          </div>
          <h4 class="album-title">{{ album.title }}</h4>
          <p class="album-artist" @click.stop="navigateToArtist(album.artist?.id)">
            {{ album.artist?.name }}
          </p>
        </div>
      </div>
    </section>

    <!-- Made For You Section -->
    <section class="music-section featured-section">
      <div class="section-header">
        <h2>Hecho Para Ti</h2>
      </div>
      <div class="featured-grid">
        <div 
          v-for="(song, index) in madeForYou" 
          :key="song.id" 
          class="featured-card"
          :class="{ 'large': index === 0 }"
          @click="playSong(song)"
        >
          <img :src="song.album.cover_xl" :alt="song.title" class="featured-image" />
          <div class="featured-gradient"></div>
          <div class="featured-content">
            <span class="featured-label">{{ index === 0 ? '⭐ Destacado' : 'Para ti' }}</span>
            <h3>{{ song.title }}</h3>
            <p>{{ song.artist.name }}</p>
            <button class="btn-play-featured" @click.stop="playSong(song)">
              <i class="bi bi-play-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Recently Added (simulado) -->
    <section class="music-section">
      <div class="section-header">
        <h2>Añadido Recientemente</h2>
      </div>
      <div class="tracks-list">
        <div 
          v-for="(song, index) in recentTracks" 
          :key="song.id" 
          class="track-row"
          @click="playSong(song)"
        >
          <span class="track-number">{{ index + 1 }}</span>
          <img :src="song.album.cover_small" :alt="song.title" class="track-row-image" />
          <div class="track-row-info">
            <span class="track-row-title">{{ song.title }}</span>
            <span class="track-row-artist">{{ song.artist.name }}</span>
          </div>
          <span class="track-duration">{{ formatDuration(song.duration) }}</span>
          <div class="track-row-actions">
            <button 
              class="action-btn-small" 
              :class="{ active: isFavorite(song) }"
              @click.stop="toggleFavorite(song)"
            >
              <i :class="isFavorite(song) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            </button>
            <button class="action-btn-small" @click.stop="addToPlaylist(song)">
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/stores';

const router = useRouter();
const mainStore = useMainStore();

// Data
const heroSong = ref(null);
const quickPicks = ref([]);
const topTracks = ref([]);
const topArtists = ref([]);
const topAlbums = ref([]);
const madeForYou = ref([]);
const recentTracks = ref([]);

// Computed
const heroGradient = computed(() => {
  if (!heroSong.value) {
    return { background: 'linear-gradient(135deg, #A238FF 0%, #EF5466 30%, #121212 100%)' };
  }
  return {
    background: `linear-gradient(135deg, 
      rgba(162, 56, 255, 0.8) 0%, 
      rgba(239, 84, 102, 0.5) 30%, 
      #121212 100%)`
  };
});

// Methods
const fetchChartData = async () => {
  try {
    const response = await fetch('http://localhost:8080/https://api.deezer.com/chart');
    if (!response.ok) throw new Error('Error fetching chart');
    const data = await response.json();

    const tracks = data.tracks?.data || [];
    const artists = data.artists?.data || [];
    const albums = data.albums?.data || [];

    // Distribute data
    heroSong.value = tracks[0] || null;
    quickPicks.value = tracks.slice(1, 7);
    topTracks.value = tracks.slice(0, 10);
    topArtists.value = artists.slice(0, 8);
    topAlbums.value = albums.slice(0, 8);
    madeForYou.value = tracks.slice(5, 10);
    recentTracks.value = tracks.slice(10, 20);

  } catch (error) {
    console.error('Error loading chart data:', error);
  }
};

const playSong = (song) => {
  if (song) {
    // Crear cola con todas las canciones disponibles del chart
    const allSongs = [
      ...quickPicks.value,
      ...topTracks.value,
      ...madeForYou.value,
      ...recentTracks.value
    ].filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i); // Remove duplicates
    
    mainStore.playWithQueue(song, allSongs);
  }
};

const playHeroSong = () => {
  if (heroSong.value) {
    const allSongs = [
      heroSong.value,
      ...quickPicks.value,
      ...topTracks.value
    ].filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
    
    mainStore.playWithQueue(heroSong.value, allSongs);
  }
};

const isFavorite = (song) => {
  return mainStore.favorites.some(fav => fav.id === song.id);
};

const toggleFavorite = (song) => {
  if (isFavorite(song)) {
    mainStore.removeFromFavorites(song.id);
  } else {
    mainStore.addToFavorites(song);
  }
};

const addToPlaylist = (song) => {
  mainStore.addSongToPlaylist(song);
};

const navigateToArtist = (artistId) => {
  if (artistId) {
    router.push({ name: 'Info', params: { type: 'artist', id: artistId } });
  }
};

const navigateToAlbum = (albumId) => {
  if (albumId) {
    router.push({ name: 'Info', params: { type: 'album', id: albumId } });
  }
};

const navigateToSearch = (type) => {
  router.push({ name: 'Buscador', query: { type } });
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

onMounted(fetchChartData);
</script>

<style lang="scss" scoped>
// Variables - Deezer Theme
$deezer-purple: #A238FF;
$deezer-pink: #EF5466;
$deezer-gradient: linear-gradient(135deg, #A238FF 0%, #EF5466 100%);
$bg-dark: #121212;
$bg-card: #181818;
$bg-card-hover: #282828;
$text-primary: #ffffff;
$text-secondary: #b3b3b3;
$text-muted: #727272;

.home-spotify {
  min-height: 100vh;
  background: $bg-dark;
  color: $text-primary;
  padding-bottom: 100px;
  overflow-x: hidden;
}

// ========== HERO SECTION ==========
.hero-section {
  position: relative;
  padding: 60px 40px 80px;
  border-radius: 0 0 30px 30px;
  margin-bottom: 30px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at top left, rgba($deezer-purple, 0.3) 0%, transparent 50%);
    pointer-events: none;
  }
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  gap: 60px;
  position: relative;
  z-index: 1;
}

.hero-text {
  flex: 1;
  max-width: 600px;
}

.hero-badge {
  display: inline-block;
  background: rgba($deezer-purple, 0.2);
  color: $deezer-pink;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 15px;
  background: linear-gradient(135deg, $text-primary 0%, $text-secondary 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-artist {
  font-size: 1.5rem;
  color: $text-secondary;
  margin: 0 0 30px;
}

.hero-actions {
  display: flex;
  gap: 15px;
}

.btn-play-hero {
  display: flex;
  align-items: center;
  gap: 10px;
  background: $deezer-gradient;
  color: #fff;
  border: none;
  padding: 16px 40px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  i { font-size: 1.3rem; }

  &:hover {
    background: linear-gradient(135deg, #8B2FD9 0%, #d94a5a 100%);
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba($deezer-purple, 0.4);
  }
}

.btn-secondary-hero {
  background: transparent;
  color: $text-primary;
  border: 2px solid rgba($text-primary, 0.3);
  padding: 16px 35px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: $text-primary;
    background: rgba($text-primary, 0.1);
  }
}

.hero-image-container {
  position: relative;
  flex-shrink: 0;
}

.hero-album-art {
  width: 350px;
  height: 350px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
  animation: float 6s ease-in-out infinite;
}

.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba($deezer-purple, 0.3) 0%, transparent 70%);
  filter: blur(60px);
  z-index: -1;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

// ========== QUICK PICKS ==========
.quick-picks {
  padding: 0 40px 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: $bg-card;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.3s ease;
  position: relative;

  &:hover {
    background: $bg-card-hover;

    .quick-play-btn {
      opacity: 1;
      transform: translateY(0);
    }
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .quick-title {
    font-weight: 700;
    font-size: 1rem;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 60px;
  }

  .quick-play-btn {
    position: absolute;
    right: 15px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: $deezer-gradient;
    border: none;
    color: #fff;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);

    &:hover {
      transform: translateY(0) scale(1.1);
    }
  }
}

// ========== MUSIC SECTIONS ==========
.music-section {
  padding: 30px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
  }

  .see-all {
    color: $text-secondary;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover { color: $text-primary; }
  }
}

.horizontal-scroll {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding-bottom: 15px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba($text-secondary, 0.3);
    border-radius: 4px;

    &:hover { background: rgba($text-secondary, 0.5); }
  }
}

// ========== TRACK CARDS ==========
.track-card {
  flex-shrink: 0;
  width: 200px;
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: $bg-card-hover;
    transform: translateY(-5px);

    .track-overlay { opacity: 1; }
    .play-btn-overlay { transform: translateY(0); opacity: 1; }
  }
}

.track-image-container {
  position: relative;
  margin-bottom: 16px;
}

.track-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}

.track-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.play-btn-overlay {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: $deezer-gradient;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: translateY(10px);
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);

  &:hover { transform: scale(1.1) !important; }

  &.small {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

.track-rank {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: $text-primary;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.track-info {
  margin-bottom: 12px;
}

.track-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 0.85rem;
  color: $text-secondary;
  margin: 0;
  cursor: pointer;

  &:hover { color: $text-primary; text-decoration: underline; }
}

.track-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 5px;
  transition: all 0.2s ease;

  &:hover { color: $text-primary; transform: scale(1.2); }
  &.active { color: $deezer-pink; }
}

// ========== ARTIST CARDS ==========
.artist-card-spotify {
  flex-shrink: 0;
  width: 180px;
  background: $bg-card;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: $bg-card-hover;

    .artist-overlay { opacity: 1; }
    .play-btn-overlay { transform: translateY(0); opacity: 1; }
  }
}

.artist-image-container {
  position: relative;
  margin-bottom: 16px;
}

.artist-image {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
  display: block;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.artist-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.artist-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 5px;
}

.artist-type {
  font-size: 0.8rem;
  color: $text-secondary;
  margin: 0;
}

// ========== ALBUM CARDS ==========
.album-card-spotify {
  flex-shrink: 0;
  width: 200px;
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: $bg-card-hover;
    transform: translateY(-5px);

    .album-overlay { opacity: 1; }
    .play-btn-overlay { transform: translateY(0); opacity: 1; }
  }
}

.album-image-container {
  position: relative;
  margin-bottom: 16px;
}

.album-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.album-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-artist {
  font-size: 0.85rem;
  color: $text-secondary;
  margin: 0;
  cursor: pointer;

  &:hover { color: $text-primary; text-decoration: underline; }
}

// ========== FEATURED SECTION ==========
.featured-section {
  margin-top: 20px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 200px);
  gap: 20px;
}

.featured-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &.large {
    grid-column: 1;
    grid-row: 1 / 3;
  }

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);

    .btn-play-featured { opacity: 1; transform: translateY(0); }
  }

  .featured-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .featured-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
  }

  .featured-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 25px;

    .featured-label {
      display: inline-block;
      background: rgba($deezer-purple, 0.3);
      color: $deezer-pink;
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 10px;
    }

    h3 {
      font-size: 1.3rem;
      font-weight: 700;
      margin: 0 0 5px;
    }

    p {
      color: $text-secondary;
      font-size: 0.9rem;
      margin: 0;
    }
  }

  .btn-play-featured {
    position: absolute;
    right: 25px;
    bottom: 25px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: $deezer-gradient;
    border: none;
    color: #fff;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);

    &:hover { transform: scale(1.1); }
  }
}

// ========== TRACKS LIST ==========
.tracks-list {
  background: $bg-card;
  border-radius: 12px;
  overflow: hidden;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: $bg-card-hover;

    .track-row-actions { opacity: 1; }
    .track-number { color: $deezer-purple; }
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba($text-muted, 0.1);
  }
}

.track-number {
  width: 30px;
  font-size: 1rem;
  color: $text-secondary;
  text-align: center;
  font-weight: 500;
}

.track-row-image {
  width: 45px;
  height: 45px;
  border-radius: 4px;
  object-fit: cover;
}

.track-row-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.track-row-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-row-artist {
  font-size: 0.85rem;
  color: $text-secondary;
}

.track-duration {
  color: $text-secondary;
  font-size: 0.9rem;
  min-width: 50px;
  text-align: right;
}

.track-row-actions {
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.action-btn-small {
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 1rem;
  cursor: pointer;
  padding: 5px;
  transition: all 0.2s ease;

  &:hover { color: $text-primary; }
  &.active { color: $deezer-pink; }
}

// ========== RESPONSIVE ==========
@media (max-width: 1200px) {
  .hero-title { font-size: 3rem; }
  .hero-album-art { width: 280px; height: 280px; }
  .featured-grid { grid-template-columns: repeat(2, 1fr); }
  .featured-card.large { grid-row: 1; }
}

@media (max-width: 900px) {
  .hero-section { padding: 40px 25px 60px; }
  .hero-content { flex-direction: column-reverse; gap: 40px; text-align: center; }
  .hero-text { max-width: 100%; }
  .hero-title { font-size: 2.5rem; }
  .hero-actions { justify-content: center; }
  .hero-album-art { width: 220px; height: 220px; }
  
  .quick-picks, .music-section { padding: 20px 20px; }
  .quick-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
  
  .featured-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, 180px);
  }
  .featured-card.large { grid-row: 1; }
}

@media (max-width: 600px) {
  .hero-title { font-size: 2rem; }
  .hero-artist { font-size: 1.1rem; }
  .btn-play-hero, .btn-secondary-hero { padding: 12px 25px; font-size: 0.95rem; }
  
  .section-header h2 { font-size: 1.4rem; }
  
  .track-card, .album-card-spotify { width: 160px; padding: 12px; }
  .artist-card-spotify { width: 140px; padding: 15px; }
  .artist-image { width: 100px; height: 100px; }
  
  .track-row { padding: 10px 15px; gap: 12px; }
  .track-row-image { width: 40px; height: 40px; }
  .track-duration { display: none; }
}
</style>