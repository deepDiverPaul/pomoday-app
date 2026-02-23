import type { Task } from '../types.ts'
import Sherlock from 'sherlockjs'

export function parseDueDate(text: string): number | null {
  try {
    const parsed = Sherlock.parse(text)
    if (parsed && parsed.startDate) {
      return parsed.startDate.getTime()
    }
  }
  catch {}
  const ts = Date.parse(text)
  return Number.isNaN(ts) ? null : ts
}

export function stopWorkLogging(t: Task) {
  if (t.logs && t.logs.length) {
    const lastLog = t.logs[t.logs.length - 1]
    if (lastLog.start && !lastLog.end) {
      lastLog.end = Date.now()
    }
  }
  else {
    t.logs = []
  }
  return t
}
