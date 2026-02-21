<script setup lang="ts">
import { router } from '../router.ts';
import { useTasks } from '../composables/useTasks.ts';
import { Task } from '../types.ts';

const { createTask } = useTasks();

const handleSubmit = async(e: Event) => {
  const data = new FormData(e.target as HTMLFormElement);
  const task: Partial<Task> = Object.fromEntries(data)

  await createTask(task);
  await router.push('/');
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">What is your name?</legend>
        <input type="text" class="input" name="title" placeholder="Type here" />
      </fieldset>
      <button class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<style scoped>

</style>
