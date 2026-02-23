<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CreateInput from './components/CreateInput.vue'
import CreateModal from './components/CreateModal.vue'

import SettingsModal from './components/SettingsModal.vue'
import { useTasks } from './composables/useTasks.ts'

const isMobile = useMediaQuery('(pointer: coarse)')

const { fetchTasks } = useTasks()
const router = useRouter()
const currentPath = computed(() => router.currentRoute.value.path)
onMounted(fetchTasks)
</script>

<template>
  <div>
    <main class="h-screen overflow-y-auto">
      <RouterView />
    </main>
    <template v-if="currentPath === '/'">
      <CreateModal v-if="isMobile" />
      <CreateInput v-else />
    </template>
    <SettingsModal />
  </div>
</template>
