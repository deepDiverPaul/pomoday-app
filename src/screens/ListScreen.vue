<script setup lang="ts">
import type { Task } from '../types.ts'
import { PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'

import { computed, onMounted, ref } from 'vue'
import TodoItem from '../components/TodoItem.vue'
import { useTasks } from '../composables/useTasks.ts'

const { tasks, fetchTasks } = useTasks()

onMounted(async () => {
  await fetchTasks()
})

const visibleTasks = computed<Task[]>(() => tasks.value.filter(task => !task.archived).sort((a, b) => a.id_ - b.id_))

const categorizedTasks = computed(() => visibleTasks.value.reduce((acc, task) => {
  const tag = task.tag ?? '@uncategorized'
  acc[tag] = acc[tag] ?? []
  acc[tag].push(task)
  return acc
}, {} as Record<string, Task[]>))

const collapsed = ref<string[]>([])
</script>

<template>
  <div>
    <div class="flex flex-col gap-4">
      <div v-for="(tasks, category) in categorizedTasks" :key="category" class="m-4 rounded-box border border-neutral-100 shadow-md">
        <div class="m-4 flex justify-between items-center">
          <div class="badge badge-xl badge-primary">
            {{ category }}
          </div>
          <button
            class="btn btn-square   btn-sm"
            @click="collapsed.includes(category) ? collapsed.splice(collapsed.indexOf(category), 1) : collapsed.push(category)"
          >
            <PhCaretDown v-if="collapsed.includes(category)" :size="20" />
            <PhCaretUp v-else :size="20" />
          </button>
        </div>
        <Transition name="fade">
          <ul v-if="!collapsed.includes(category)" class="list bg-base-100 rounded-box">
            <TodoItem v-for="task in tasks.sort((a, b) => a.id_ - b.id_)" :key="task.id" :task />
          </ul>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
