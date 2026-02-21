import { ref } from 'vue';
import { useApi } from './useApi.ts';
import { Task } from '../types.ts';

const tasks = ref<Task[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useTasks() {
  const api = useApi();

  const fetchTasks = async (force = false) => {
    if (tasks.value.length > 0 && !force) return;

    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get('e5880167-9322-4d7b-8a38-e06bae8a7734/list');
      const data = await response.json();
      tasks.value = data.tasks ?? [];
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch tasks';
      console.error('Error fetching tasks:', e);
    } finally {
      isLoading.value = false;
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Get next ID as per current logic in CreateScreen.vue
      const nextId = await api.get('d49dde4c-530d-46ee-8205-d1357563ac16')
        .then((response) => response.json())
        .then((json) => json.nextId as number)
        .catch(() => null);

      if (!nextId) throw new Error('Could not get next task ID');

      const newTask: Partial<Task> = {
        ...taskData,
        id_: nextId,
        logs: [],
        archived: false,
      };

      await api.put('e5880167-9322-4d7b-8a38-e06bae8a7734/list', { tasks: [newTask] });

      // Update local store (optimistic update or refetch)
      // Since it's a PUT to '.../list' with {tasks: [task]}, it seems to add/update?
      // Based on CreateScreen.vue, it just navigates back.
      // To keep store in sync without full refetch, we could add it locally if we knew the full structure
      // But maybe it's safer to refetch or at least push to local state if we have the full object.
      // Let's refetch to be sure it's in sync with server.
      await fetchTasks(true);
    } catch (e: any) {
      error.value = e.message || 'Failed to create task';
      console.error('Error creating task:', e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
  };
}
