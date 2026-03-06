<template>
  <article class="card stack">
    <div class="list-row" style="align-items:start">
      <div>
        <h3 style="margin: 0">{{ proposal.title }}</h3>
        <p class="meta">
          {{ formattedDate }} · {{ proposal.items.length }} item(ns)
        </p>
      </div>
      <strong class="price">{{ formatCurrency(proposal.total) }}</strong>
    </div>

    <div class="badges">
      <span v-for="item in proposal.items.slice(0, 4)" :key="item.candyId" class="badge">
        {{ item.candyName }} × {{ item.quantity }}
      </span>
    </div>

    <div class="actions">
      <button class="btn ghost" @click="$emit('open', proposal.id)">Ver detalhes</button>
      <button class="btn danger" @click="$emit('remove', proposal.id)">Excluir</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Proposal } from '@/types/proposal'
import { formatCurrency } from '@/utils/currency'

const props = defineProps<{
  proposal: Proposal
}>()

defineEmits<{
  open: [id: string]
  remove: [id: string]
}>()

const formattedDate = computed(() =>
  new Date(props.proposal.createdAt).toLocaleString('pt-BR')
)
</script>
