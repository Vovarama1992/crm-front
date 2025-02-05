export function getWorkingDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)

  let workingDays = 0

  while (start <= end) {
    const dayOfWeek = start.getDay()

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++
    }

    start.setDate(start.getDate() + 1)
  }

  return workingDays
}
