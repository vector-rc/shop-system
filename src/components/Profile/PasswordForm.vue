<template>
  <card-component
    title="Actualizar contraseña"
    icon="lock"
  >
    <form class="form" @submit.prevent="submit" ref="formPass">
      <field-horizontal
        label="Contraseña actual"
        message="Required. Your current password"
      >
        <input class="input"
          v-model="form.currentPassword"
          type="password"
          required
        />
      </field-horizontal>
      <hr>
      <field-horizontal
        label="Nueva Contraseña"
        message="Required. New password"
      >
        <input class="input"
            :class="{ 'is-danger': diferentPass }"
            @blur="checkPass()"

          v-model="form.newPassword"
          type="password"
          required
        />
          <span v-if="diferentPass" class="help is-danger">Las contraseñas no coinciden</span>

      </field-horizontal>
      <field-horizontal
        label="Confirmar contraseña"
        message="Required. New password one more time"
      >
        <input class="input"
            :class="{ 'is-danger': diferentPass }"
            @blur="checkPass()"

          v-model="form.passwordConfirmation"
          type="password"
          required
        />
          <span v-if="diferentPass" class="help is-danger">Las contraseñas no coinciden</span>

      </field-horizontal>
      <hr>
      <field-horizontal>
        <div class="control">
          <button
            class="button is-primary"
            :class="{'isLoading':isLoading}"
          >
            Cambiar contraseña
          </button>
        </div>
      </field-horizontal>

    </form>
  </card-component>
</template>

<script setup>
import CardComponent from '@/components/Shared/CardComponent.vue'
import { toast } from '@/utils/toast'
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import FieldHorizontal from '../Shared/FieldHorizontal.vue'

const diferentPass = ref(false)

const store = useStore()
const isLoading = ref(false)
const formPass = ref()
const form = reactive({
  currentPassword: null,
  newPassword: null,
  passwordConfirmation: null
})

const checkPass = () => {
  if (form.newPassword !== form.passwordConfirmation) {
    diferentPass.value = true
  } else {
    diferentPass.value = false
  }
}

const submit = async () => {
  isLoading.value = true
  const res = await store.dispatch('changePassword', form)
  if (!res.success) {
    toast.danger(res.message, 4000)
    return
  }
  toast.success(res.message, 4000)
  formPass.value.reset()
}
</script>
