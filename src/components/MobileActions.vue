<script setup lang="ts">
import { PhDotsNine, PhPlus, PhSliders, PhX } from '@phosphor-icons/vue'
import { ref, useTemplateRef } from 'vue'
import CreateForm from './forms/CreateForm.vue'
import EditForm from './forms/EditForm.vue'
import SettingsForm from './forms/SettingsForm.vue'

const modalComponent = useTemplateRef('modalComponent')

type ModalShown = 'create' | 'edit' | 'settings'

const modalShown = ref<ModalShown>()

const componentMap = {
  create: CreateForm,
  edit: EditForm,
  settings: SettingsForm,
}

function showModal(component: ModalShown) {
  modalShown.value = component
  modalComponent.value?.showModal()
}
</script>

<template>
  <div>
    <div class="fab select-none">
      <!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
      <div tabindex="0" role="button" class="btn btn-xl btn-circle bg-white border border-black border-2">
        <PhDotsNine :size="30" weight="bold" />
      </div>

      <!-- close button should not be focusable so it can close the FAB when clicked. It's just a visual placeholder -->
      <div class="fab-close">
        <span class="btn btn-xl btn-circle bg-white border border-black border-2"><PhX size="30" weight="bold" /></span>
      </div>

      <!-- buttons that show up when FAB is open -->
      <div>
        <button class="btn btn-xl btn-circle bg-white border border-black border-2" @click="showModal('create')">
          <PhPlus size="30" weight="bold" />
        </button>
      </div>
      <div>
        <button class="btn btn-xl btn-circle bg-white border border-black border-2" @click="showModal('settings')">
          <PhSliders :size="30" weight="bold" />
        </button>
      </div>
    </div>
    <dialog ref="modalComponent" class="modal">
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <PhX size="24" />
          </button>
        </form>
        <component :is="componentMap[modalShown]" v-if="modalShown" />
      </div>
    </dialog>
  </div>
</template>

<style scoped>

</style>
