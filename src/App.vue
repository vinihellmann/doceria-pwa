<template>
  <div class="app-layout">
    <AppHeader />
    <main class="container app-main">
      <RouterView />
    </main>
    <InstallPrompt />
    <ReloadPrompt />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import InstallPrompt from '@/components/InstallPrompt.vue'
import ReloadPrompt from '@/components/ReloadPrompt.vue'
</script>
