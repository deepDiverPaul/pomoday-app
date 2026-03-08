<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CreateInput from './components/CreateInput.vue'

import MobileActions from './components/MobileActions.vue'
import SettingsModal from './components/SettingsModal.vue'
import { useSettings } from './composables/useSettings.ts'
import { useTasks } from './composables/useTasks.ts'

const isMobile = useMediaQuery('(pointer: coarse)')
const { settings } = useSettings()

const { fetchTasks } = useTasks()
const router = useRouter()
const currentPath = computed(() => router.currentRoute.value.path)
onMounted(fetchTasks)
</script>

<template>
  <div :data-theme="settings.theme ?? 'default'" class="flex flex-col">
    <main class="h-screen overflow-y-auto overflow-x-none w-screen max-w-screen border-t-2 border-primary">
      <RouterView />
    </main>
    <template v-if="currentPath === '/'">
      <template v-if="isMobile">
        <MobileActions />
      </template>
      <template v-else>
        <CreateInput />
        <SettingsModal />
      </template>
    </template>
  </div>
</template>
