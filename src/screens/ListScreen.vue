<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useTasks } from '../composables/useTasks.ts';
import { TaskStatus } from '../types.ts';
import { PhCaretDown, PhCaretUp, PhCheckSquare, PhDotsThree, PhPlay, PhSquare } from '@phosphor-icons/vue';

const { tasks, fetchTasks } = useTasks();

onMounted(async () => {
  await fetchTasks();
})

const visibleTasks = computed(() => tasks.value.filter(task => !task.archived))

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
          <li class="list-row"  v-for="task in tasks" :key="task.id">
            <div class="flex items-center justify-center">
              <PhSquare v-if="task.status === TaskStatus.WAIT" :size="20" />
              <PhCheckSquare v-else-if="task.status === TaskStatus.DONE" :size="20" weight="fill" class="text-success" />
              <PhSquare v-else-if="task.status === TaskStatus.FLAG" :size="20" weight="fill" class="text-warning" />
              <PhPlay v-else-if="task.status === TaskStatus.WIP" :size="20" weight="fill" class="text-info" />
            </div>
            <div class="flex items-center gap-2">
              <div>{{task.title}}</div>

            </div>
            <button class="btn btn-square btn-ghost btn-sm">
              <PhDotsThree :size="24" weight="regular" />
            </button>
          </li>


        </ul>
      </Transition>
    </div>

  </div>

</div>
</template>

<style scoped>

</style>
