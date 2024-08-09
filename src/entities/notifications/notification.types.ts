export type NotificationDto = {
  content: string
  createdAt: string
  createdBy: number
  id: number
  seenBy: number[]
  title: string
}

// Определим тип для создания уведомления, где `seenBy` будет автоматически инициализироваться пустым массивом
export type CreateNotificationDto = {
  content: string
  createdBy: number
  seenBy?: number[] // Поле необязательно, будет инициализироваться пустым массивом на сервере
  title: string
}
