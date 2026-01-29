<template>
  <div class="album-card">
    <!-- Imagen del álbum, al hacer clic redirige a la página del álbum -->
    <img :src="album.cover_xl" alt="Album cover" class="album-cover" @click="navigateToInfo('album', album.id)" />
    <div class="album-info">
      <!-- Título del álbum, al hacer clic redirige a la página del álbum -->
      <p><strong @click="navigateToInfo('album', album.id)" class="hover-underline">{{ album.title }}</strong></p>
      <!-- Artista del álbum, al hacer clic redirige a la página del artista -->
      <p><em @click="navigateToInfo('artist', album.artist.id)" class="hover-underline">{{ album.artist.name }}</em></p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'; // Importamos useRouter para la navegación

// Definimos las propiedades
const props = defineProps({
  album: Object
});

const router = useRouter(); // Instanciamos el router

// Función para navegar a la información de álbum o artista
const navigateToInfo = (type, id) => {
  router.push({ name: 'Info', params: { type, id } });
};
</script>

<style scoped>
.album-card {
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

.album-card:hover {
  transform: translateY(-5px); /* Efecto hover para levantar la tarjeta */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); /* Sombra más intensa en hover */
}

.album-cover {
  width: 90px; /* Tamaño de la imagen más grande */
  height: 90px;
  border-radius: 5px; /* Esquinas redondeadas para la imagen */
  object-fit: cover; /* Ajuste de la imagen */
}

.album-info {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra el texto verticalmente */
  flex: 1; /* La columna de información ocupará el espacio restante */
}

.album-info p {
  margin: 5px 0; /* Espacio entre los elementos de información */
}

.album-info p strong {
  font-size: 1.1rem;
  color: #fff;
  font-weight: bold;
}

.album-info p em {
  font-size: 0.9rem;
  color: #bbb;
}

.hover-underline:hover {
  text-decoration: underline;
  cursor: pointer;
}

/* Media Queries para hacer la tarjeta responsive */
@media (max-width: 768px) {
  .album-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .album-cover {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .album-card {
    padding: 10px;
  }

  .album-cover {
    width: 60px;
    height: 60px;
  }

  .album-info p strong {
    font-size: 1rem;
  }

  .album-info p em {
    font-size: 0.8rem;
  }
}
</style>