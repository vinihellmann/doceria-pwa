<template>
  <section class="stack">
    <div class="page-head">
      <div>
        <h1>Nova proposta</h1>
        <p>Selecione doces do catálogo e salve um snapshot local da proposta.</p>
      </div>

      <RouterLink class="btn ghost" to="/propostas">Voltar</RouterLink>
    </div>

    <div class="proposal-layout">
      <section class="stack">
        <article class="card">
          <div class="field">
            <label for="title">Título da proposta</label>
            <input
              id="title"
              v-model.trim="draft.title"
              type="text"
              placeholder="Ex.: Festa de aniversário da Sofia"
            />
          </div>
        </article>

        <article class="card stack">
          <div>
            <h2 class="section-title">Catálogo de doces</h2>
            <p class="section-subtitle">Ao adicionar, a proposta recebe uma cópia dos dados do doce.</p>
          </div>

          <EmptyState
            v-if="!candies.length"
            title="Cadastre doces primeiro"
            description="Sem doces cadastrados, não há itens para incluir na proposta."
          >
            <RouterLink class="btn primary" to="/doces/novo">Cadastrar doce</RouterLink>
          </EmptyState>

          <div v-else class="grid cards-2">
            <article v-for="candy in candies" :key="candy.id" class="card soft stack">
              <div class="list-row" style="align-items:start">
                <div>
                  <h3 style="margin:0">{{ candy.name }}</h3>
                  <p class="meta">{{ formatCurrency(candy.price) }}</p>
                </div>
                <button class="btn primary" @click="addCandy(candy.id)">Adicionar</button>
              </div>
              <p class="muted">{{ candy.description }}</p>
            </article>
          </div>
        </article>
      </section>

      <aside class="stack">
        <article class="card stack">
          <div>
            <h2 class="section-title">Itens da proposta</h2>
            <p class="section-subtitle">Os preços ficam congelados na proposta no momento da seleção.</p>
          </div>

          <EmptyState
            v-if="!draft.items.length"
            title="Nenhum item adicionado"
            description="Escolha um doce no catálogo ao lado."
          />

          <div v-else class="stack">
            <div v-for="item in draft.items" :key="item.candyId" class="card soft">
              <div class="list-row">
                <div>
                  <strong>{{ item.candyName }}</strong>
                  <p class="meta">{{ formatCurrency(item.unitPrice) }} cada</p>
                </div>

                <button class="btn danger" @click="removeItem(item.candyId)">Remover</button>
              </div>

              <div class="inline-input" style="margin-top:0.75rem">
                <input
                  :value="item.quantity"
                  type="number"
                  min="1"
                  @change="changeQuantity(item.candyId, $event)"
                />
                <div class="badge">Subtotal: {{ formatCurrency(item.unitPrice * item.quantity) }}</div>
              </div>
            </div>
          </div>

          <div class="card soft">
            <div class="list-row">
              <span>Total</span>
              <strong class="price">{{ formatCurrency(draft.total) }}</strong>
            </div>
          </div>

          <button class="btn primary full" :disabled="!draft.items.length" @click="save">
            Salvar proposta
          </button>
        </article>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import { useCandies } from '@/composables/useCandies'
import { useProposals } from '@/composables/useProposals'
import { formatCurrency } from '@/utils/currency'

const router = useRouter()
const route = useRoute()

const { candies, getCandyById } = useCandies()
const {
  createDraft,
  addCandyToDraft,
  removeItemFromDraft,
  updateItemQuantity,
  saveProposal
} = useProposals()

const draft = reactive(createDraft(''))

function addCandy(candyId: string) {
  const candy = getCandyById(candyId)
  if (!candy) return
  addCandyToDraft(draft, candy)
}

function removeItem(candyId: string) {
  removeItemFromDraft(draft, candyId)
}

function changeQuantity(candyId: string, event: Event) {
  const input = event.target as HTMLInputElement
  updateItemQuantity(draft, candyId, Number(input.value))
}

function save() {
  const proposalId = saveProposal(draft)
  router.push(`/propostas/${proposalId}`)
}

const initialCandyId = String(route.query.candyId || '')
if (initialCandyId) {
  addCandy(initialCandyId)
}
</script>
