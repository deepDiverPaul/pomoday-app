export enum TaskStatus {
  ARCHIVE = 'archive',
  DONE = 'done',
  WIP = 'wip',
  WAIT = 'wait',
  FLAG = 'flag',
}

export interface Worklog {
  start: string
  end: number
}

export interface Task {
  tag: string
  title: string
  status: TaskStatus
  lastaction: string | null
  logs: Worklog[] | null
  due_date: string | null
  id_: number
  id: number
}

export type Actions = 't' | 'c' | 'f'
