import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T): Ref<T> {
  const stored = localStorage.getItem(key)
  const state = ref(stored ? JSON.parse(stored) : initialValue) as Ref<T>

  watch(
    state,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true }
  )

  return state
}
