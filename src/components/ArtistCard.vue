<template>
  <div class="artist-card">
    <!-- Imagen del artista, al hacer clic redirige a la página del artista -->
    <img :src="artist.picture_xl" alt="Artist picture" class="artist-picture" @click="navigateToInfo('artist', artist.id)" />
    <div class="artist-info">
      <!-- Nombre del artista, al hacer clic redirige a la página del artista -->
      <p><strong @click="navigateToInfo('artist', artist.id)" class="hover-underline">{{ artist.name }}</strong></p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'; // Importamos useRouter para la navegación

// Definimos las propiedades
const props = defineProps({
  artist: Object
});

const router = useRouter(); // Instanciamos el router

// Función para navegar a la información del artista
const navigateToInfo = (type, id) => {
  router.push({ name: 'Info', params: { type, id } });
};
</script>

<style scoped>
.artist-card {
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

.artist-card:hover {
  transform: translateY(-5px); /* Efecto hover para levantar la tarjeta */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); /* Sombra más intensa en hover */
}

.artist-picture {
  width: 90px; /* Tamaño de la imagen más grande */
  height: 90px;
  border-radius: 50%; /* Esquinas redondeadas para la imagen */
  object-fit: cover; /* Ajuste de la imagen */
}

.artist-info {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra el texto verticalmente */
  flex: 1; /* La columna de información ocupará el espacio restante */
}

.artist-info p {
  margin: 5px 0; /* Espacio entre los elementos de información */
}

.artist-info p strong {
  font-size: 1.1rem;
  color: #fff;
  font-weight: bold;
}

.hover-underline:hover {
  text-decoration: underline;
  cursor: pointer;
}

/* Media Queries para hacer la tarjeta responsive */
@media (max-width: 768px) {
  .artist-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .artist-picture {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .artist-card {
    padding: 10px;
  }

  .artist-picture {
    width: 60px;
    height: 60px;
  }

  .artist-info p strong {
    font-size: 1rem;
  }
}
</style>