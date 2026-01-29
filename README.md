# Deezer Vue 3 App

This project is a starter template for developing a Vue 3 application using Vite that consumes the Deezer API.

---
**Deezerfy — Aplicación Vue 3 (Instrucciones en español)**

Pequeña app cliente para Deezer desarrollada con Vue 3 y Vite. Este README explica cómo preparar el entorno, ejecutar la aplicación en desarrollo (incluyendo el proxy CORS incluido) y cómo generar una versión para producción.

**Requisitos**:
- Node.js >= 18 (recomendado)
- npm >= 9

**Instalación (una sola vez)**:
```bash
npm install
```

**Comandos principales**:
- `npm run dev` — Inicia solo el servidor de desarrollo Vite (hot-reload) en `http://localhost:5173`.
- `npm run start` — Inicia el proxy CORS local y Vite en paralelo (recomendado si usas la proxy incluida).
- `npm run start:proxy` — Inicia solo el proxy CORS (si quieres correr Vite por separado).
- `npm run build` — Genera la versión de producción en la carpeta `dist`.
- `npm run preview` — Sirve la build de `dist` localmente para pruebas.

Ejemplo (arrancar todo junto):
```bash
npm run start
```

Si prefieres ver logs separados en dos terminales:
```bash
npm run start:proxy   # terminal A — proxy CORS
npm run dev           # terminal B — Vite
```

**Sobre el proxy CORS incluido**:
- El proyecto incorpora una copia del servidor `cors-anywhere` en la carpeta `cors-anywhere`.
- El proxy se ejecuta por defecto en `http://localhost:8080` cuando usas `npm run start` o `npm run start:proxy`.
- Las llamadas a la API de Deezer se hacen anteponiendo la URL del proxy, por ejemplo:
```js
fetch(`http://localhost:8080/https://api.deezer.com/search?q=QUERY`)
```

⚠️ Asegúrate de que el proxy esté levantado antes de usar la app, o las peticiones al API fallarán por CORS.

**Configuración Git / subida al repositorio**:
- Para subir cambios a GitHub asegúrate de estar autenticado con la cuenta correcta. Si recibes `403` o `permission denied`, revisa las credenciales guardadas en tu máquina y elimina las antiguas si es necesario:
```powershell
cmdkey /delete:git:https://github.com
```
Luego vuelve a hacer `git push` y autentícate con la cuenta propietaria del repo.

**Despliegue**:
- La carpeta `dist` generada por `npm run build` contiene los archivos listos para producción.
- Puedes desplegar `dist` en Netlify, Vercel, GitHub Pages (con adaptaciones) o cualquier servidor estático.

**Estructura relevante del proyecto**:
- `src/` — código fuente Vue (componentes, vistas, stores).
- `cors-anywhere/` — proxy CORS local incluido.
- `public/` — activos estáticos.


*** Fin ***
