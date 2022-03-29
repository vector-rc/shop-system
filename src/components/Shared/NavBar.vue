<template>
  <nav class="navbar box-shadow-y  has-background-black-ter has-text-white-ter"  style="width: 100%;">
    <div class="navbar-brand">
      <a role="button" class="navbar-burger toggler" aria-label="menu" aria-expanded="true" @click="emit('showDrawer')" >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>

      <a href="#" class="navbar-item has-text-weight-bold has-text-black">
        <h2 style="color:#bbb;font-size: 1.4rem;font-weight:900;">VILCHERREZ SYSTEM</h2>
      </a>
      <a role="button" class="navbar-burger nav-toggler" :class="{'is-active':showNav}" @click="showNav=!showNav">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu has-text-white-ter" :class="{'is-active':showNav}">
      <!-- <div class="navbar-start  has-text-white-ter">
        <a href="#" class="navbar-item  has-text-white-ter">
          <i class="fas fa-home icon"></i> Home
        </a>
        <a href="#" class="navbar-item  has-text-white-ter">About</a>
        <a href="#" class="navbar-item  has-text-white-ter">Features</a>
        <a href="#" class="navbar-item  has-text-white-ter">Pricing</a>
      </div> -->
      <div class="navbar-end">
        <!-- <a href="#" class="navbar-item  has-text-white-ter">Notifications</a> -->
        <div class="navbar-item has-dropdown is-hoverable has-background-black-ter ">
          <a href="#" class="navbar-link  has-text-white-ter has-background-black-ter"  >{{ user.fullName }}</a>
          <div class="navbar-dropdown is-right is-boxed has-background-black-ter">
            <router-link to="/profile" class="navbar-item  has-text-white-ter">Perfil</router-link>
            <hr class="navbar-divider has-background-grey" />
            <a href="#" class="navbar-item  has-text-white-ter" @click="logout">Salir</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

const emit = defineEmits(['showDrawer'])

const store = useStore()

const showNav = ref(false)
const user = computed(() => {
  return store.state.user
})

const logout = () => {
  window.location.reload()
}

</script>
