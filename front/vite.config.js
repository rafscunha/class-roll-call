import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    watch:{
      usePolling:true,
    },
    host:true,
    strictPort:true,
    port:5173
  },
  define:{
    'import.meta.env.VITE_BASE_API': JSON.stringify(process.env.VITE_BASE_API),
    'import.meta.env.VITE_BASE_WSS': JSON.stringify(process.env.VITE_BASE_WSS)
  }
})
