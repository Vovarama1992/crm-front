export type NotificationDto = {
  content: string
  createdAt: string
  createdBy: number
  id: number
  intendedFor: number[]
  seenBy: number[]
  title: string
}

export type CreateNotificationDto = {
  content: string
  createdBy: number
  intendedFor?: number[]
  seenBy?: number[]
  title: string
}
