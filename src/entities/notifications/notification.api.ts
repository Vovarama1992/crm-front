import type { CreateNotificationDto, NotificationDto } from './notification.types'

import { baseApi } from '@/shared/api'

const notificationApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createNotification: builder.mutation<NotificationDto, CreateNotificationDto>({
      query: body => ({
        body: {
          ...body,
          intendedFor: body.intendedFor,
          seenBy: body.seenBy ?? [],
        },
        method: 'POST',
        url: 'notifications',
      }),
    }),
    getNotifications: builder.query<
      NotificationDto[],
      { forceUpdate?: number; page?: number; userId: number }
    >({
      query: ({ forceUpdate, page = 1, userId }) => ({
        params: { forceUpdate, page },
        url: `notifications/${userId}`,
      }),
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
