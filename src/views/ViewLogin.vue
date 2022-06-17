<template>
  <div class="backgroud" :style="bg">
    <div class="filter-background">
      <card-component title="Iniciar Sesion" style="width:20rem;margin: auto">
        <form @submit.prevent="login">
          <div class="field">
            <label class="label">Usuario</label>
            <div class="control has-icons-left">
              <input class="input" ref="fieldName" required v-model="credentials.userName"
                placeholder="Nombre de usuario" />
              <Icon class="icon is-large is-left">
                <person32-regular />
              </Icon>
            </div>
          </div>
          <div class="field">
            <label class="label">Contraseña</label>
            <div class="control has-icons-left">
              <input class="input" required v-model="credentials.password" type="password" placeholder="************" />
              <Icon class="icon is-large is-left">
                <key20-regular />
              </Icon>
            </div>
          </div>
          <div>
            <p class="control is-expanded">
              <button class="button is-primary input mt-2" :class="{'is-loading':loginLoading}" :disabled="loginLoading" >Iniciar Sesion</button>
              <span v-if="error" class="help is-danger">Error al iniciar session</span>
            </p>
          </div>
        </form>
      </card-component>
    </div>
  </div>
  <!-- <BarcodePdf/> -->
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Person32Regular, Key20Regular } from '@vicons/fluent'
import { toast } from '@/utils/toast'
import CardComponent from '@/components/Shared/CardComponent.vue'
import wallpapers from '@/utils/wallpapers'

import { Icon } from '@vicons/utils'

const bg = ref({})
const loginLoading = ref(false)

// const wallpaperGallerys = [
//   'https://imgur.com/gallery/wCBYO.json',
//   'https://imgur.com/gallery/nHLVf.json',
//   'https://imgur.com/gallery/wmSMe.json'
// ]

const getWallpaper = () => {
  return 'https://imgur.com/' + wallpapers[rand(wallpapers.length)]
}
const rand = (max:number, min = 0) => {
  return min ? Math.floor((Math.random() * (max - min)) + min) : Math.floor(Math.random() * max)
}

const store = useStore()
const error = ref(false)
const router = useRouter()
const credentials = reactive({
  userName: '',
  password: ''
})

onMounted(async () => {
  bg.value = { 'background-image': 'url(' + getWallpaper() + ')' }
  setInterval(() => {
    bg.value = { 'background-image': 'url(' + getWallpaper() + ')' }
  }, 15000)
  console.log(bg.value)
})

const login = async () => {
  loginLoading.value = true
  const res = await store.dispatch('userLogin', { credentials })

  error.value = !res.success
  if (error.value) {
    toast.danger(res.message, 3000)
  }
  if (res.success) {
    await store.dispatch('fetchProducts')
    toast.success(res.message, 3000)

    router.replace('products')
  }
  loginLoading.value = false
  console.log(res.message)
}
</script>

<style>
.backgroud {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  position: absolute;
  left: 0;
  top: 0;
  -webkit-transition: background-image 2s ease-in-out;
  transition: background-image 2s ease-in-out;

}

.filter-background {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #00000066;
}

.bg-l {
  background-color: #ffffff22
}
</style>
