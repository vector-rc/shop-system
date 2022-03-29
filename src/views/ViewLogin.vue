<template>
  <form @submit.prevent="login" class="box column is-4 is-offset-4">
    <div class="field">
      <label class="label">Usuario</label>
      <div class="control has-icons-left">
        <input
          class="input is-medium"
          ref="fieldName"
          required
          v-model="credentials.userName"
          placeholder="Nombre de usuario"
        />
        <Icon class="icon is-large is-left">
          <person32-regular />
        </Icon>
      </div>
    </div>
    <div class="field">
      <label class="label">Contraseña</label>
      <div class="control has-icons-left">
        <input
          class="input is-medium"
          required
          v-model="credentials.password"
          type="password"
          placeholder="************"
        />
        <Icon class="icon is-large is-left">
          <key20-regular />
        </Icon>
      </div>
    </div>
    <div class="field ">
      <p class="control is-expanded">
        <button class="button is-primary is-medium input mt-2">Iniciar Sesion</button>
        <span v-if="error" class="help is-danger">Error al iniciar session</span>
      </p>
    </div>
  </form>
  <!-- <BarcodePdf/> -->
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Person32Regular, Key20Regular } from '@vicons/fluent'
import { toast } from '@/utils/toast'

import { Icon } from '@vicons/utils'
// import BarcodePdf from '../components/BarcodePdf.vue'

const store = useStore()
const error = ref(false)
const router = useRouter()
const credentials = reactive({
  userName: '',
  password: ''
})

const login = async () => {
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
  console.log(res.message)
}
</script>

<style></style>
