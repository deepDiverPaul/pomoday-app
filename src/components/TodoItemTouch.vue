<script setup lang="ts">
import type { UseSwipeDirection } from '@vueuse/core'
import type { Task } from '../types.ts'
import { PhCheckSquare, PhClockCountdown, PhFlag, PhPause, PhPen, PhPlay, PhSquare, PhTrash } from '@phosphor-icons/vue'
import { onClickOutside, useSwipe } from '@vueuse/core'
import { DateTime } from 'luxon'
import { computed, shallowRef, useTemplateRef } from 'vue'
import useActions from '../composables/useActions.ts'
import { TaskStatus } from '../types.ts'
import EditForm from './forms/EditForm.vue'

const { task } = defineProps<{ task: Task }>()

const { run } = useActions()

const dueColor = computed(() => {
  const dueDiff = task.due_date ? DateTime.fromISO(task.due_date).diffNow('days').days : undefined
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

const target = useTemplateRef('target')
const container = useTemplateRef('container')
const containerWidth = computed(() => container.value?.offsetWidth)
const left = shallowRef('0')
const opacity = shallowRef(1)

const modalComponent = useTemplateRef('modalComponent')

function reset() {
  left.value = '0'
  modalComponent.value?.close()
  opacity.value = 1
}
const { isSwiping, lengthX } = useSwipe(
  target,
  {
    passive: false,
    onSwipe(_e: TouchEvent) {
      if (containerWidth.value) {
        if (lengthX.value < 0) {
          const length = Math.abs(lengthX.value)
          left.value = `${length}px`
          opacity.value = 1.1 - length / containerWidth.value
        }
        else {
          left.value = '0'
          opacity.value = 1
        }
      }
    },
    onSwipeEnd(_e: TouchEvent, _direction: UseSwipeDirection) {
      if (lengthX.value < 0 && containerWidth.value && (Math.abs(lengthX.value) / containerWidth.value) >= 0.5) {
        left.value = '100%'
        opacity.value = 0
      }
      else {
        left.value = '0'
        opacity.value = 1
      }
    },
  },
)
async function handleClick(command: string) {
  await run(command)
  reset()
}

onClickOutside(container, reset)
</script>

<template>
  <li ref="container" class="badge badge-xl badge-neutral badge-outline w-full h-auto py-2 select-none relative overflow-hidden">
    <div class=" flex flex-row justify-start gap-2 w-full">
      <template v-if="task.status !== TaskStatus.WIP">
        <button class="btn btn-square btn-ghost" @click="handleClick(`check ${task.id_}`)">
          <PhCheckSquare v-if="task.status !== TaskStatus.DONE" :size="30" class="text-success" /><PhSquare v-else :size="30" />
        </button>
        <button v-if="task.status !== TaskStatus.FLAG" class="btn btn-square btn-ghost" @click="handleClick(`flag ${task.id_}`)">
          <PhFlag :size="30" weight="fill" class="text-warning" />
        </button>
        <button class="btn btn-square btn-ghost" @click="handleClick(`start ${task.id_}`)">
          <PhPlay :size="30" weight="fill" class="text-info" />
        </button>
      </template>
      <button v-else class="btn btn-square btn-ghost" @click="handleClick(`stop ${task.id_}`)">
        <PhPause :size="30" weight="fill" class="text-info" />
      </button>
      <button class="btn btn-square btn-ghost" @click="modalComponent?.showModal()">
        <PhPen :size="30" weight="fill" class="text-info" />
      </button>
      <div class="grow flex justify-end">
        <button class="btn btn-square btn-ghost" @click="handleClick(`delete ${task.id_}`)">
          <PhTrash :size="30" weight="fill" class="text-error" />
        </button>
      </div>
    </div>
    <div ref="target" :class="{ 'transition-all': !isSwiping }" :style="{ left, opacity }" class="top-0 left-0 w-full h-full absolute bg-base-100 text-base-content font-mono text-md font-semibold flex flex-row justify-start items-center gap-2 min-h-10 px-2">
      <div class="flex items-center justify-center">
        <PhSquare v-if="task.status === TaskStatus.WAIT" :size="30" />
        <PhCheckSquare v-else-if="task.status === TaskStatus.DONE" :size="30" weight="fill" class="text-success" />
        <PhFlag v-else-if="task.status === TaskStatus.FLAG" :size="30" weight="fill" class="text-warning" />
        <PhPlay v-else-if="task.status === TaskStatus.WIP" :size="30" weight="fill" class="text-info" />
      </div>
      <div class="grow">
        {{ task.title }}
      </div>
      <div v-if="task.due_date" :class="dueColor" class="text-right">
        <PhClockCountdown :size="30" :weight="dueColor === 'text-error' ? 'fill' : 'regular'" />
      </div>
    </div>
    <dialog ref="modalComponent" class="modal">
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
      <div class="modal-box">
        <EditForm :task="task" @update="reset" />
      </div>
    </dialog>
  </li>
</template>

<style scoped>

</style>
