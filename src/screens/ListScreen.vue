<script setup lang="ts">
import type { Task } from '../types.ts'

import { computed, onMounted, ref } from 'vue'
import TodoItem from '../components/TodoItem.vue'
import { useTasks } from '../composables/useTasks.ts'

const { tasks, fetchTasks } = useTasks()

onMounted(async () => {
  await fetchTasks()
})

const visibleTasks = computed<Task[]>(() => tasks.value.filter(task => !task.archived).sort((a, b) => a.id_ - b.id_))

const categorizedTasks = computed(() => {
  const unordered: Record<string, Task[]> = visibleTasks.value.reduce((acc, task) => {
    const tag = task.tag ?? '@uncategorized'
    acc[tag] = acc[tag] ?? []
    acc[tag].push(task)
    return acc
  }, {} as Record<string, Task[]>)
  return Object.keys(unordered).sort().reduce(
    (obj, key) => {
      obj[key] = unordered[key]
      return obj
    },
    {} as Record<string, Task[]>,
  )
})

const collapsed = ref<string[]>([])
</script>

<template>
  <div>
    <div class="flex flex-col gap-4">
      <div v-for="(catTasks, category) in categorizedTasks" :key="category" class="m-4 ">
        <div class="mb-4">
          <button class="px-4 py-1 rounded bg-neutral-200 font-mono text-sm font-bold" @click="collapsed.includes(category) ? collapsed.splice(collapsed.indexOf(category), 1) : collapsed.push(category)">
            {{ category }} [{{ catTasks.length }}]
          </button>
        </div>
        <Transition name="fade">
          <ul v-if="!collapsed.includes(category)" class="">
            <TodoItem v-for="task in catTasks" :key="task.id" :task />
          </ul>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
