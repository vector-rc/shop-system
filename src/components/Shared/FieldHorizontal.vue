<template>
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label class="label">{{ props.label }}</label>
    </div>
    <div class="field-body">
      <div class="field">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ label: String })
</script>
