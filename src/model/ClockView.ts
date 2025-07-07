interface clockLogInterface {
  onceClockSecond: number
  duration: string
  summary: string
  startTime: string
  endTime: string
}

interface clockLogListInterface {
  date: string
  logList: clockLogInterface[]
  allDuration: string
  pauseCount: number
}

export type { clockLogInterface, clockLogListInterface }