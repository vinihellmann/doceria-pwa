import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { STORAGE_KEYS } from '@/utils/storage'
import { generateId } from '@/utils/ids'
import type { Candy, CandyPayload } from '@/types/candy'

const candies = useLocalStorage<Candy[]>(STORAGE_KEYS.candies, [])

export function useCandies() {
  const allCandies = computed(() =>
    [...candies.value].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )

  function getCandyById(id: string) {
    return candies.value.find((candy) => candy.id === id) ?? null
  }

  function saveCandy(payload: CandyPayload, candyId?: string) {
    const timestamp = new Date().toISOString()

    if (candyId) {
      const index = candies.value.findIndex((candy) => candy.id === candyId)
      if (index >= 0) {
        candies.value[index] = {
          ...candies.value[index],
          ...payload,
          updatedAt: timestamp
        }
      }
      return candyId
    }

    const candy: Candy = {
      id: generateId(),
      ...payload,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    candies.value.unshift(candy)
    return candy.id
  }

  function removeCandy(id: string) {
    candies.value = candies.value.filter((candy) => candy.id !== id)
  }

  return {
    candies: allCandies,
    getCandyById,
    saveCandy,
    removeCandy
  }
}
