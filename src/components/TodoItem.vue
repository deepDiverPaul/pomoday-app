<script setup lang="ts">
import type { Task } from '../types.ts'
import { PhCheckSquare, PhFlag, PhPlay, PhSquare } from '@phosphor-icons/vue'
import { DateTime } from 'luxon'
import { computed, ref } from 'vue'
import { useTasks } from '../composables/useTasks.ts'
import { TaskStatus } from '../types.ts'

const { task } = defineProps<{ task: Task }>()

const { updateTask } = useTasks()

const dueColor = computed(() => {
  const dueDiff = task.dueDate ? DateTime.fromMillis(task.dueDate).diffNow('days').days : undefined
  if (!dueDiff)
    return ''
  if (dueDiff < 0) {
    return 'text-error'
  }
  else if (dueDiff < 2) {
    return 'text-warning'
  }
  else if (dueDiff < 7) {
    return 'text-success'
  }
  else {
    return 'text-neutral'
  }
})

const statusSelectVisible = ref(false)

async function handleClick(update: Partial<Task>) {
  updateTask({ ...task, ...update })
  statusSelectVisible.value = false
}
</script>

<template>
  <li class="">
    <div class="font-mono text-sm flex flex-row justify-start gap-4">
      <span>{{ String(task.id_).padStart(3, '&nbsp;') }}</span>
      <div class="flex items-center justify-center">
        <PhSquare v-if="task.status === TaskStatus.WAIT" :size="16" />
        <PhCheckSquare v-else-if="task.status === TaskStatus.DONE" :size="16" weight="fill" class="text-success" />
        <PhFlag v-else-if="task.status === TaskStatus.FLAG" :size="16" weight="fill" class="text-warning" />
        <PhPlay v-else-if="task.status === TaskStatus.WIP" :size="16" weight="fill" class="text-info" />
      </div>
      <span>{{ task.title }}</span>
      <span v-if="task.dueDate" :class="dueColor">
        {{ DateTime.fromMillis(task.dueDate).toFormat('dd/MM/yyyy') }}
      </span>
    </div>
  </li>
</template>

<style scoped>

</style>
