<template>
  <div v-if="visible" class="banner-floating">
    <div class="banner">
      <strong>Instale a doceria como app</strong>
      <p class="muted">
        Abra em modo app no celular ou computador e continue usando mesmo offline.
      </p>

      <div class="actions" style="margin-top: 0.85rem">
        <button class="btn primary" @click="install">Instalar</button>
        <button class="btn ghost" @click="dismiss">Agora não</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type DeferredPrompt = Event & {
  prompt: () => Promise<void>
}

const deferredPrompt = ref<DeferredPrompt | null>(null)
const dismissed = ref(false)

const visible = computed(() => !!deferredPrompt.value && !dismissed.value)

function dismiss() {
  dismissed.value = true
}

async function install() {
  if (!deferredPrompt.value) return
  await deferredPrompt.value.prompt()
  deferredPrompt.value = null
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt.value = event as DeferredPrompt
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
  })
})
</script>
