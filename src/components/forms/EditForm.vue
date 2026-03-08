<script setup lang="ts">
import type { Task } from '../../types.ts'
import { ref } from 'vue'
import useActions from '../../composables/useActions.ts'

const { task } = defineProps<{ task: Task }>()

const emit = defineEmits(['update'])

const localTask = ref(task)

const { run } = useActions()
async function handleSubmit(e: Event) {
  const formData = new FormData(e.target as HTMLFormElement)
  const data = Object.fromEntries(formData) as unknown as Pick<Task, 'tag' | 'title' | 'due_date'>
  run(`edit ${localTask.value.id_} ${data.tag} ${data.title}`)
  emit('update')
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <fieldset class="fieldset">
      <input v-model="localTask.title" type="text" class="input input-xl input-neutral w-full" name="title" placeholder="Task">
    </fieldset>
    <fieldset class="fieldset">
      <select v-model="localTask.tag" class="select select-xl select-neutral w-full" name="tag">
        <option selected value="@uncategorized">
          @uncategorized
        </option>
        <option value="@home">
          @home
        </option>
        <option value="@work">
          @work
        </option>
      </select>
    </fieldset>
    <button class="btn btn-xl btn-neutral btn-outline w-full">
      Submit
    </button>
  </form>
</template>

<style scoped>

</style>
