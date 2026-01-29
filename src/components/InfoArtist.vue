<template>
  <div class="artist-page" v-if="artist">
    <!-- Hero Section con gradiente -->
    <section class="artist-hero" :style="heroBackground">
      <div class="hero-gradient"></div>
      <div class="hero-content">
        <div class="artist-image-wrapper">
          <img :src="artist.picture_xl" :alt="artist.name" class="artist-main-image" />
        </div>
        <div class="artist-info">
          <span class="verified-badge" v-if="artist.nb_fan > 1000000">
            <i class="bi bi-patch-check-fill"></i> Artista verificado
          </span>
          <h1 class="artist-name">{{ artist.name }}</h1>
          <div class="artist-stats">
            <span class="stat">
              <i class="bi bi-people-fill"></i>
              {{ formatNumber(artist.nb_fan) }} seguidores
            </span>
            <span class="stat" v-if="artist.nb_album">
              <i class="bi bi-disc-fill"></i>
              {{ artist.nb_album }} álbumes
            </span>
          </div>
          <div class="artist-actions">
            <button class="btn-play-artist" @click="playTopTrack">
              <i class="bi bi-play-fill"></i> Reproducir
            </button>
            <button class="btn-follow">
              <i class="bi bi-person-plus-fill"></i> Seguir
            </button>
            <button class="btn-more">
              <i class="bi bi-three-dots"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Tracks Section -->
    <section class="content-section" v-if="topTracks.length">
      <h2 class="section-title">Populares</h2>
      <div class="tracks-list">
        <div 
          v-for="(track, index) in topTracks.slice(0, 5)" 
          :key="track.id" 
          class="track-row"
          @click="playSong(track)"
        >
          <span class="track-number">{{ index + 1 }}</span>
          <img :src="track.album.cover_small" :alt="track.title" class="track-cover" />
          <div class="track-info">
            <span class="track-title">{{ track.title }}</span>
            <span class="track-album">{{ track.album.title }}</span>
          </div>
          <span class="track-plays" v-if="track.rank">
            {{ formatNumber(track.rank) }}
          </span>
          <span class="track-duration">{{ formatDuration(track.duration) }}</span>
          <div class="track-actions">
            <button 
              class="action-btn" 
              :class="{ active: isFavorite(track) }"
              @click.stop="toggleFavorite(track)"
            >
              <i :class="isFavorite(track) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            </button>
            <button class="action-btn" @click.stop="addToQueue(track)" title="Añadir a la cola">
              <i class="bi bi-collection-play"></i>
            </button>
            <button class="action-btn" @click.stop="addToPlaylist(track)">
              <i class="bi bi-plus-circle"></i>
            </button>
          </div>
        </div>
        <button 
          v-if="topTracks.length > 5" 
          class="show-more-btn"
          @click="showAllTracks = !showAllTracks"
        >
          {{ showAllTracks ? 'Mostrar menos' : 'Ver más' }}
        </button>
        <template v-if="showAllTracks">
          <div 
            v-for="(track, index) in topTracks.slice(5)" 
            :key="track.id" 
            class="track-row"
            @click="playSong(track)"
          >
            <span class="track-number">{{ index + 6 }}</span>
            <img :src="track.album.cover_small" :alt="track.title" class="track-cover" />
            <div class="track-info">
              <span class="track-title">{{ track.title }}</span>
              <span class="track-album">{{ track.album.title }}</span>
            </div>
            <span class="track-plays" v-if="track.rank">
              {{ formatNumber(track.rank) }}
            </span>
            <span class="track-duration">{{ formatDuration(track.duration) }}</span>
            <div class="track-actions">
              <button 
                class="action-btn" 
                :class="{ active: isFavorite(track) }"
                @click.stop="toggleFavorite(track)"
              >
                <i :class="isFavorite(track) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
              </button>
              <button class="action-btn" @click.stop="addToQueue(track)" title="Añadir a la cola">
                <i class="bi bi-collection-play"></i>
              </button>
              <button class="action-btn" @click.stop="addToPlaylist(track)">
                <i class="bi bi-plus-circle"></i>
              </button>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- Albums Section -->
    <section class="content-section" v-if="albums.length">
      <div class="section-header">
        <h2 class="section-title">Discografía</h2>
        <span class="see-all">Mostrar todo</span>
      </div>
      <div class="albums-grid">
        <div 
          v-for="album in albums.slice(0, 6)" 
          :key="album.id" 
          class="album-card"
          @click="navigateToAlbum(album.id)"
        >
          <div class="album-image-container">
            <img :src="album.cover_xl || album.cover_big || album.cover_medium" :alt="album.title" class="album-cover" />
            <div class="album-overlay">
              <button class="play-btn-overlay">
                <i class="bi bi-play-fill"></i>
              </button>
            </div>
          </div>
          <h4 class="album-title">{{ album.title }}</h4>
          <p class="album-year">{{ album.release_date?.split('-')[0] || 'Álbum' }}</p>
        </div>
      </div>
    </section>

    <!-- Related Artists (si disponible) -->
    <section class="content-section" v-if="relatedArtists.length">
      <div class="section-header">
        <h2 class="section-title">Fans también escuchan</h2>
      </div>
      <div class="artists-grid">
        <div 
          v-for="relArtist in relatedArtists.slice(0, 6)" 
          :key="relArtist.id" 
          class="related-artist-card"
          @click="navigateToArtist(relArtist.id)"
        >
          <div class="related-artist-image-container">
            <img :src="relArtist.picture_xl || relArtist.picture_big" :alt="relArtist.name" class="related-artist-image" />
            <div class="artist-overlay">
              <button class="play-btn-overlay small">
                <i class="bi bi-play-fill"></i>
              </button>
            </div>
          </div>
          <h4 class="related-artist-name">{{ relArtist.name }}</h4>
          <p class="related-artist-type">Artista</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '@/stores/stores';

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();

