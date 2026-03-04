<script setup lang="ts">
import type { Task } from '../../types.ts'
import { useTasks } from '../../composables/useTasks.ts'

const { createTask } = useTasks()

async function handleSubmit(e: Event) {
  const data = new FormData(e.target as HTMLFormElement)
  const task = Object.fromEntries(data) as unknown as Pick<Task, 'tag' | 'title' | 'dueDate'>

  await createTask(task)
}
</script>

<template>
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
</template>

<style scoped>

</style>
