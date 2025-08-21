import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.ts'), // 入口文件
      name: 'WRYUI', // 库的名字
      fileName: (format) => `wry-ui.${format}.js`, // 输出文件名模板
      formats: ['es', 'umd'], // 支持 ESM 和 UMD 输出格式
    },
    rollupOptions: {
      external: ['vue'], // 不需要打包 vue
      output: {
        globals: {
          vue: 'Vue', // 将 vue 标记为全局变量
        },
      },
    },
  },
});
