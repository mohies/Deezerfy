# Deezer Vue 3 App

This project is a starter template for developing a Vue 3 application using Vite that consumes the Deezer API.

---

## ✨ Recommended Setup

- [Visual Studio Code](https://code.visualstudio.com/)
- Extensions:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Disable Vetur if installed)

---

## 📁 Project Setup

```bash
npm install
```

---

## ⚙️ Development Commands

### Start development server with hot-reload:
```bash
npm run dev
```

### Build for production:
```bash
npm run build
```

---

## 🔗 Local Proxy for the Deezer API

To avoid CORS issues when making requests to the Deezer API, you can set up a local proxy using the [CORS Anywhere](https://github.com/Rob--W/cors-anywhere.git) project.

### Steps to set up the local proxy:

1. **Clone the CORS Anywhere repository:**
   ```bash
   git clone https://github.com/Rob--W/cors-anywhere.git
   cd cors-anywhere
   npm install
   node server.js
   ```

2. **Use the proxy in your requests:**

   ```js
   try {
     const response = await fetch(
       `http://localhost:8080/https://api.deezer.com/search?q=${searchQuery.value}`
     );
     if (!response.ok) throw new Error('Error fetching data');
     const data = await response.json();
     searchResults.value.songs = data.data;
   } catch (error) {
     console.error('Error:', error);
   }
   ```

> ℹ️ Make sure the proxy server is running before making requests.

---

## 📄 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Configuration Guide](https://vitejs.dev/config/)
- [Deezer API](https://developers.deezer.com/api)

---

## ✉️ License

This project is licensed under the MIT License.
