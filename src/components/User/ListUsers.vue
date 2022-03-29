<template>
<!-- <ModalUserDetail :userId="userIdDetails" :show="showModal" @hide="showModal=false"/> -->
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
      <thead >
      <tr style="position:sticky;">
        <th>ID</th>
        <th>Nombres</th>
        <th>Usuario</th>
        <th>Email</th>
        <th>DNI</th>
        <th>Celular</th>
        <th></th>
      </tr>
      </thead>
      <tbody style="padding-top: 2px;">
        <tr v-for="user of usersFilter" :key="user.id" :class="{'has-background-danger-light':user.enable===0}">
          <td>{{ user.id}}</td>
          <td >{{user.fullName}}</td>
          <td>{{ user.userName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.dni }}</td>
          <td>{{ user.mobile }}</td>
          <td >
            <button class="button is-info is-small" @click="userIdDetails=user.id,showModal=true">
              <Icon>
                <edit20-regular />
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
import { Edit20Regular, Search20Regular, ArrowSync20Filled /*, Copy20Regular */ } from '@vicons/fluent'
import { Icon } from '@vicons/utils'
import { toast } from '@/utils/toast'

// import ModalUserDetail from './ModalUserDetail.vue'

const store = useStore()
const users = ref([] as any[])
const usersFilter = ref([] as any[])
const querySearch = ref('')
const showModal = ref(false)
const userIdDetails = ref(0)

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
