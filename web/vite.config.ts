import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // 发布在 GitHub Pages 子路径下；构建必须带这个 base，否则 index.html 与 cards 的绝对路径全 404。
  // dev 不带 base，localhost:5178 根路径直接可开。
  base: command === 'build' ? '/go-fullstack-roadmap/' : '/',
  server: { port: 5178, open: true },
}))
