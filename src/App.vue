<script setup lang="ts">
import { PhCheckSquareOffset, PhListChecks, PhSliders } from '@phosphor-icons/vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
const router = useRouter();
const currentPath = computed(() => router.currentRoute.value.path);
</script>

<template>
  <div class="overflow-hidden">

    <main class="pb-40 overflow-y-scroll h-screen">
      <RouterView v-slot="{ Component }">
        <Transition name="fade">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <div class="dock dock-xl bg-neutral-400">
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
