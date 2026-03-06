<template>
  <section class="stack">
    <div class="page-head">
      <div>
        <h1>Propostas</h1>
        <p>Consulte propostas salvas no navegador e reabra quando quiser.</p>
      </div>

      <RouterLink class="btn primary" to="/propostas/nova">Nova proposta</RouterLink>
    </div>

    <EmptyState
      v-if="!proposals.length"
      title="Nenhuma proposta salva"
      description="Crie uma proposta escolhendo doces já cadastrados."
    >
      <RouterLink class="btn primary" to="/propostas/nova">Criar proposta</RouterLink>
    </EmptyState>

    <div v-else class="grid cards-2">
      <ProposalCard
        v-for="proposal in proposals"
        :key="proposal.id"
        :proposal="proposal"
        @open="openProposal"
        @remove="remove"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import ProposalCard from '@/components/ProposalCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useProposals } from '@/composables/useProposals'

const router = useRouter()
const { proposals, removeProposal } = useProposals()

function openProposal(id: string) {
  router.push(`/propostas/${id}`)
}

function remove(id: string) {
  if (!window.confirm('Deseja excluir esta proposta?')) return
  removeProposal(id)
}
</script>
