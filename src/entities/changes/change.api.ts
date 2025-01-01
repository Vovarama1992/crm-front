import type { ChangeDto, CreateChangeDto } from './change.types'

import { baseApi } from '@/shared/api'

const changeApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createChange: builder.mutation<ChangeDto, CreateChangeDto>({
      query: body => ({
        body,
        method: 'POST',
        url: 'change',
      }),
    }),

    getChanges: builder.query<ChangeDto[], { entityId: number; entityType: string }>({
      query: ({ entityId, entityType }) => ({
        url: `change?entityType=${entityType}&entityId=${entityId}`,
      }),
    }),

    getChangesByEntityType: builder.query<ChangeDto[], { entityType: string }>({
      query: ({ entityType }) => ({
        url: `change/by-entity?entityType=${entityType}`,
      }),
    }),
  }),
})

export const {
  endpoints: changeEndpoints,
  useCreateChangeMutation,
  useGetChangesByEntityTypeQuery,
  useGetChangesQuery,
  util: changeUtil,
} = changeApi
