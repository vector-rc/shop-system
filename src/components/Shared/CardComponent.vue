<template>
    <div class="card" >
        <header v-if="title" class="card-header">
            <p class="card-header-title">
                <Icon size="25">
                    <component v-if="props.icon" :is="props.icon" />
                </Icon>
                {{ props.title }}
            </p>
            <a
                v-if="headerIcon"
                href="#"
                class="card-header-icon"
                aria-label="more options"
                @click.prevent="emit('header-icon-click')"
            >
                <Icon size="25">
                    <component v-if="props.headerIcon" :is="props.headerIcon" />
                </Icon>
            </a>
        </header>
        <div class="card-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts" >
import { Icon } from '@vicons/utils'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  icon: {
    type: [Object, String],
    default: null
  },
  headerIcon: {
    type: String,
    default: null
  }
})
const emit = defineEmits(['header-icon-click'])

</script>

<style>
.card hr{
width: 100%;
height: 1px;
margin: 1rem 0;
}
</style>
