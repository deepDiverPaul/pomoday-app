<script setup lang="ts">
import type { Task } from '../types.ts'
import { PhPlus } from '@phosphor-icons/vue'
import { useTemplateRef } from 'vue'
import { useTasks } from '../composables/useTasks.ts'
import { router } from '../router.ts'

const { createTask } = useTasks()

async function handleSubmit(e: Event) {
  const data = new FormData(e.target as HTMLFormElement)
  const task: Partial<Task> = Object.fromEntries(data)

  await createTask(task)
  await router.push('/')
}
const createModal = useTemplateRef('createModal')
</script>

<template>
  <div>
    <div class="fab">
      <button class="btn btn-xl btn-circle btn-secondary" @click="createModal?.showModal()">
        <PhPlus size="24" weight="bold" />
      </button>
    </div>
    <dialog ref="createModal" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form @submit.prevent="handleSubmit">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              What is your name?
            </legend>
            <input type="text" class="input" name="title" placeholder="Type here">
          </fieldset>
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              Category
            </legend>
            <select class="select" name="tag">
              <option disabled selected value="@uncategorized">
                @uncategorized
              </option>
              <option value="@home">
                @home
              </option>
              <option value="@work">
                Amber
              </option>
            </select>
          </fieldset>
          <button class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </dialog>
  </div>
</template>

<style scoped>

</style>
