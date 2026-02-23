<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
import { onKeyStroke, useMagicKeys, whenever } from '@vueuse/core'

import { useTemplateRef } from 'vue'
import { useSettings } from '../composables/useSettings.ts'

const { settings } = useSettings()

const settingsModal = useTemplateRef('settingsModal')

const keys = useMagicKeys()

whenever(keys.meta_slash, () => {
  settingsModal?.value?.showModal()
})

onKeyStroke('Escape', (e) => {
  if (settingsModal?.value?.open) {
    e.preventDefault()
    settingsModal?.value?.close()
  }
})
</script>

<template>
  <div>
    <dialog ref="settingsModal" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <PhX size="24" />
          </button>
        </form>
        <form @submit.prevent>
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              Username
            </legend>
            <input v-model="settings.username" type="text" class="input" name="username">
          </fieldset>
          <fieldset class="fieldset">
            <legend class="fieldset-legend">
              Password
            </legend>
            <input v-model="settings.password" type="text" class="input" name="password">
          </fieldset>
        </form>
      </div>
    </dialog>
  </div>
</template>

<style scoped>

</style>
