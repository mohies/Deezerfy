<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Iniciar Sesión</h2>
      <form @submit="saveUser">
        <div class="form-group">
          <label for="username">Nombre:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label>Elige un avatar:</label>
          <div class="avatar-options">
            <img v-for="(avatar) in avatars" :key="index" :src="avatar"
              @click="selectAvatar(avatar)" :class="{ selected: selectedAvatar === avatar }" />
          </div>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const username = ref('');
const selectedAvatar = ref('');
const avatars = [
  'avatar1.png',
  'avatar2.png',
  'avatar3.png',
  'avatar4.png'
];

const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar;
};

const saveUser = () => {
  if (selectedAvatar.value) {
    userStore.setUser({ name: username.value, avatar: selectedAvatar.value });
  } else {
    alert('Por favor, selecciona un avatar.');
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles.scss' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  /* Ensure it is above other elements */
}

.modal-content {
  background: $secondary-color;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  color: $text-color;
  width: 90%;
  max-width: 400px;
  z-index: 10001;
  /* Ensure it is above the carousel arrows */
}

h2 {
  color: $primary-color;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #222;
  color: $text-color;
}

.avatar-options {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.avatar-options img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
}

.avatar-options img.selected {
  border-color: $primary-color;
}

button {
  margin-top: 20px;
  background-color: $primary-color;
  color: $text-color;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: $button-hover;
}

/* Media Queries para hacer el modal responsive */
@media (max-width: 768px) {
  .modal-content {
    padding: 20px;
    width: 95%;
  }

  .avatar-options {
    flex-direction: column;
    align-items: center;
  }

  .avatar-options img {
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 15px;
  }

  h2 {
    font-size: 1.2rem;
  }

  button {
    padding: 8px 10px;
  }
}
</style>
