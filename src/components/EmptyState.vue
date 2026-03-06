<template>
  <div class="empty-state">
    <h3 style="margin-top: 0">{{ title }}</h3>
    <p>{{ description }}</p>
    <div v-if="$slots.default" style="margin-top: 1rem">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>
