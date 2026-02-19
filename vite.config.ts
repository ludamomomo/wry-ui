import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.ts'), 
      name: 'WRYUI',
      fileName: (format) => `wry-ui.${format}.js`, // 输出文件名模板
      formats: ['es', 'umd'], 
    },
    rollupOptions: {
      external: ['vue'], 
      output: {
        globals: {
          vue: 'Vue', // 将 vue 标记为全局变量
        },
      },
    },
  },
});
