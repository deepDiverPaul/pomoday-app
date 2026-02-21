<script setup lang="ts">
import { PhCheckSquare, PhDotsThree, PhFlag, PhPause, PhPlay, PhSquare, PhX } from '@phosphor-icons/vue';
import { TaskStatus, Task } from '../types.ts';
import { DateTime } from 'luxon';
import { computed, ref } from 'vue';
import { useTasks } from '../composables/useTasks.ts';

const {updateTask} = useTasks()

const {task} = defineProps<{task: Task}>()

const dueColor = computed(() => {
  const dueDiff = task.dueDate ? DateTime.fromMillis(task.dueDate).diffNow('days').days : undefined;
  if (!dueDiff) return '';
  if (dueDiff < 0) {
    return 'text-error'
  } else if (dueDiff < 2) {
    return 'text-warning';
  } else if (dueDiff < 7) {
    return 'text-success';
  } else {
    return 'text-neutral';
  }
})

const statusSelectVisible = ref(false);

const handleClick = async(update: Partial<Task>) => {
  updateTask({...task, ...update})
  statusSelectVisible.value = false;
}
</script>

<template>
  <li class="list-row" >
    <div class="flex items-center justify-center">
      <button class="btn btn-square btn-ghost" @click="statusSelectVisible = !statusSelectVisible">
        <PhX :size="20" v-if="statusSelectVisible" />
        <template v-else>
          <PhSquare v-if="task.status === TaskStatus.WAIT" :size="20" />
          <PhCheckSquare v-else-if="task.status === TaskStatus.DONE" :size="20" weight="fill" class="text-success" />
          <PhFlag v-else-if="task.status === TaskStatus.FLAG" :size="20" weight="fill" class="text-warning" />
          <PhPlay v-else-if="task.status === TaskStatus.WIP" :size="20" weight="fill" class="text-info" />
        </template>
      </button>
      <Transition>
        <div v-if="statusSelectVisible" class="">
          <template v-if="task.status !== TaskStatus.WIP">
            <button v-if="task.status !== TaskStatus.DONE" class="btn btn-square btn-ghost" @click="handleClick({status: TaskStatus.DONE})">
              <PhCheckSquare :size="24" weight="regular" class="text-success" />
            </button>
            <button v-if="task.status !== TaskStatus.WAIT" class="btn btn-square btn-ghost" @click="handleClick({status: TaskStatus.WAIT})">
              <PhSquare :size="24" weight="regular" />
            </button>
            <button v-if="task.status !== TaskStatus.FLAG" class="btn btn-square btn-ghost" @click="handleClick({status: TaskStatus.FLAG})">
              <PhFlag :size="24" weight="fill" class="text-warning" />
            </button>
            <button class="btn btn-square btn-ghost" @click="handleClick({status: TaskStatus.WIP})">
              <PhPlay :size="24" weight="fill" class="text-info" />
            </button>
          </template>
          <button v-else class="btn btn-square btn-ghost" @click="handleClick({status: TaskStatus.WAIT})">
            <PhPause :size="24" weight="fill" class="text-info" />
          </button>
        </div>
      </Transition>
    </div>
    <div class="flex flex-col justify-center">
      <div>{{task.title}}</div>
      <div :class="dueColor" v-if="task.dueDate">{{DateTime.fromMillis(task.dueDate).toFormat('dd/MM/yyyy')}}</div>
    </div>
    <button class="btn btn-square btn-ghost">
      <PhDotsThree :size="24" weight="regular" />
    </button>
  </li>
</template>

<style scoped>

</style>
