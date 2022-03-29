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
            <input class="input" required v-model="user.userName" />
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
              <input class="input" required v-model="user.movile" />
            </p>
        </field-horizontal>
      <hr />

      <field-horizontal label="DNI">
          <p class="control">
            <input class="input" required v-model="user.dni" />
          </p>
      </field-horizontal>
      <hr />
      <!-- <field-horizontal>
        <div class="control">
          <button class="button is-primary">Submit</button>
          <button class="button is-outlined is-primary">Reset</button>
        </div>
      </field-horizontal> -->
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

const store = useStore()
const isLoading = ref(false)

const user = reactive(store.state.user)
console.log(store)

const submit = () => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false

    this.$buefy.snackbar.open({
      message: 'Demo only',
      queue: false
    })
  }, 750)
}
</script>
