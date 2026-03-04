<script setup lang="ts">
import type { Task } from '../types.ts'

import { useMediaQuery } from '@vueuse/core'
import { DateTime } from 'luxon'
import { computed, onMounted } from 'vue'
import TodoList from '../components/TodoList.vue'
import TodoListTouch from '../components/TodoListTouch.vue'
import { useTasks } from '../composables/useTasks.ts'

const { tasks, fetchTasks } = useTasks()

onMounted(async () => {
  await fetchTasks()
})
const isMobile = useMediaQuery('(pointer: coarse)')

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

const today = computed(() => {
  const now = DateTime.now().startOf('day')
  const tasksDue = visibleTasks.value.filter(task => task.dueDate)
  const today = tasksDue.filter(task => now.diff(DateTime.fromMillis(task.dueDate ?? 0), 'days').toObject().days === 0)
  const next7days = tasksDue.filter((task) => {
    const diff = now.diff(DateTime.fromMillis(task.dueDate ?? 0), 'days').toObject()
    return diff.days && diff.days < 0 && diff.days >= -7
  })
  return { today, next7days }
})
</script>

<template>
  <component :is="isMobile ? TodoListTouch : TodoList" :today="today" :categorized-tasks="categorizedTasks" />
</template>

<style scoped>

</style>
