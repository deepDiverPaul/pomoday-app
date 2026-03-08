import type { Task } from '../types.ts'
import {
  archiveCommand,
  beginCommand,
  checkCommand,
  deleteCommand,
  dueCommand,
  editTaskCommand,
  flagCommand,
  insertTaskCommand,
  moveCommand,
  restoreCommand,
  stopCommand,
  switchCommand,
  tagRenameCommand,
} from '../utils/actions.ts'
import { parseCommand } from '../utils/parser.ts'
import { useSettings } from './useSettings.ts'
import { useTasks } from './useTasks.ts'

export default function useActions() {
  const { tasks: tasksOriginal, createTask, updateTask, deleteTask, fetchTasks } = useTasks()
  const { settings } = useSettings()
  const run = async (value: string) => {
    const cmd = parseCommand(value)
    let tasksToUpdate: Task[] | null = null
    let tasksToDelete: Task[] | null = null
    let taskToCreate: Pick<Task, 'tag' | 'title' | 'due_date'> | null = null
    const tasks = JSON.parse(JSON.stringify(tasksOriginal.value)) as Task[]
    if (cmd) {
      const ids = cmd.id
        ? (cmd.id.match(/\d+/g) || []).map(s => Number.parseInt(s))
        : []
      switch (cmd.command.toLowerCase()) {
        case 'mv':
        case 'move':
          tasksToUpdate = moveCommand(tasks, ids, cmd)
          break
        case 'b':
        case 'begin':
          tasksToUpdate = beginCommand(tasks, ids)
          break
        case 'c':
        case 'check':
          tasksToUpdate = checkCommand(tasks, ids)
          break
        case 'd':
        case 'delete':
          tasksToDelete = deleteCommand(ids, cmd, tasks)
          break
        case 'fl':
        case 'flag':
          tasksToUpdate = flagCommand(tasks, ids)
          break
        case 'st':
        case 'stop':
          tasksToUpdate = stopCommand(tasks, ids)
          break
        case 'sw':
        case 'switch':
          tasksToUpdate = switchCommand(tasks, ids)
          break
        case 'a':
        case 'archive':
          tasksToUpdate = archiveCommand(ids, cmd, tasks)
          break
        case 're':
        case 'restore':
          tasksToUpdate = restoreCommand(ids, cmd, tasks)
          break
        case 't':
        case 'task':
          taskToCreate = insertTaskCommand(cmd)
          break
        case 'e':
        case 'edit':
          tasksToUpdate = editTaskCommand(ids, cmd, tasks)
          break
        case 'due':
          tasksToUpdate = dueCommand(ids, cmd, tasks)
          break
        case 'tr':
        case 'tagre':
        case 'tagrename':
          tasksToUpdate = tagRenameCommand(cmd, tasks)
          break
        case 'today':
          settings.value.todayShown = !settings.value.todayShown
          break
        // case 'show':
        //   updateCandidate = showCommand(updateCandidate, cmd)
        //   break
        // /* Single command */
        // case 'search':
        //   updateCandidate = searchCommand(updateCandidate, cmd)
        //   break
        // default:
        //   updateCandidate = otherCommand(updateCandidate, cmd, state)
        //   break
      }
    }
    if (tasksToDelete) {
      await deleteTask(tasksToDelete)
    }
    if (tasksToUpdate) {
      await updateTask(tasksToUpdate)
    }
    if (taskToCreate) {
      await createTask(taskToCreate)
    }
    await fetchTasks(true)
  }
  return { run }
}
