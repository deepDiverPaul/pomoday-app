<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useTasks } from '../composables/useTasks.ts';

import { Task } from '../types.ts';
import { PhCaretDown, PhCaretUp } from '@phosphor-icons/vue';
import TodoItem from '../components/TodoItem.vue';

const { tasks, fetchTasks } = useTasks();

onMounted(async () => {
  await fetchTasks();
})

const visibleTasks = computed<Task[]>(() => tasks.value.filter(task => !task.archived))

const categorizedTasks = computed(() => visibleTasks.value.reduce((acc, task) => {
  const tag = task.tag ?? 'Uncategorized';
  acc[tag] = acc[tag] ?? [];
  acc[tag].push(task);
  return acc;
}, {} as Record<string, Task[]>))

const collapsed = ref<string[]>([]);

</script>

<template>
<div>
  <div class="flex flex-col gap-4">
    <div class="m-4 rounded-box border border-neutral-100 shadow-md" v-for="(tasks, category) in categorizedTasks" :key="category">
      <div class="m-4 flex justify-between items-center">
        <div class="badge badge-xl badge-primary">{{ category }}</div>
        <button
            @click="collapsed.includes(category) ? collapsed.splice(collapsed.indexOf(category), 1) : collapsed.push(category)"
            class="btn btn-square   btn-sm"
        >
          <PhCaretDown :size="20" v-if="collapsed.includes(category)" />
          <PhCaretUp :size="20" v-else />
        </button>
      </div>
      <Transition name="fade">
        <ul v-if="!collapsed.includes(category)" class="list bg-base-100 rounded-box" >
            <TodoItem v-for="task in tasks.sort((a, b) => a.id_ - b.id_)" :key="task.id" :task />
        </ul>
      </Transition>
    </div>

  </div>

</div>
</template>

<style scoped>

</style>
