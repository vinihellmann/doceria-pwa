<template>
  <section class="stack">
    <div class="page-head">
      <div>
        <h1>Doces</h1>
        <p>Cadastre, edite e reutilize os doces nas propostas.</p>
      </div>

      <RouterLink class="btn primary" to="/doces/novo">Novo doce</RouterLink>
    </div>

    <EmptyState
      v-if="!candies.length"
      title="Nenhum doce cadastrado"
      description="Comece cadastrando o primeiro doce com foto, preço, descrição e ingredientes."
    >
      <RouterLink class="btn primary" to="/doces/novo">Cadastrar doce</RouterLink>
    </EmptyState>

    <div v-else class="grid cards-3">
      <CandyCard
        v-for="candy in candies"
        :key="candy.id"
        :candy="candy"
        @edit="goToEdit"
        @remove="remove"
        @select="goToProposalWithCandy"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import CandyCard from '@/components/CandyCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useCandies } from '@/composables/useCandies'
import type { Candy } from '@/types/candy'

const router = useRouter()
const { candies, removeCandy } = useCandies()

function goToEdit(id: string) {
  router.push(`/doces/${id}/editar`)
}

function remove(id: string) {
  if (!window.confirm('Deseja excluir este doce?')) return
  removeCandy(id)
}

function goToProposalWithCandy(candy: Candy) {
  router.push({
    path: '/propostas/nova',
    query: { candyId: candy.id }
  })
}
</script>
