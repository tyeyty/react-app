import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'; 

export default defineConfig({ // <-- 여기서 열린 괄호
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 프록시 대상 서버로 전달합니다.
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        secure: false, // HTTPS 환경에서 필요할 수 있음
      }, 
    }, 
  }, // <-- 객체 닫는 괄호
}); // <-- defineConfig 함수의 닫는 괄호 (여기에 추가해야 함!)