<script setup lang="ts">
import type { Task } from '../../types.ts'
import { useTasks } from '../../composables/useTasks.ts'

const { createTask } = useTasks()

async function handleSubmit(e: Event) {
  const data = new FormData(e.target as HTMLFormElement)
  const task = Object.fromEntries(data) as unknown as Pick<Task, 'tag' | 'title' | 'due_date'>

  await createTask(task)
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <fieldset class="fieldset">
      <input type="text" class="input input-xl input-neutral w-full" name="title" placeholder="Task">
    </fieldset>
    <fieldset class="fieldset">
      <select class="select select-xl select-neutral w-full" name="tag">
        <option selected value="@uncategorized">
          @uncategorized
        </option>
        <option value="@home">
          @home
        </option>
        <option value="@work">
          @work
        </option>
      </select>
    </fieldset>
    <button class="btn btn-xl btn-neutral btn-outline w-full">
      Submit
    </button>
  </form>
</template>

<style scoped>

</style>
