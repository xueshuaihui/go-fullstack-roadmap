import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  // 站点发布在 GitHub Pages 的子路径 https://xueshuaihui.github.io/go-fullstack-roadmap/，
  // 构建必须带这个 base，否则 index.html 里的 /assets/* 会 404。dev 保持根路径，localhost:5173 直接可开。
  base: command === 'build' ? '/go-fullstack-roadmap/' : '/',
}))
