<template>

<div class="file has-name">
  <label class="file-label">
    <input class="file-input" type="file" name="resume" @input="upload">
    <span class="file-cta">
      <Icon>
        <arrow-upload20-filled/>
        </Icon>
      <span class="file-label">
        {{ buttonLabel }}
      </span>
    </span>
   <span
      v-if="file"
      class="file-name"
    >{{ props.file.name }}</span>
  </label>
</div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@vicons/utils'
import { ArrowUpload20Filled } from '@vicons/fluent'

const props = defineProps({
  accept: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'is-primary'
  }
})
const emit = defineEmits(['input'])

const file = ref(null)
// uploadPercent: 0

const buttonLabel = computed(() => {
  return file.value ? 'Pick another file' : 'Pick a file'
}
)
const upload = (value) => {
  file.value = value

  emit('input', value)

  // Use this as an example for handling file uploads
  // let formData = new FormData()
  // formData.append('file', file.value)

  // const mediaStoreRoute = `/your-route/`

  // axios
  //   .post(mediaStoreRoute, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     },
  //     onUploadProgress: progressEvent
  //   })
  //   .then(r => {
  //
  //   })
  //   .catch(err => {
  //
  //   })
}
// progressEvent (progressEvent) {
//   this.uploadPercent = Math.round(
//     (progressEvent.loaded * 100) / progressEvent.total
//   )
// }

</script>
