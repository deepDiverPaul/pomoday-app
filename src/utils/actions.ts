import type { Task } from '../types.ts'
import type { Command } from './parser.ts'
import { DateTime } from 'luxon'
import { TaskStatus } from '../types.ts'
import { parseDueDate, stopWorkLogging } from './helpers.ts'

export function moveCommand(tasks: Task[], ids: Task['id_'][], cmd: Command) {
  return tasks.filter(t => ids.includes(t.id_) && t.tag && cmd?.tag).map(t => ({
    ...t,
    tag: cmd?.tag,
  } as Task))
}

export function beginCommand(tasks: Task[], ids: Task['id_'][]) {
  return tasks.filter(t => ids.includes(t.id_) && t.status !== TaskStatus.WIP).map((t) => {
    t.status = TaskStatus.WIP
    t.logs = (t.logs || []).concat({
      start: DateTime.now().toUTC().toString(),
    })
    return t
  })
}

export function checkCommand(tasks: Task[], ids: Task['id_'][]) {
  return tasks.filter(t => ids.includes(t.id_)).map((t) => {
    t.status
      = t.status === TaskStatus.DONE ? TaskStatus.WAIT : TaskStatus.DONE
    if (t.status === TaskStatus.DONE) {
      t = stopWorkLogging(t)
    }
    return t
  })
}

export function deleteCommand(ids: Task['id_'][], cmd: Command, tasks: Task[]) {
  if (ids.length === 0) {
    // Delete by tag
    const tag = (cmd?.id?.match(/^(@.*)/) || []).pop()
    if (tag) {
      return tasks.filter(t => t.tag === tag)
    }
    // Delete by status
    const status = (
      cmd?.id?.match(/^(finished|done|flag|ongoing|wip|wait|pending)/)
      || []
    ).pop()
    if (status) {
      let taskStatus = null
      switch (status) {
        case 'finished':
        case 'done':
          taskStatus = TaskStatus.DONE
          break
        case 'flag':
        case 'flagged':
          taskStatus = TaskStatus.FLAG
          break
        case 'ongoing':
        case 'wip':
          taskStatus = TaskStatus.WIP
          break
        case 'wait':
        case 'pending':
          taskStatus = TaskStatus.WAIT
          break
        default:
          break
      }
      if (taskStatus) {
        return tasks.filter(t => t.status === taskStatus)
      }
    }
    return []
  }
  else {
    // Delete by id
    return tasks.filter(t => ids.includes(t.id_))
  }
}

export function flagCommand(tasks: Task[], ids: Task['id_'][]) {
  return tasks.filter(t => ids.includes(t.id_)).map((t) => {
    t.status
      = t.status === TaskStatus.FLAG ? TaskStatus.WAIT : TaskStatus.FLAG
    t = stopWorkLogging(t)
    return t
  })
}

export function stopCommand(tasks: Task[], ids: Task['id_'][]) {
  return tasks.filter(t => ids.includes(t.id_) && t.status === TaskStatus.WIP).map((t) => {
    t = stopWorkLogging(t)
    return {
      ...t,
      status: TaskStatus.WAIT,
    } as Task
  })
}

export function switchCommand(tasks: Task[], ids: Task['id_'][]) {
  if (ids.length === 2) {
    const stopId = ids[0]
    const startId = ids[1]
    return tasks.filter(t => ids.includes(t.id_)).map((t) => {
      if (t.id_ === stopId && t.status === TaskStatus.WIP) {
        return stopCommand([t], [stopId])[0]
      }
      if (t.id_ === startId && t.status !== TaskStatus.WIP) {
        return beginCommand([t], [startId])[0]
      }
      return t
    })
  }
  return []
}

export function archiveCommand(ids: Task['id_'][], cmd: Command, tasks: Task[]) {
  if (ids.length === 0) {
    // Archive by tag
    const tag = (cmd?.id?.match(/^(@.*)/) || []).pop()
    if (tag) {
      return tasks.filter(t => t.tag === tag).map(t => ({
        ...t,
        archived: true,
      } as Task))
    }
  }
  else {
    // Archive by Ids
    return tasks.filter(t => ids.includes(t.id_)).map(t => ({
      ...t,
      archived: true,
    } as Task))
  }
  return []
}

export function restoreCommand(ids: Task['id_'][], cmd: Command, tasks: Task[]) {
  if (ids.length === 0) {
    // Archive by tag
    const tag = (cmd?.id?.match(/^(@.*)/) || []).pop()
    if (tag) {
      return tasks.filter(t => t.tag === tag).map(t => ({
        ...t,
        archived: false,
      } as Task))
    }
  }
  else {
    // Archive by Ids
    return tasks.filter(t => ids.includes(t.id)).map(t => ({
      ...t,
      archived: false,
    } as Task))
  }
  return []
}

export function insertTaskCommand(cmd: Command) {
  const tag = cmd?.tag || '@uncategorized'
  const task = cmd?.text
  if (task && task.length) {
    return {
      tag,
      title: task,
      due_date: null,
    } as Pick<Task, 'title' | 'due_date' | 'tag'>
  }
  return null
}

export function editTaskCommand(ids: Task['id_'][], cmd: Command, tasks: Task[]) {
  const id = ids[0]
  if (cmd) {
    return tasks.filter(t => t.id_ === id).map(t => ({
      ...t,
      title: cmd.text?.length ? cmd.text : t.title,
      tag: cmd.tag ?? t.tag,
    } as Task))
  }

  return []
}

