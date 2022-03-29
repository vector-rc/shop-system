<template>
<label class="button is-link m-2" :class="{'is-outlined':!isCheck}">
{{props.label}}
    <input ref="rb" type="radio" :value="props.value" :name="props.modelValue" @input="emit('update:modelValue',$event.target.value)" style="display: none;" />
</label>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({ label: String, value: String, modelValue: Number })
const emit = defineEmits(['update:modelValue'])

const isCheck = ref(false)
const rb = ref()

watchEffect(() => {
  isCheck.value = props.modelValue === parseInt(props.value)
})
</script>
