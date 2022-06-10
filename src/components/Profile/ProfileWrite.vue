<template>
  <card-component title="Editar Perfil" :icon="People20Regular" >
    <form @submit.prevent="submit">
      <!-- <field-horizontal label="Avatar">
          <p class="control is-expanded">
            <file-picker type="is-info" />
          </p>
      </field-horizontal>
      <hr /> -->
      <field-horizontal label="Usuario">
          <p class="control">
            <input class="input" disabled v-model="user.userName" />
          </p>
      </field-horizontal>
      <hr />
      <field-horizontal label="Nombre Completo">
          <p class="control">
            <input class="input" required v-model="user.fullName" />
          </p>
      </field-horizontal>
      <hr />
        <field-horizontal label="Email">
            <p class="control">
              <input class="input" required v-model="user.email" />
            </p>
        </field-horizontal>
      <hr />
        <field-horizontal label="Celular">
            <p class="control">
              <input class="input" v-model="user.mobile" />
            </p>
        </field-horizontal>
      <hr />

      <field-horizontal label="DNI">
          <p class="control">
            <input class="input" v-model="user.dni" />
          </p>
      </field-horizontal>
      <hr />
      <field-horizontal>
        <div class="control">
          <button  class="button is-primary" :class="{'is-loading':isLoading}">Guardar Cambios</button>
        </div>
      </field-horizontal>
    </form>
  </card-component>
</template>

<script setup>
// import FilePicker from '@/components/Shared/FilePicker.vue'
import CardComponent from '@/components/Shared/CardComponent.vue'
import FieldHorizontal from '../Shared/FieldHorizontal.vue'
import { useStore } from 'vuex'
import { reactive, ref } from 'vue'
import { People20Regular } from '@vicons/fluent'
import { toast } from '@/utils/toast'

const store = useStore()
const isLoading = ref(false)

const user = reactive(store.state.user)
console.log(store)

const submit = async () => {
  const res = await store.dispatch('editUser', { user })
  console.log(res)

  isLoading.value = true
  if (!res.success) {
    toast.danger(res.message, 5000)
    isLoading.value = false
    return
  }
  toast.success(res.message, 5000)
  isLoading.value = false
}
</script>
