<script setup lang="ts">
import type { Task } from '../types.ts'
import { ref } from 'vue'
import { useSettings } from '../composables/useSettings.ts'
import TodoItemTouch from './TodoItemTouch.vue'

const { categorizedTasks, today } = defineProps<{ categorizedTasks: Record<string, Task[]>, today: { today: Task[], next7days: Task[] } }>()
const { settings } = useSettings()
const collapsed = ref<string[]>([])
</script>

<template>
  <div class="relative">
    <div class="flex flex-col gap-4">
      <div v-for="(catTasks, category) in categorizedTasks" :key="category" class="m-4 ">
        <div class="mb-4">
          <button class="badge badge-xl badge-neutral badge-outline font-mono font-extrabold" @click="collapsed.includes(category) ? collapsed.splice(collapsed.indexOf(category), 1) : collapsed.push(category)">
            {{ category }} [{{ catTasks.length }}]
          </button>
        </div>
        <Transition name="fade">
          <ul v-if="!collapsed.includes(category)" class="space-y-2">
            <TodoItemTouch v-for="task in catTasks" :key="task.id" :task />
          </ul>
        </Transition>
      </div>
    </div>
    <div :class="{ 'translate-x-full': !settings.todayShown }" class=" transition-transform duration-500 border-l border-t fixed bottom-0 right-0 top-0 w-1/2 max-w-sm text-center text-sm bg-neutral-50">
      <div class="">
        today
      </div><div v-for="task in today.today" :key="task.id">
        {{ task.title }}
      </div>
      <div class="">
        next 7 days
      </div><div v-for="task in today.next7days" :key="task.id">
        {{ task.title }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
