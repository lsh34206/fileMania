import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    allowedHosts:["http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com"]
  }
})
