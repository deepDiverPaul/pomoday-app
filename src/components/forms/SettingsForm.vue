<script setup lang="ts">
import { useSettings } from '../../composables/useSettings.ts'

const { settings } = useSettings()
const themes = ['default', 'black', 'cyberpunk', 'forest', 'halloween', 'luxury', 'retro', 'synthwave', 'valentine', 'wireframe', 'aqua']
</script>

<template>
  <form @submit.prevent>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        API Key
      </legend>
      <input v-model="settings.accessKey" type="password" class="input" name="accessKey">
    </fieldset>
    <div class="dropdown mb-72">
      <div tabindex="0" role="button" class="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          class="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </div>
      <ul tabindex="-1" class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
        <li v-for="theme in themes" :key="theme">
          <input
            v-model="settings.theme"
            type="radio"
            name="theme-dropdown"
            class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
            :aria-label="theme.charAt(0).toUpperCase() + theme.slice(1)"
            :value="theme"
          >
        </li>
      </ul>
    </div>
  </form>
</template>
