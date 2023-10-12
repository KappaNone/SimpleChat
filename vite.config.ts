import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'APP',
  resolve: {
    alias: {
      views: '/src/views',
      components: '/src/components',
      server: '/server',
      atoms: '/src/Atoms',
      utils: '/src/Utils',

      Main: '/src/views/Main/Main',
      Rooms: '/src/views/Rooms/Rooms',
      Chat: '/src/views/Chat/Chat',
      JoinChat: '/src/views/JoinChat/JoinChat',
    },
  },
})
