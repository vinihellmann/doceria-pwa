<template>
  <article class="card stack">
    <img
      v-if="candy.imageDataUrl"
      :src="candy.imageDataUrl"
      :alt="candy.name"
      class="thumb"
    />
    <div v-else class="thumb" style="display:grid;place-items:center;color:#8a5574">
      Sem foto
    </div>

    <div>
      <div class="list-row" style="align-items:start">
        <div>
          <h3 style="margin: 0">{{ candy.name }}</h3>
          <p class="meta">{{ candy.ingredients.length }} ingrediente(s)</p>
        </div>
        <div class="price">{{ formatCurrency(candy.price) }}</div>
      </div>

      <p class="muted">{{ candy.description }}</p>
    </div>

    <div class="badges">
      <span v-for="ingredient in candy.ingredients" :key="ingredient" class="badge">
        {{ ingredient }}
      </span>
    </div>

    <div class="actions">
      <button class="btn ghost" @click="$emit('edit', candy.id)">Editar</button>
      <button class="btn danger" @click="$emit('remove', candy.id)">Excluir</button>
      <button class="btn primary" @click="$emit('select', candy)">Adicionar à proposta</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Candy } from '@/types/candy'
import { formatCurrency } from '@/utils/currency'

defineProps<{
  candy: Candy
}>()

defineEmits<{
  edit: [id: string]
  remove: [id: string]
  select: [candy: Candy]
}>()
</script>
