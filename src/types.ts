export enum TaskStatus {
  NONE,
  DONE,
  WIP,
  WAIT,
  FLAG,
}

export interface Worklog {
  start: number
  end: number
}

export interface Task {
  archived: boolean
  tag: string
  title: string
  status: TaskStatus
  lastaction: number | null
  logs: Worklog[]
  dueDate: number | null
  id_: number
  id: number
}

export type Actions = 't' | 'c' | 'f'
