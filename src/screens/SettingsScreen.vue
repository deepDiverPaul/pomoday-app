<script setup lang="ts">
import { useStore } from '../composables/useStore.ts';
import { onMounted, ref } from 'vue';

type Settings = {
  username: string,
  password: string
}

const { setValue, getValue } = useStore();

const settingsDefault: Settings = {
  username: '',
  password: '',
}
const settings = ref<Settings>({...settingsDefault});

const initData = async () => {
  const readSettings = await getValue<Settings>('settings');
  settings.value = readSettings ?? {...settingsDefault};
}

const handleSubmit = async (e: Event) => {
  const data = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as Settings
  setValue<Settings>('settings', {
    username: data.username,
    password: data.password,
  });
  await initData();
}
onMounted(initData);
</script>

<template>
<div>
  <form @submit.prevent="handleSubmit">
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Username</legend>
      <input :value="settings.username" type="text" class="input" name="username" />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Password</legend>
      <input type="password" :value="settings.password" class="input" name="password" />
    </fieldset>
    <button class="btn btn-primary" type="submit">Submit</button>
  </form>
</div>
</template>

<style scoped>

</style>
