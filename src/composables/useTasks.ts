import type { Task } from '../types.ts'
import { useArrayUnique } from '@vueuse/core'
import { ref } from 'vue'
import { useApi } from './useApi.ts'

const tasks = ref<Task[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const endpoint = '/items/pomodays'

export function useTasks() {
  const api = useApi()
  const fetchTasks = async (force = false) => {
    if (tasks.value.length > 0 && !force)
      return

    isLoading.value = true
    error.value = null
    try {
      const data = await api.get(`${endpoint}?limit=-1`).then(res => res.json())
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

  const createTask = async (taskData: Pick<Task, 'title' | 'due_date' | 'tag'>) => {
    isLoading.value = true
    error.value = null
    try {
      await api.post(endpoint, { ...taskData }).then(res => res.json())
      await fetchTasks()
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
    isLoading.value = true
    error.value = null
    try {
      await api.patch(`${endpoint}/${task.id}`, task).then(res => res.json())
      await fetchTasks()
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

  const updateTasks = async (data: Partial<Task>, keys: Task['id'][]) => {
    isLoading.value = true
    error.value = null
    try {
      await api.patch(`${endpoint}`, { data, keys }).then(res => res.json())
      await fetchTasks()
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
    updateTasks,
    categories,
  }
}
