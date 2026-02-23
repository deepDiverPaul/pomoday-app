<script setup lang="ts">
import { onClickOutside, onKeyStroke, onStartTyping } from '@vueuse/core'
import { ref, useTemplateRef, watchEffect } from 'vue'
import useActions from '../composables/useActions.ts'
import useHistory from '../composables/useHistory.ts'
import { useTasks } from '../composables/useTasks.ts'
import HelpPanel from './HelpPanel.vue'

const inputComponent = useTemplateRef('inputComponent')
const value = ref('')

const { run } = useActions()
const { pushHistory, matchHistory, historyItem, moveHistory, resetHistoryIndex } = useHistory()
const { tasks } = useTasks()

const inputActive = ref(false)
const showHelp = ref(false)

const suggestion = ref('')
const rememberTemp = ref('')

function resetInput() {
  value.value = ''
  suggestion.value = ''
  rememberTemp.value = value.value = ''
  resetHistoryIndex()
  inputActive.value = false
  inputComponent?.value?.blur()
}

onKeyStroke('Escape', (e) => {
  e.preventDefault()
  resetInput()
})

onClickOutside(inputComponent, resetInput)

onKeyStroke(' ', (e) => {
  if (!inputActive.value) {
    e.preventDefault()
    showHelp.value = true
    inputActive.value = true
    inputComponent?.value?.focus()
  }
})

onStartTyping(() => {
  showHelp.value = false
  inputActive.value = true
  inputComponent?.value?.focus()
})

function handleSubmit() {
  run(value.value)
  pushHistory(value.value)
  resetInput()
}

onKeyStroke('Tab', (e) => {
  if (inputActive.value && suggestion.value.length > 0) {
    e.preventDefault()
    value.value = suggestion.value
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (inputActive.value) {
    e.preventDefault()
    if (suggestion.value.trim().length > 0) {
      moveHistory('up')
    }
    else {
      rememberTemp.value = value.value
    }
    value.value = historyItem.value
  }
  else {
    inputActive.value = true
    inputComponent?.value?.focus()
    value.value = ''
  }
})

onKeyStroke('ArrowDown', (e) => {
  if (inputActive.value) {
    e.preventDefault()
    if (suggestion.value.trim().length > 0) {
      const before = historyItem.value
      moveHistory('down')
      const after = historyItem.value
      if (before !== after) {
        value.value = after
      }
      else {
        value.value = rememberTemp.value
      }
    }
  }
})

watchEffect(() => {
  let match = ''
  if (value.value.length > 0) {
    const isEditCommand = value.value.match(/^e(?:dit)? (\d+)\s?$/i)
    if (isEditCommand && isEditCommand[1]) {
      const id = Number.parseInt(isEditCommand[1])
      if (id && !Number.isNaN(id)) {
        const found = (tasks.value.filter(t => t.id_ === id) || []).pop()
        if (found) {
          match = `${value.value.trim()} ${found.title}`
        }
      }
    }
    else {
      match = matchHistory(value.value.trim())
    }
  }
  suggestion.value = match
})
</script>

<template>
  <form class="flex bottom-0 right-0 left-0 top-0 justify-center items-center flex-col gap-6 transition-opacity duration-500 bg-primary/10 " :class=" inputActive ? 'fixed' : 'opacity-0' " @submit.prevent="handleSubmit">
    <div class="font-mono w-10/12 max-w-md relative h-10">
      <div class="absolute top-0 left-0 right-0 bottom-0 bg-white px-4 py-2">
        {{ suggestion }}
      </div>
      <input
        ref="inputComponent"
        v-model="value" type="text"
        class="absolute top-0 left-0 right-0 bottom-0 bg-white/40 px-4 py-2 rounded-lg shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary h-full w-full"
      >
    </div>
    <div v-if="showHelp" class="bg-white/70 backdrop-blur-xs p-6 rounded-lg shadow-xl text-center">
      <HelpPanel />
    </div>
  </form>
</template>

<style scoped>

</style>
