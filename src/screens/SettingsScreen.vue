<script setup lang="ts">
import { useSettings } from '../composables/useSettings.ts';

const { settings } = useSettings();
</script>

<template>
<div>
  <form>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Username</legend>
      <input v-model="settings.username" type="text" class="input" name="username" />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Password</legend>
      <input v-model="settings.password" type="text" class="input" name="password" />
    </fieldset>
  </form>
</div>
</template>

<style scoped>

</style>
