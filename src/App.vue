<template>
  <NavBar v-if="isAuthenticated" @show-drawer="showDrawer=!showDrawer" />
  <DrawerMenu v-if="isAuthenticated" :class="{'active':showDrawer}" />
  <main>
    <div style="padding:0.5rem;">
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
          <div :key="(route.name as string)">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import DrawerMenu from './components/Shared/DrawerMenu.vue'
import NavBar from './components/Shared/NavBar.vue'
import { useRoute } from 'vue-router'
const store = useStore()
const route = useRoute()

if (!localStorage.printer) {
  localStorage.printer = '8214/8137'
}

const showDrawer = ref(false)

const isAuthenticated = computed(() => {
  return store.state.isAuthenticated
})

</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
}
.router-link-exact-active {
  background-color: #00d1b2;
  border-color: transparent;
  color: #fff;
}

.route-enter-from,
.route-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
.route-leave-active,
.route-enter-active  {
  transition: all 0.3s ease-in;
}
</style>
