import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // ← 이거 추가

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
