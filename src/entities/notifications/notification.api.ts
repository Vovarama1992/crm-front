import type { CreateNotificationDto, NotificationDto } from './notification.types'

import { baseApi } from '@/shared/api'

const notificationApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createNotification: builder.mutation<NotificationDto, CreateNotificationDto>({
      query: body => ({
        body: {
          ...body,
          seenBy: body.seenBy ?? [], // Инициализация пустым массивом, если не указано
        },
        method: 'POST',
        url: 'notifications',
      }),
    }),
    getNotifications: builder.query<NotificationDto[], number>({
      query: userId => `notifications/${userId}`,
    }),
    markNotificationAsSeen: builder.mutation<NotificationDto, { id: number; userId: number }>({
      query: ({ id, userId }) => ({
        body: { userId },
        method: 'PATCH',
        url: `notifications/${id}/seen`,
      }),
    }),
  }),
})

export const {
  endpoints: notificationEndpoints,
  useCreateNotificationMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsSeenMutation,
  util: notificationUtil,
} = notificationApi
