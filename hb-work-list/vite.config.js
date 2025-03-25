import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/study/hb-work-list/', // GitHub Pages에서 배포되는 서브 디렉토리
  build: {
    outDir: 'build', // 빌드 결과물을 'build' 폴더에 저장
  },
})
