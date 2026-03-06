<template>
  <section v-if="proposal" class="stack">
    <div class="page-head">
      <div>
        <h1>{{ proposal.title }}</h1>
        <p>
          Criada em {{ createdAt }} · {{ proposal.items.length }} item(ns) ·
          total {{ formatCurrency(proposal.total) }}
        </p>
      </div>

      <div class="actions">
        <RouterLink class="btn ghost" to="/propostas">Voltar</RouterLink>
        <button class="btn primary" @click="handlePdf">Gerar PDF</button>
      </div>
    </div>

    <div class="grid cards-2">
      <article v-for="item in proposal.items" :key="item.candyId" class="card stack">
        <img
          v-if="item.imageDataUrl"
          :src="item.imageDataUrl"
          :alt="item.candyName"
          class="thumb"
        />
        <div v-else class="thumb" style="display:grid;place-items:center;color:#8a5574">
          Sem foto
        </div>

        <div class="list-row" style="align-items:start">
          <div>
            <h2 style="margin:0">{{ item.candyName }}</h2>
            <p class="meta">Quantidade: {{ item.quantity }}</p>
          </div>
          <strong class="price">{{ formatCurrency(item.unitPrice * item.quantity) }}</strong>
        </div>

        <p class="muted">{{ item.description }}</p>

        <div class="badges">
          <span v-for="ingredient in item.ingredients" :key="ingredient" class="badge">
            {{ ingredient }}
          </span>
        </div>
      </article>
    </div>

    <article class="card">
      <div class="list-row">
        <strong>Total da proposta</strong>
        <strong class="price">{{ formatCurrency(proposal.total) }}</strong>
      </div>
    </article>
  </section>

  <section v-else>
    <EmptyState
      title="Proposta não encontrada"
      description="Ela pode ter sido removida ou o identificador não existe mais."
    >
      <RouterLink class="btn primary" to="/propostas">Voltar para propostas</RouterLink>
    </EmptyState>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import { useProposals } from '@/composables/useProposals'
import { useProposalPdf } from '@/composables/useProposalPdf'
import { formatCurrency } from '@/utils/currency'

const route = useRoute()
const { getProposalById } = useProposals()
const { generateProposalPdf } = useProposalPdf()

const proposal = computed(() => getProposalById(String(route.params.id || '')))

const createdAt = computed(() => {
  if (!proposal.value) return ''
  return new Date(proposal.value.createdAt).toLocaleString('pt-BR')
})

async function handlePdf() {
  if (!proposal.value) return

  try {
    await generateProposalPdf(proposal.value)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Falha ao gerar o PDF desta proposta.'
    window.alert(message)
  }
}
</script>