// Data
const artist = ref(null);
const albums = ref([]);
const topTracks = ref([]);
const relatedArtists = ref([]);
const showAllTracks = ref(false);

// Computed
const heroBackground = computed(() => {
  if (!artist.value?.picture_xl) {
    return { background: 'linear-gradient(135deg, #A238FF 0%, #EF5466 50%, #121212 100%)' };
  }
  return {
    backgroundImage: `url(${artist.value.picture_xl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top'
  };
});

// Methods
const fetchArtist = async (artistId) => {
  try {
    const response = await fetch(`http://localhost:8080/https://api.deezer.com/artist/${artistId}`);
    if (!response.ok) throw new Error('Error fetching artist');
    artist.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchAlbums = async (artistId) => {
  try {
    const response = await fetch(`http://localhost:8080/https://api.deezer.com/artist/${artistId}/albums`);
    if (!response.ok) throw new Error('Error fetching albums');
    const data = await response.json();
    albums.value = data.data || [];
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchTopTracks = async (artistId) => {
  try {
    const response = await fetch(`http://localhost:8080/https://api.deezer.com/artist/${artistId}/top?limit=10`);
    if (!response.ok) throw new Error('Error fetching top tracks');
    const data = await response.json();
    topTracks.value = data.data || [];
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchRelatedArtists = async (artistId) => {
  try {
    const response = await fetch(`http://localhost:8080/https://api.deezer.com/artist/${artistId}/related`);
    if (!response.ok) throw new Error('Error fetching related artists');
    const data = await response.json();
    relatedArtists.value = data.data || [];
  } catch (error) {
    console.error('Error:', error);
  }
};

const playSong = (song) => {
  // Reproducir con cola de las top tracks del artista
  mainStore.playWithQueue(song, topTracks.value);
};

const playTopTrack = () => {
  if (topTracks.value.length > 0) {
    // Reproducir primera canción con toda la cola
    mainStore.playWithQueue(topTracks.value[0], topTracks.value);
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

const addToQueue = (song) => {
  mainStore.addToQueue(song);
};

const navigateToAlbum = (albumId) => {
  router.push({ name: 'Info', params: { type: 'album', id: albumId } });
};

const navigateToArtist = (artistId) => {
  router.push({ name: 'Info', params: { type: 'artist', id: artistId } });
};

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

onMounted(() => {
  const artistId = route.params.id;
  fetchArtist(artistId);
  fetchAlbums(artistId);
  fetchTopTracks(artistId);
  fetchRelatedArtists(artistId);
});
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

.artist-page {
  min-height: 100vh;
  background: $bg-dark;
  color: $text-primary;
  padding-bottom: 100px;
}

// ========== HERO SECTION ==========
.artist-hero {
  position: relative;
  padding: 120px 40px 40px;
  min-height: 400px;
  display: flex;
  align-items: flex-end;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    $bg-dark 100%
  );
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.artist-image-wrapper {
  flex-shrink: 0;
}

.artist-main-image {
  width: 230px;
  height: 230px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 4px solid rgba($text-primary, 0.1);
}

.artist-info {
  flex: 1;
  padding-bottom: 10px;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #3d91f4;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 10px;

  i { font-size: 1.1rem; }
}

.artist-name {
  font-size: 5rem;
  font-weight: 900;
  margin: 0 0 15px;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.artist-stats {
  display: flex;
  gap: 25px;
  margin-bottom: 25px;

  .stat {
    display: flex;
    align-items: center;
    gap: 8px;
    color: $text-secondary;
    font-size: 1rem;

    i { color: $deezer-purple; }
  }
}

.artist-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-play-artist {
  display: flex;
  align-items: center;
  gap: 8px;
  background: $deezer-gradient;
  color: #fff;
  border: none;
  padding: 14px 35px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  i { font-size: 1.2rem; }

  &:hover {
    background: linear-gradient(135deg, #8B2FD9 0%, #d94a5a 100%);
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba($deezer-purple, 0.4);
  }
}

.btn-follow {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: $text-primary;
  border: 2px solid rgba($text-primary, 0.4);
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: $text-primary;
    background: rgba($text-primary, 0.1);
  }
}

.btn-more {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { color: $text-primary; }
}

// ========== CONTENT SECTIONS ==========
.content-section {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 25px;
}

.section-header .section-title {
  margin: 0;
}

.see-all {
  color: $text-secondary;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover { color: $text-primary; }
}

// ========== TRACKS LIST ==========
.tracks-list {
  background: transparent;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba($text-primary, 0.1);

    .track-actions { opacity: 1; }
    .track-number { opacity: 0; }
  }
}

.track-number {
  width: 20px;
  font-size: 1rem;
  color: $text-secondary;
  text-align: center;
  transition: opacity 0.2s ease;
}

.track-cover {
  width: 45px;
  height: 45px;
  border-radius: 4px;
  object-fit: cover;
}

.track-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.track-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-album {
  font-size: 0.85rem;
  color: $text-secondary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-plays {
  color: $text-secondary;
  font-size: 0.9rem;
  min-width: 80px;
  text-align: right;
}

.track-duration {
  color: $text-secondary;
  font-size: 0.9rem;
  min-width: 50px;
  text-align: right;
}

.track-actions {
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
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

.show-more-btn {
  background: transparent;
  border: none;
  color: $text-secondary;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 15px 0;
  cursor: pointer;
  transition: color 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover { color: $text-primary; }
}

// ========== ALBUMS GRID ==========
.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

.album-card {
  background: $bg-card;
  border-radius: 10px;
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

.album-cover {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.album-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
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

.album-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-year {
  font-size: 0.85rem;
  color: $text-secondary;
  margin: 0;
}

// ========== RELATED ARTISTS ==========
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 25px;
}

.related-artist-card {
  background: $bg-card;
  border-radius: 10px;
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

.related-artist-image-container {
  position: relative;
  margin-bottom: 16px;
}

.related-artist-image {
  width: 120px;
  height: 120px;
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

.related-artist-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 5px;
}

.related-artist-type {
  font-size: 0.8rem;
  color: $text-secondary;
  margin: 0;
}

// ========== RESPONSIVE ==========
@media (max-width: 900px) {
  .artist-hero {
    padding: 100px 25px 30px;
    min-height: 350px;
  }

  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .artist-main-image {
    width: 180px;
    height: 180px;
  }

  .artist-name {
    font-size: 3rem;
  }

  .artist-stats {
    justify-content: center;
  }

  .artist-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .content-section {
    padding: 30px 20px;
  }

  .albums-grid, .artists-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 600px) {
  .artist-name {
    font-size: 2.2rem;
  }

  .artist-main-image {
    width: 150px;
    height: 150px;
  }

  .track-plays { display: none; }
  .track-album { display: none; }

  .album-card, .related-artist-card {
    padding: 12px;
  }

  .related-artist-image {
    width: 90px;
    height: 90px;
  }
}
</style>