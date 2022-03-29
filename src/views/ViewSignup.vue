<template>
  <CardComponent :icon="PersonAdd20Filled" title="Registrar nuevo usuario">
    <form @submit.prevent="login" ref="form">
      <field-horizontal label="DNI">
        <div class="control">
          <input
            class="input" :disabled="hasPermissions"
            ref="fieldName"
            v-model="user.dni"
            type="number"
            placeholder="documento de identidad"
          />
        </div>
      </field-horizontal>
      <hr />
      <field-horizontal label="Nombres y Apellidos">
        <div class="control">
          <input
            class="input" :disabled="hasPermissions"
            ref="fieldName"
            required
            v-model="user.fullName"
            type="text"
            placeholder="Nombres y apellidos"
          />
        </div>
      </field-horizontal>
      <hr />
      <field-horizontal label="Contraseña">
        <div class="control">
          <input
            class="input" :disabled="hasPermissions"
            :class="{ 'is-danger': diferentPass }"
            required
            v-model="user.password"
            type="password"
            placeholder="Contraseña"
          />
          <span v-if="diferentPass" class="help is-danger">Las contraseñas no coinciden</span>
        </div>
      </field-horizontal>
      <field-horizontal label="Repetir Contraseña">
        <div class="control">
          <input
            class="input" :disabled="hasPermissions"
            :class="{ 'is-danger': diferentPass }"
            @blur="checkPass()"
            required
            v-model="verifyPassword"
            type="password"
            placeholder="Vuelva a escribir la contraseña"
          />
          <span v-if="diferentPass" class="help is-danger">Las contraseñas no coinciden</span>
        </div>
      </field-horizontal>
      <hr />
      <field-horizontal label="Celular">
        <div class="control">
          <input
            class="input" :disabled="hasPermissions"
            step="0.1"
            v-model="user.mobile"
            type="number"
            placeholder="Numero de celular"
          />
        </div>
      </field-horizontal>
      <hr />
      <field-horizontal label="Email">
        <div class="control">
          <input
            class="input" :disabled="hasPermissions"
            ref="fieldName"
            v-model="user.email"
            type="text"
            placeholder="Correo electronico"
          />
        </div>
      </field-horizontal>
      <hr />
      <field-horizontal>
        <div class="control">
          <button class="button is-primary" :disabled="hasPermissions">Registrar usuario</button>
        </div>
      </field-horizontal>
      <!-- <field-horizontal>
      <label class="label">Tipo de usuario</label>
      <div class="control">
        <select class="input" :disabled="hasPermissions" required v-model="user.role" >
            <option v-for="role of roles" :key="role.id" :value="role.id">{{role.name}}</option>
        </select>
      </div>
      </field-horizontal><hr/>-->
    </form>
  </CardComponent>
</template>

<script setup lang="ts">
import CardComponent from '@/components/Shared/CardComponent.vue'
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import FieldHorizontal from '@/components/Shared/FieldHorizontal.vue'
import { PersonAdd20Filled } from '@vicons/fluent'
import { toast } from '@/utils/toast'

const form = ref()
const store = useStore()
const error = ref(false)
const roles = ref([] as any[])
const hasPermissions = ref(false)
const user = reactive({
  userName: '',
  dni: '',
  fullName: '',
  email: '',
  password: '',
  roleId: '1',
  mobile: ''
})

const verifyPassword = ref('')
const diferentPass = ref(false)

const checkPass = () => {
  if (user.password !== verifyPassword.value) {
    diferentPass.value = true
  } else {
    diferentPass.value = false
  }
}

onMounted(async () => {
  hasPermissions.value = store.state.user.roleId !== 2
  if (hasPermissions.value) {
    toast.danger('No tiene permisos para agregar usuarios', 4000)
  }
  const req = await store.dispatch('fetchRoles')
  roles.value = req.data
})

const login = async () => {
  if (user.password !== verifyPassword.value) {
    diferentPass.value = true
    return
  }
  const res = await store.dispatch('userSignup', { user })
  error.value = res.success

  if (!res.success) {
    toast.danger(res.message, 4000)
    return
  }
  form.value.reset()
  toast.success(res.message, 4000)

  alert('usuario registrado \n UserName: ' + res.data.userName)
}
</script>

<style></style>
