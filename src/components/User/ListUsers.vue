<template>
  <!-- <ModalUserDetail :userId="userIdDetails" :show="showModal" @hide="showModal=false"/> -->
   <div class="modal is-active" style="z-index: 9999 ;" v-if="showModalDelete">
    <div class="modal-background"></div>
    <div class="modal-content" style="width: 35%; height: 30%;">
      <article class="message is-danger">
        <div class="message-header">
          <p>Danger</p>
          <button class="delete" @click="showModalDelete = false" aria-label="delete"></button>
        </div>
        <div class="message-body">
          <span>¿¿ Esta seguro de blockear este usuario}?</span>
          <br>
          <button
            :disabled="isLoading"
            class="button is-danger mx-2"
            @click="deleteUser()"
            :class="{ 'is-loading': isLoading }"
          >Bloquar usuario</button>
          <button class="button" @click="showModalDelete = false">Cancelar</button>
        </div>
      </article>
    </div>
  </div>
  <div class="columns">
    <div class="column is-11">
      <div class="control has-icons-left">
        <input
          class="input"
          type="search"
          @input="filterUsers()"
          v-model.trim="querySearch"
          placeholder="Buscar por nombre o documento"
        />

        <Icon class="icon is-large is-left">
          <search20-regular />
        </Icon>
      </div>
    </div>

    <div class="column is-1">
      <button class="button is-primary" @click="syncusers()">
        <Icon class="icon is-large is-left">
          <arrow-sync20-filled />
        </Icon>
      </button>
    </div>
  </div>
  <div class="h-100 oy-scroll">
    <table class="table is-narrow is-hoverable is-bordered is-striped is-fullwidth">
      <thead>
        <tr style="position:sticky;">
          <th>ID</th>
          <th>Nombres</th>
          <th>Usuario</th>
          <th>Email</th>
          <th>DNI</th>
          <th>Celular</th>
          <!-- <th></th> -->
        </tr>
      </thead>
      <tbody style="padding-top: 2px;">
        <tr
          v-for="user of usersFilter"
          :key="user.id"
          :class="{ 'has-background-danger-light': user.enable === 0 }"
        >
          <td>{{ user.id }}</td>
          <td>{{ user.fullName }}</td>
          <td>{{ user.userName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.dni }}</td>
          <td>{{ user.mobile }}</td>
          <td>
            <button title="bloquear usuario" class="button is-danger is-small" v-if="user.enable===1" @click="userId= user.id, showModalDelete = true">
              <Icon>
                <PresenceBlocked12Regular />
              </Icon>
            </button>
            <button title="Desbloquear usuario" class="button is-success is-small" v-if="user.enable===0" @click="restoreUser(user.id)">
              <Icon>
                <ArrowCircleUp20Regular />
              </Icon>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Search20Regular, ArrowSync20Filled, PresenceBlocked12Regular, ArrowCircleUp20Regular/*, Copy20Regular */ } from '@vicons/fluent'
import { Icon } from '@vicons/utils'
import { toast } from '@/utils/toast'

// import ModalUserDetail from './ModalUserDetail.vue'

const store = useStore()
const users = ref([] as any[])
const usersFilter = ref([] as any[])
const querySearch = ref('')
const showModalDelete = ref(false)
const isLoading = ref(false)
const userId = ref(0)

onMounted(async () => {
  const res = await store.dispatch('fetchUsers')
  if (!res.success) {
    toast.danger(res.message, 4000)
    return
  }
  users.value = res.data.reverse()

  usersFilter.value = users.value
})

const filterUsers = () => {
  const query = querySearch.value.toLowerCase()

  usersFilter.value = users.value.filter(el => (el.fullName.toLowerCase().includes(query) || el.userName.toString().toLowerCase().includes(query)))
}

const deleteUser = async () => {
  const res = await store.dispatch('deleteUser', { userId: userId.value })
  isLoading.value = true
  if (!res.success) {
    toast.danger(res.message, 5000)
    isLoading.value = false
    showModalDelete.value = false

    return
  }
  toast.success(res.message, 5000)
  isLoading.value = false
  showModalDelete.value = false

  await syncusers()
}
const restoreUser = async (userId:any) => {
  const res = await store.dispatch('restoreUser', { userId })
  isLoading.value = true
  if (!res.success) {
    toast.danger(res.message, 5000)
    isLoading.value = false
    return
  }
  toast.success(res.message, 5000)
  isLoading.value = false
  await syncusers()
}

const syncusers = async () => {
  const res = await store.dispatch('fetchUsers')
  users.value = res.data.reverse()
  usersFilter.value = users.value
}
</script>

<style>
.h-100 {
  height: 90vh;
}
.oy-scroll {
  overflow-y: scroll;
}
</style>
