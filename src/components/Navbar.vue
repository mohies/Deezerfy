<template>
  <aside class="sidebar">
    <!-- Logo Section -->
    <div class="sidebar-header">
      <router-link to="/" class="logo-link">
        <img class="logo" src="../imgs/Deezer.png" alt="Deezer Logo" />
        <span class="logo-text">Deezerfy</span>
      </router-link>
    </div>

    <!-- Main Navigation -->
    <nav class="main-nav">
      <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
        <i class="bi bi-house-door-fill"></i>
        <span>Inicio</span>
      </router-link>
      <router-link to="/search" class="nav-item" :class="{ active: $route.path === '/search' }">
        <i class="bi bi-search"></i>
        <span>Buscar</span>
      </router-link>
    </nav>

    <!-- Library Section -->
    <div class="library-section">
      <div class="library-header">
        <div class="library-title">
          <i class="bi bi-collection-fill"></i>
          <span>Tu biblioteca</span>
        </div>
        <button class="add-btn" title="Crear playlist">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>

      <div class="library-content">
        <router-link to="/favorites" class="library-item" :class="{ active: $route.path === '/favorites' }">
          <div class="library-item-cover favorites-cover">
            <i class="bi bi-heart-fill"></i>
          </div>
          <div class="library-item-info">
            <span class="library-item-name">Tus Me Gusta</span>
            <span class="library-item-type">Playlist • {{ favoritesCount }} canciones</span>
          </div>
        </router-link>

        <router-link to="/playlists" class="library-item" :class="{ active: $route.path === '/playlists' }">
          <div class="library-item-cover playlists-cover">
            <i class="bi bi-music-note-list"></i>
          </div>
          <div class="library-item-info">
            <span class="library-item-name">Mis Playlists</span>
            <span class="library-item-type">{{ playlistSongsCount }} canciones</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- User Section -->
    <div class="user-section">
      <div class="user-profile" v-if="user.name">
        <img :src="user.avatar" alt="User Avatar" class="user-avatar" />
        <div class="user-info">
          <span class="user-name">{{ user.name }}</span>
          <span class="user-plan">Free Plan</span>
        </div>
        <button class="logout-btn" @click="logout" title="Cerrar sesión">
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
      <div class="install-app" v-else>
        <i class="bi bi-download"></i>
        <span>Iniciar sesión</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMainStore } from '@/stores/stores';

const userStore = useUserStore();
const mainStore = useMainStore();
const user = userStore.user;

const favoritesCount = computed(() => mainStore.favorites?.length || 0);
const playlistSongsCount = computed(() => mainStore.playlist?.songs?.length || 0);

const logout = () => {
  userStore.clearUser();
  location.reload();
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles.scss' as *;

$deezer-purple: #A238FF;
$deezer-pink: #EF5466;
$sidebar-bg: #0D0D0D;
$card-bg: #1A1A1A;
$hover-bg: #252525;
$text-primary: #ffffff;
$text-secondary: #A0A0A0;

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: $sidebar-bg;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  padding: 0;
}

/* Logo Section */
.sidebar-header {
  padding: 20px 24px;
  
  .logo-link {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    
    &:hover .logo-text {
      color: $text-primary;
    }
  }
  
  .logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
  
  .logo-text {
    font-size: 1.4rem;
    font-weight: 700;
    color: $text-primary;
    letter-spacing: -0.5px;
    transition: color 0.2s;
  }
}

/* Main Navigation */
.main-nav {
  padding: 0 12px 8px;
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    color: $text-secondary;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.2s;
    
    i {
      font-size: 1.4rem;
    }
    
    &:hover {
      color: $text-primary;
    }
    
    &.active {
      color: $text-primary;
      background: $hover-bg;
    }
  }
}

/* Library Section */
.library-section {
  flex: 1;
  background: $card-bg;
  margin: 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.library-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  
  .library-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: $text-secondary;
    font-weight: 600;
    font-size: 0.9rem;
    
    i {
      font-size: 1.3rem;
    }
    
    &:hover {
      color: $text-primary;
      cursor: pointer;
    }
  }
  
  .add-btn {
    background: none;
    border: none;
    color: $text-secondary;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    i {
      font-size: 1.1rem;
    }
    
    &:hover {
      color: $text-primary;
      background: $hover-bg;
    }
  }
}

.library-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px 8px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
}

.library-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s;
  
  &:hover {
    background: $hover-bg;
  }
  
  &.active {
    background: #282828;
  }
}

.library-item-cover {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  i {
    font-size: 1.3rem;
    color: $text-primary;
  }
  
  &.favorites-cover {
    background: linear-gradient(135deg, $deezer-purple, $deezer-pink);
  }
  
  &.playlists-cover {
    background: linear-gradient(135deg, $deezer-pink, #191414);
  }
}

.library-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.library-item-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.library-item-type {
  font-size: 0.8rem;
  color: $text-secondary;
}

/* User Section */
.user-section {
  padding: 12px;
  border-top: 1px solid #282828;
  background: $card-bg;
  margin: 0 8px 8px;
  border-radius: 8px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: $hover-bg;
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-plan {
  font-size: 0.75rem;
  color: $text-secondary;
}

.logout-btn {
  background: none;
  border: none;
  color: $text-secondary;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  i {
    font-size: 1.1rem;
  }
  
  &:hover {
    color: $text-primary;
    background: rgba(255, 255, 255, 0.1);
  }
}

.install-app {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: $text-secondary;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  
  i {
    font-size: 1.2rem;
  }
  
  &:hover {
    color: $text-primary;
    background: $hover-bg;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: fixed;
    top: 0;
    flex-direction: row;
    padding: 8px 16px;
    align-items: center;
    justify-content: space-between;
  }
  
  .sidebar-header {
    padding: 0;
    
    .logo {
      width: 32px;
      height: 32px;
    }
    
    .logo-text {
      display: none;
    }
  }
  
  .main-nav {
    display: flex;
    padding: 0;
    gap: 8px;
    
    .nav-item {
      padding: 8px 12px;
      
      span {
        display: none;
      }
      
      i {
        font-size: 1.2rem;
      }
    }
  }
  
  .library-section {
    display: none;
  }
  
  .user-section {
    display: none;
  }
}
</style>
