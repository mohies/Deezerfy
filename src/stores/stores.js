import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    currentSong: null,
    queue: [],           // Cola de reproducción
    queueIndex: -1,      // Índice actual en la cola
    isShuffled: false,   // Si está en modo shuffle
    originalQueue: [],   // Cola original antes de shuffle
    favorites: [],
    songs: [], // Lista de canciones de búsqueda
    playlist: {
      id: 1,
      name: 'Mi Playlist Favorita',
      songs: [], // Ahora la playlist es un objeto único
    }
  }),

  actions: {
    setCurrentSong(song) {
      this.currentSong = song;
    },

    // ========== QUEUE SYSTEM ==========
    
    // Establecer cola y reproducir una canción específica
    playWithQueue(song, songs) {
      this.queue = [...songs];
      this.originalQueue = [...songs];
      this.queueIndex = songs.findIndex(s => s.id === song.id);
      if (this.queueIndex === -1) this.queueIndex = 0;
      this.currentSong = song;
    },

    // Reproducir canción por índice
    playSongAtIndex(index) {
      if (index >= 0 && index < this.queue.length) {
        this.queueIndex = index;
        this.currentSong = this.queue[index];
      }
    },

    // Siguiente canción
    nextSong() {
      if (this.queue.length === 0) return null;
      
      let nextIndex = this.queueIndex + 1;
      if (nextIndex >= this.queue.length) {
        nextIndex = 0; // Volver al principio
      }
      
      this.queueIndex = nextIndex;
      this.currentSong = this.queue[nextIndex];
      return this.currentSong;
    },

    // Canción anterior
    previousSong() {
      if (this.queue.length === 0) return null;
      
      let prevIndex = this.queueIndex - 1;
      if (prevIndex < 0) {
        prevIndex = this.queue.length - 1; // Ir al final
      }
      
      this.queueIndex = prevIndex;
      this.currentSong = this.queue[prevIndex];
      return this.currentSong;
    },

    // Toggle shuffle
    toggleShuffle() {
      this.isShuffled = !this.isShuffled;
      
      if (this.isShuffled) {
        // Guardar la canción actual
        const currentSong = this.currentSong;
        // Mezclar la cola
        const shuffled = [...this.queue].sort(() => Math.random() - 0.5);
        // Mover la canción actual al principio
        const currentIndex = shuffled.findIndex(s => s.id === currentSong?.id);
        if (currentIndex > 0) {
          shuffled.splice(currentIndex, 1);
          shuffled.unshift(currentSong);
        }
        this.queue = shuffled;
        this.queueIndex = 0;
      } else {
        // Restaurar cola original
        const currentSong = this.currentSong;
        this.queue = [...this.originalQueue];
        this.queueIndex = this.queue.findIndex(s => s.id === currentSong?.id);
        if (this.queueIndex === -1) this.queueIndex = 0;
      }
    },

    // Limpiar cola
    clearQueue() {
      this.queue = [];
      this.originalQueue = [];
      this.queueIndex = -1;
    },

    // Añadir canción a la cola (al final)
    addToQueue(song) {
      if (!this.queue.some(s => s.id === song.id)) {
        this.queue.push(song);
        this.originalQueue.push(song);
        
        // Si no hay canción reproduciéndose, empezar a reproducir esta
        if (!this.currentSong) {
          this.queueIndex = this.queue.length - 1;
          this.currentSong = song;
        }
      }
    },

    // Añadir múltiples canciones a la cola
    addMultipleToQueue(songs) {
      songs.forEach(song => {
        if (!this.queue.some(s => s.id === song.id)) {
          this.queue.push(song);
          this.originalQueue.push(song);
        }
      });
    },

    // Eliminar canción de la cola por índice
    removeFromQueueAtIndex(index) {
      if (index >= 0 && index < this.queue.length) {
        // Si eliminamos la canción actual, pasar a la siguiente
        if (index === this.queueIndex) {
          this.queue.splice(index, 1);
          this.originalQueue.splice(index, 1);
          if (this.queue.length > 0) {
            // Si hay más canciones, reproducir la que queda en ese índice
            if (this.queueIndex >= this.queue.length) {
              this.queueIndex = this.queue.length - 1;
            }
            this.currentSong = this.queue[this.queueIndex];
          } else {
            this.currentSong = null;
            this.queueIndex = -1;
          }
        } else {
          this.queue.splice(index, 1);
          this.originalQueue.splice(index, 1);
          // Ajustar el índice si eliminamos una canción anterior
          if (index < this.queueIndex) {
            this.queueIndex--;
          }
        }
      }
    },

    // Reproducir siguiente (añadir después de la actual)
    playNext(song) {
      if (!this.queue.some(s => s.id === song.id)) {
        this.queue.splice(this.queueIndex + 1, 0, song);
        this.originalQueue.splice(this.queueIndex + 1, 0, song);
      }
    },

    // Métodos de favoritos
    addToFavorites(song) {
      if (!this.favorites.some(fav => fav.id === song.id)) {
        this.favorites.push(song);
      }
    },

    removeFromFavorites(songId) {
      this.favorites = this.favorites.filter(fav => fav.id !== songId);
    },

    // Métodos para gestionar la playlist dinámica
    addSongToPlaylist(song) {
      if (!this.playlist.songs.some(s => s.id === song.id)) {
        this.playlist.songs.push(song);
      }
    },

    removeSongFromPlaylist(songId) {
      this.playlist.songs = this.playlist.songs.filter(song => song.id !== songId);
    },


  },

  getters: {
    getCurrentSong() {
      return this.currentSong;
    },
    getFavorites() {
      return this.favorites;
    },
    getPlaylist() {
      return this.playlist;
    },
    getQueue() {
      return this.queue;
    },
    getQueueIndex() {
      return this.queueIndex;
    },
    hasNextSong() {
      return this.queue.length > 0 && this.queueIndex < this.queue.length - 1;
    },
    hasPreviousSong() {
      return this.queue.length > 0 && this.queueIndex > 0;
    },
  }
});