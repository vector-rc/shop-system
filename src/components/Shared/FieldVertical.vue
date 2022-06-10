<template>
    <div class="field">
          <label class="label">{{props.label}}</label>

         <slot></slot>
        </div>
</template>
<script setup>
const props = defineProps({ label: String })
</script>
