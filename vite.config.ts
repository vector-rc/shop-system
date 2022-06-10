import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import 'dotenv/config'
import path from 'path'

// https://vitejs.dev/config/
export default () => {
  // const prefix = 'VUE_APP_'
  // const envVars = Object.fromEntries(Object.entries(process.env).filter((entri) => entri[0].startsWith(prefix)))

  return defineConfig({
    define: {
      'process.env': process.env
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    base: '/vilcherrez/',
    optimizeDeps: {
      exclude: ['dist_electron/bundled/*']
    }
  })
}