export function dueCommand(ids: Task['id_'][], cmd: Command, tasks: Task[]) {
  const id = ids && ids.length ? ids[0] : null
  const text = (cmd?.text || '').trim()
  if (id) {
    return tasks.filter(t => t.id_ === id).map((t: Task) => {
      if (/^(?:clear|none|remove)$/i.test(text)) {
        t.due_date = null
      }
      else if (text && text.length) {
        t.due_date = parseDueDate(text)
      }
      return t
    })
  }
  return []
}

export function tagRenameCommand(cmd: Command, tasks: Task[]) {
  const [from, to] = cmd?.tag?.split(' ') || []
  if (!from || !to)
    return []
  return tasks.filter(t => t.tag.match(from)).map(t => ({
    ...t,
    tag: to,
  } as Task))
}

// export function hideCommand(updateCandidate, cmd) {
//   updateCandidate = (() => {
//     switch (cmd.text) {
//       case 'finished':
//       case 'done':
//         return {
//           ...updateCandidate,
//           taskVisibility: {
//             ...updateCandidate.taskVisibility,
//             done: false,
//           },
//         }
//       case 'flag':
//       case 'flagged':
//         return {
//           ...updateCandidate,
//           taskVisibility: {
//             ...updateCandidate.taskVisibility,
//             flagged: false,
//           },
//         }
//       case 'ongoing':
//       case 'wip':
//         return {
//           ...updateCandidate,
//           taskVisibility: {
//             ...updateCandidate.taskVisibility,
//             wip: false,
//           },
//         }
//       case 'pending':
//       case 'wait':
//         return {
//           ...updateCandidate,
//           taskVisibility: {
//             ...updateCandidate.taskVisibility,
//             wait: false,
//           },
//         }
//       default:
//         return updateCandidate
//     }
//   })()
//   return updateCandidate
// }
//
// export function showCommand(updateCandidate, cmd) {
//   updateCandidate = (() => {
//     switch (cmd.text) {
//       case 'finished':
//       case 'done':
//         return {
//           ...updateCandidate,
//           taskVisibility: {
//             ...updateCandidate.taskVisibility,
//             done: true,
//           },
//         }
//       case 'flag':
//       case 'flagged':
//         return {
//           ...updateCandidate,
//           taskVisibility: {
//             ...updateCandidate.taskVisibility,
//             flagged: true,
//           },
//         }
//       case 'wip':
//       case 'ongoing':
//         return {
//           ...updateCandidate,
//           taskVisibility: {
//             ...updateCandidate.taskVisibility,
//             wip: true,
//           },
//         }
//       case 'pending':
//       case 'wait':
//         return {
//           ...updateCandidate,
//           taskVisibility: {
//             ...updateCandidate.taskVisibility,
//             wait: true,
//           },
//         }
//       default:
//         return updateCandidate
//     }
//   })()
//   return updateCandidate
// }
//
// export function searchCommand(updateCandidate: any, cmd) {
//   if (cmd.command.match(/search/i)) {
//     updateCandidate = {
//       ...updateCandidate,
//       filterBy: cmd.text,
//     }
//   }
//   return updateCandidate
// }
//
// export function otherCommand(updateCandidate, cmd, tasks: Task[]) {
//   updateCandidate = (() => {
//     const commandText = cmd.command.toLowerCase()
//     if (commandText === 'help') {
//       return {
//         ...updateCandidate,
//         showHelp: true,
//       }
//     }
//     else if (commandText === 'quickhelp') {
//       return {
//         ...updateCandidate,
//         showQuickHelp: true,
//       }
//     }
//     else if (commandText === 'today') {
//       return {
//         ...updateCandidate,
//         showToday: !state.showToday,
//       }
//     }
//     else if (commandText === 'dark') {
//       return {
//         ...updateCandidate,
//         darkMode: true,
//       }
//     }
//     else if (commandText === 'light') {
//       return {
//         ...updateCandidate,
//         darkMode: false,
//       }
//     }
//     else if (commandText === 'setting') {
//       return {
//         ...updateCandidate,
//         showSettings: true,
//       }
//     }
//     else if (commandText === 'customize') {
//       return {
//         ...updateCandidate,
//         showCustomCSS: !updateCandidate.showCustomCSS,
//       }
//     }
//     else if (commandText === 'list-archived') {
//       return {
//         ...updateCandidate,
//         showArchived: !updateCandidate.showArchived,
//       }
//     }
//     else if (commandText === 'login') {
//       // OK, Let me explain the weird @demo stuff here:
//       // If the user is already has their data on another machine, and
//       // they opened this app on a new machine, then login right away,
//       // the tasks in the range of 1..12 will be conflict with the demo
//       // tasks. So, we will explicitly remove these demo tasks if they're
//       // actually a demo, when login.
//       return {
//         ...updateCandidate,
//         tasks: updateCandidate.tasks.filter(t =>
//           (t.id - 1) * (t.id - 12) <= 0 ? t.tag !== '@demo' : true,
//         ),
//         userWantToLogin: true,
//       }
//     }
//     else if (commandText === 'logout') {
//       return {
//         ...updateCandidate,
//         authToken: '',
//         userName: '',
//         userWantToLogin: true,
//       }
//     }
//     else {
//       return updateCandidate
//     }
//   })()
//   return updateCandidate
// }
