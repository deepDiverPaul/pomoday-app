import type { Task } from '../types.ts'
import { useArrayUnique } from '@vueuse/core'
import { ref } from 'vue'
import { useApi } from './useApi.ts'

const tasks = ref<Task[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useTasks() {
  const api = useApi()

  const fetchTasks = async (force = false) => {
    if (tasks.value.length > 0 && !force)
      return

    isLoading.value = true
    error.value = null
    try {
      const data = await api.get('e5880167-9322-4d7b-8a38-e06bae8a7734/list').then(res => res.json())
      tasks.value = data.tasks ?? []
    }
    catch (e: any) {
      error.value = e.message || 'Failed to fetch tasks'
      console.error('Error fetching tasks:', e)
    }
    finally {
      isLoading.value = false
    }
  }

  const createTask = async (taskData: Partial<Task>) => {
    isLoading.value = true
    error.value = null
    try {
      // Get next ID as per current logic in CreateScreen.vue
      const nextId = tasks.value.sort((a, b) => b.id_ - a.id_).reduce((acc, task) => {
        if (task.id_ === acc + 1)
          return acc + 1
        return task.id_ + 1
      }, 0)

      const newTask: Partial<Task> = {
        ...taskData,
        id_: nextId,
        logs: [],
        archived: false,
      }

      const data = await api.put('e5880167-9322-4d7b-8a38-e06bae8a7734/list', { tasks: [newTask] }).then(res => res.json())
      if (data.tasks) {
        tasks.value = data.tasks
      }
    }
    catch (e: any) {
      error.value = e.message || 'Failed to create task'
      console.error('Error creating task:', e)
      throw e
    }
    finally {
      isLoading.value = false
    }
  }

  const updateTask = async (task: Task) => {
    console.log('updateTask', task)
    isLoading.value = true
    error.value = null
    try {
      const data = await api.put('e5880167-9322-4d7b-8a38-e06bae8a7734/list', { tasks: [task] }).then(res => res.json())
      if (data.tasks) {
        tasks.value = data.tasks
      }
    }
    catch (e: any) {
      error.value = e.message || 'Failed to update task'
      console.error('Error updating task:', e)
      throw e
    }
    finally {
      isLoading.value = false
    }
  }

  const categories = useArrayUnique(tasks.value.map(task => task.tag))

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    categories,
  }
}
