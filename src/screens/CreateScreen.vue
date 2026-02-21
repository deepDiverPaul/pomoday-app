<script setup lang="ts">
import { fetch } from '@tauri-apps/plugin-http';
import { router } from '../router.ts';
import { Task } from '../types.ts';

const handleSubmit = async(e: Event) => {
  const data = new FormData(e.target as HTMLFormElement);
  const task: Partial<Task> = Object.fromEntries(data)

  const nextId = await fetch(
      'https://automation.deep-node.de/webhook/d49dde4c-530d-46ee-8205-d1357563ac16',
      { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic cGF1bDoxMG1hYmF1MTU=', }}
  ).then((response) => response.json()).then((json) => json.nextId as number).catch(() => null);

  if (!nextId) return;
  task.id_ = nextId;
  task.logs = [];

  await fetch(
      'https://automation.deep-node.de/webhook/e5880167-9322-4d7b-8a38-e06bae8a7734/list',
      { method: 'PUT', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ tasks: [task] } )}
  );
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
