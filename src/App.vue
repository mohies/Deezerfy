<script setup>
import { ref, onMounted, watch } from 'vue';
import Menu from "./components/Navbar.vue";
import MusicPlayer from './components/MusicPlayer.vue';
import WelcomeModal from './components/WelcomeModal.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const isUserLoggedIn = ref(!!userStore.user.name);

watch(() => userStore.user.name, (newName) => {
  isUserLoggedIn.value = !!newName;
});
</script>

<template>
  <div id="app">
    <div class="layout">
      <!-- Sidebar Fijo -->
      <Menu />

      <!-- Contenido Principal -->
      <div class="main-content">
        <header class="header">
          <div class="header-content">
            <div class="header-left">
              <div class="header-nav-btns">
                <button class="nav-btn" @click="$router.back()">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button class="nav-btn" @click="$router.forward()">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
            <div class="header-center">
              <div class="header-brand">
                <i class="bi bi-music-note-beamed"></i>
                <span class="brand-text">Deezerfy</span>
              </div>
            </div>
            <div class="header-right">
              <button class="header-btn">
                <i class="bi bi-bell"></i>
              </button>
              <button class="header-btn premium-btn">
                <i class="bi bi-gem"></i>
                <span>Premium</span>
              </button>
            </div>
          </div>
        </header>

        <main class="content">
          <router-view />
        </main>

        <footer class="footer">
          <p>&copy; 2026 Deezerfy - Powered by Deezer API</p>
        </footer>
      </div>
    </div>

    <!-- MusicPlayer siempre visible en la pantalla -->
    <MusicPlayer />

    <!-- Welcome Modal -->
    <WelcomeModal v-if="!isUserLoggedIn" />
  </div>
</template>

<style lang="scss">
@use '@/assets/styles.scss' as *;

/* Layout Principal */
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  /* Evita que la página tenga doble scroll */
}

/* Sidebar (Navbar) */
.sidebar {
  width: 250px;
  background-color: $background-dark;
  color: $text-light;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Contenido Principal */
.main-content {
  margin-left: 250px;
  /* Deja espacio para el sidebar */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #181818;
  color: $text-light;
  height: 100vh;
  overflow-y: auto;
  /* Permite hacer scroll en el contenido */
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(24, 24, 24, 0.9) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 16px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1800px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-nav-btns {
  display: flex;
  gap: 8px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  
  i {
    font-size: 1.8rem;
    background: linear-gradient(135deg, #A238FF 0%, #EF5466 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .brand-text {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #A238FF 0%, #EF5466 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #b3b3b3;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  
  &.premium-btn {
    background: linear-gradient(135deg, #A238FF 0%, #EF5466 100%);
    color: #fff;
    font-weight: 600;
    padding: 8px 16px;
    
    &:hover {
      transform: scale(1.03);
      box-shadow: 0 4px 15px rgba(162, 56, 255, 0.4);
    }
  }
}

/* Contenido */
.content {
  flex-grow: 1;
  padding: 20px;
}

/* Footer */
.footer {
  background-color: #181818;
  text-align: center;
  padding: 10px;
  color: $text-muted;
  font-size: 0.9rem;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

/* Media Queries para hacer la aplicación responsive */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    margin-top: 50px; /* Ajusta el margen superior para la barra de navegación responsive */
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: fixed;
    top: 0;
    left: 0;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px; /* Reducimos el padding */
  }

  .main-content {
    margin-left: 0;
    margin-top: 50px; /* Ajusta el margen superior para la barra de navegación responsive */
  }

  .header {
    font-size: 1.2rem;
    padding: 10px;
  }

  .content {
    padding: 10px;
  }

  .footer {
    font-size: 0.8rem;
    padding: 5px;
  }
}

@media (max-width: 480px) {
  .header {
    font-size: 1rem;
  }

  .content {
    padding: 5px;
  }

  .footer {
    font-size: 0.7rem;
  }
}
</style>
