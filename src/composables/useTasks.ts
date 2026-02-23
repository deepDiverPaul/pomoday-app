import type { Task } from '../types.ts'
import { useArrayUnique } from '@vueuse/core'
import { ref } from 'vue'
import { TaskStatus } from '../types.ts'
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

  const createTask = async (taskData: Pick<Task, 'title' | 'dueDate' | 'tag'>) => {
    // Get next ID as per current logic in CreateScreen.vue
    const nextId = () => tasks.value.sort((a, b) => a.id_ - b.id_).reduce((acc, task) => {
      if (task.id_ === acc + 1)
        return acc + 1
      return acc
    }, 0) + 1
    isLoading.value = true
    error.value = null
    try {
      const newTask: Omit<Task, 'id'> = {
        id_: nextId(),
        status: TaskStatus.WAIT,
        logs: [],
        lastaction: Date.now(),
        archived: false,
        ...taskData,
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

  const updateTask = async (task: Task | Task[]) => {
    isLoading.value = true
    error.value = null
    const tasksToUpdate = (Array.isArray(task) ? task : [task]).map(t => ({ ...t, lastaction: Date.now() } as Task))
    try {
      const data = await api.put('e5880167-9322-4d7b-8a38-e06bae8a7734/list', { tasks: tasksToUpdate }).then(res => res.json())
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
