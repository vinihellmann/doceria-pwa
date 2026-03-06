<template>
  <section class="stack">
    <div class="page-head">
      <div>
        <h1>Protótipo da doceria</h1>
        <p>
          Base inicial em Vue 3 + PWA para cadastrar doces, montar propostas e evoluir depois
          para geração de PDF.
        </p>
      </div>

      <div class="actions">
        <RouterLink class="btn primary" to="/doces/novo">Novo doce</RouterLink>
        <RouterLink class="btn ghost" to="/propostas/nova">Nova proposta</RouterLink>
      </div>
    </div>

    <div class="kpis">
      <article class="card">
        <span class="meta">Doces cadastrados</span>
        <p class="kpi-value">{{ candies.length }}</p>
      </article>

      <article class="card">
        <span class="meta">Propostas salvas</span>
        <p class="kpi-value">{{ proposals.length }}</p>
      </article>

      <article class="card">
        <span class="meta">Último doce</span>
        <p class="kpi-value" style="font-size:1.15rem">{{ latestCandyName }}</p>
      </article>
    </div>

    <div class="grid cards-2">
      <article class="card stack">
        <div>
          <h2 class="section-title">Fluxo de doces</h2>
          <p class="section-subtitle">
            Cadastro com foto, preço, descrição e ingredientes, salvo localmente.
          </p>
        </div>
        <div class="actions">
          <RouterLink class="btn primary" to="/doces">Ver doces</RouterLink>
          <RouterLink class="btn ghost" to="/doces/novo">Cadastrar doce</RouterLink>
        </div>
      </article>

      <article class="card stack">
        <div>
          <h2 class="section-title">Fluxo de propostas</h2>
          <p class="section-subtitle">
            Seleciona doces já cadastrados, guarda snapshot dos dados e prepara o futuro PDF.
          </p>
        </div>
        <div class="actions">
          <RouterLink class="btn primary" to="/propostas">Ver propostas</RouterLink>
          <RouterLink class="btn ghost" to="/propostas/nova">Criar proposta</RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCandies } from '@/composables/useCandies'
import { useProposals } from '@/composables/useProposals'

const { candies } = useCandies()
const { proposals } = useProposals()

const latestCandyName = computed(() => candies.value[0]?.name ?? 'Nenhum ainda')
</script>
