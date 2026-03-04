import { computed, onMounted, ref } from 'vue'
import { useStore } from './useStore.ts'

const store = ref<string[]>([])
const historyIndex = ref(0)

export default function useHistory() {
  const { getValue, setValue } = useStore()
  const history = computed<string[]>(() => store.value)

  const resetHistoryIndex = () => {
    historyIndex.value = store.value.length - 1
  }
  onMounted(async () => {
    store.value = await getValue('history') || []
    resetHistoryIndex()
  })

  const pushHistory = (item: string) => {
    if (store.value.length > 20)
      store.value.shift()
    store.value.push(item.trim())
    setValue('history', store.value)
  }

  const matchHistory = (item: string) => {
    const match = store.value.filter(i => i.startsWith(item.trim())).pop()
    if (match) {
      historyIndex.value = store.value.indexOf(match)
      return match
    }
    return ''
  }

  const moveHistory = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      historyIndex.value = Math.max(0, historyIndex.value - 1)
    }
    else {
      historyIndex.value = Math.min(store.value.length - 1, historyIndex.value + 1)
    }
  }

  const historyItem = computed(() => store.value[historyIndex.value])

  return { history, pushHistory, matchHistory, moveHistory, historyItem, resetHistoryIndex }
}
