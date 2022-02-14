import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import 'dotenv/config'

// https://vitejs.dev/config/
export default () => {
  // const prefix = 'VUE_APP_'
  // const envVars = Object.fromEntries(Object.entries(process.env).filter((entri) => entri[0].startsWith(prefix)))

  return defineConfig({
    define: {
      'process.env': process.env
    },
    plugins: [vue()],
    optimizeDeps: {
      exclude: ['dist_electron/bundled/*', 'escpos', 'escpos-usb']
    }
  })
}
