<script setup lang="ts">
import { PhCheckSquareOffset, PhListChecks, PhSliders } from '@phosphor-icons/vue'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTasks } from './composables/useTasks.ts'

const { fetchTasks } = useTasks()
const router = useRouter()
const currentPath = computed(() => router.currentRoute.value.path)
onMounted(fetchTasks)
</script>

<template>
  <div class="overflow-hidden">
    <main class="pb-40 overflow-y-scroll h-screen">
      <RouterView />
    </main>
    <div class="dock dock-xl inset-shadow-sm">
      <RouterLink to="/create" :class="currentPath === '/create' ? 'dock-active' : ''">
        <PhCheckSquareOffset :size="32" />
      </RouterLink>

      <RouterLink to="/" :class="currentPath === '/' ? 'dock-active' : ''">
        <PhListChecks :size="32" />
      </RouterLink>

      <RouterLink to="/settings" :class="currentPath === '/settings' ? 'dock-active' : ''">
        <PhSliders :size="32" />
      </RouterLink>
    </div>
  </div>
</template>
