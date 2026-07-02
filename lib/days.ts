const MS_PER_DAY = 1000 * 60 * 60 * 24

export function calcTogetherDays(anniversaryDate: string): number {
  const start = new Date(anniversaryDate)
  const today = new Date()
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / MS_PER_DAY))
}

export function calcDaysUntil(targetDate: string): number {
  const target = new Date(targetDate)
  const today  = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / MS_PER_DAY))
}
