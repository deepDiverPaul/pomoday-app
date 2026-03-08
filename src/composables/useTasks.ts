import type { Task } from '../types.ts'
import { useArrayUnique } from '@vueuse/core'
import { ref } from 'vue'
import { useApi } from './useApi.ts'

const tasks = ref<Task[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const endpoint = '/items/pomodays'
const refreshInterval = ref<number>()

export function useTasks() {
  const api = useApi()
  const fetchTasks = async (force = false) => {
    if (tasks.value.length > 0 && !force)
      return

    isLoading.value = true
    error.value = null
    try {
      const data = await api.get(`${endpoint}?limit=-1`).then(res => res.json())
      tasks.value = data.data ?? []
    }
    catch (e: any) {
      error.value = e.message || 'Failed to fetch tasks'
      console.error('Error fetching tasks:', e)
    }
    finally {
      isLoading.value = false
    }
  }

  if (refreshInterval.value === undefined) {
    refreshInterval.value = setInterval(() => fetchTasks(true), 1000 * 60)
  }

  const createTask = async (taskData: Pick<Task, 'title' | 'due_date' | 'tag'>) => {
    isLoading.value = true
    error.value = null
    try {
      await api.post(endpoint, { ...taskData }).then(res => res.json())
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

  const updateTask = async (tasks: Task | Task[]) => {
    isLoading.value = true
    error.value = null
    const tasksToUpdate = Array.isArray(tasks) ? tasks : [tasks]
    try {
      for (const task of tasksToUpdate) {
        await api.patch(`${endpoint}/${task.id}`, task)
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

  const deleteTask = async (tasks: Task | Task[]) => {
    isLoading.value = true
    error.value = null
    const taskIdsToDelete = (Array.isArray(tasks) ? tasks : [tasks]).map(task => task.id)
    try {
      await api.delete(endpoint, taskIdsToDelete)
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
    deleteTask,
    categories,
  }
}
