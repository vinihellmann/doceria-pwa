<template>
  <div v-if="offlineReady || needRefresh" class="banner-floating">
    <div class="banner">
      <strong v-if="offlineReady">App pronto para uso offline</strong>
      <strong v-else>Nova versão disponível</strong>

      <p class="muted">
        {{
          offlineReady
            ? 'Os arquivos principais foram armazenados e a interface pode continuar funcionando sem rede.'
            : 'Atualize para carregar a versão mais recente do sistema.'
        }}
      </p>

      <div class="actions" style="margin-top: 0.85rem">
        <button v-if="needRefresh" class="btn primary" @click="updateServiceWorker()">
          Atualizar
        </button>
        <button class="btn ghost" @click="close">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker
} = useRegisterSW()

function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>
