import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      name: localStorage.getItem('userName') || '',
      avatar: localStorage.getItem('userAvatar') || '',
    },
  }),
  actions: {
    setUser(user) {
      this.user.name = user.name;
      this.user.avatar = user.avatar;
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userAvatar', user.avatar);
    },
    clearUser() {
      this.user.name = '';
      this.user.avatar = '';
      localStorage.removeItem('userName');
      localStorage.removeItem('userAvatar');
    },
  },
});
