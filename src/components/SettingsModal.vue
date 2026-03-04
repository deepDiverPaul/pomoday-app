<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
import { onKeyStroke, useMagicKeys, whenever } from '@vueuse/core'

import { useTemplateRef } from 'vue'
import SettingsForm from './forms/SettingsForm.vue'

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
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <PhX size="24" />
          </button>
        </form>
        <SettingsForm />
      </div>
    </dialog>
  </div>
</template>

<style scoped>

</style>
