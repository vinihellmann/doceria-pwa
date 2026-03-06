import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { STORAGE_KEYS } from '@/utils/storage'
import { generateId } from '@/utils/ids'
import type { Candy } from '@/types/candy'
import type { Proposal, ProposalItem } from '@/types/proposal'

const proposals = useLocalStorage<Proposal[]>(STORAGE_KEYS.proposals, [])

function toProposalItem(candy: Candy): ProposalItem {
  return {
    candyId: candy.id,
    candyName: candy.name,
    unitPrice: candy.price,
    quantity: 1,
    description: candy.description,
    ingredients: [...candy.ingredients],
    imageDataUrl: candy.imageDataUrl
  }
}

export function calculateProposalTotal(items: ProposalItem[]) {
  return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
}

export function useProposals() {
  const allProposals = computed(() =>
    [...proposals.value].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )

  function getProposalById(id: string) {
    return proposals.value.find((proposal) => proposal.id === id) ?? null
  }

  function createDraft(title = ''): Proposal {
    return {
      id: generateId(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
      total: 0
    }
  }

  function addCandyToDraft(draft: Proposal, candy: Candy) {
    const existing = draft.items.find((item) => item.candyId === candy.id)

    if (existing) {
      existing.quantity += 1
    } else {
      draft.items.push(toProposalItem(candy))
    }

    draft.total = calculateProposalTotal(draft.items)
    draft.updatedAt = new Date().toISOString()
  }

  function removeItemFromDraft(draft: Proposal, candyId: string) {
    draft.items = draft.items.filter((item) => item.candyId !== candyId)
    draft.total = calculateProposalTotal(draft.items)
    draft.updatedAt = new Date().toISOString()
  }

  function updateItemQuantity(draft: Proposal, candyId: string, quantity: number) {
    const item = draft.items.find((entry) => entry.candyId === candyId)
    if (!item) return

    item.quantity = Math.max(1, quantity)
    draft.total = calculateProposalTotal(draft.items)
    draft.updatedAt = new Date().toISOString()
  }

  function saveProposal(draft: Proposal) {
    const timestamp = new Date().toISOString()
    const proposal: Proposal = {
      ...draft,
      title: draft.title.trim() || `Proposta ${new Date().toLocaleDateString('pt-BR')}`,
      updatedAt: timestamp,
      total: calculateProposalTotal(draft.items)
    }

    const index = proposals.value.findIndex((entry) => entry.id === proposal.id)

    if (index >= 0) {
      proposals.value[index] = proposal
    } else {
      proposals.value.unshift({
        ...proposal,
        createdAt: timestamp
      })
    }

    return proposal.id
  }

  function removeProposal(id: string) {
    proposals.value = proposals.value.filter((proposal) => proposal.id !== id)
  }

  return {
    proposals: allProposals,
    getProposalById,
    createDraft,
    addCandyToDraft,
    removeItemFromDraft,
    updateItemQuantity,
    saveProposal,
    removeProposal
  }
}
