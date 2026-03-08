import type { Task } from '../types.ts'
import { DateTime } from 'luxon'
import Sherlock from 'sherlockjs'

export function parseDueDate(text: string): Task['due_date'] {
  try {
    const parsed = Sherlock.parse(text)
    if (parsed && parsed.startDate) {
      return DateTime.fromMillis(parsed.startDate.getTime()).toUTC().toString()
    }
  }
  catch {}
  const ts = Date.parse(text)
  const millis = Number.isNaN(ts) ? null : ts
  return millis ? DateTime.fromMillis(millis).toUTC().toString() : null
}

export function stopWorkLogging(t: Task) {
  if (t.logs && t.logs.length) {
    const lastLog = t.logs[t.logs.length - 1]
    if (lastLog.start && !lastLog.end) {
      lastLog.end = DateTime.now().toUTC().toString()
    }
  }
  else {
    t.logs = null
  }
  return t
}
