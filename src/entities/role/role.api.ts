import type { CreateRoleParams } from './role.types'

import { baseApi } from '@/shared/api'

/* eslint-disable perfectionist/sort-objects */
const roleApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createRole: builder.mutation<any, CreateRoleParams>({
      query: ({ personal_office_id, ...body }) => ({
        body,
        method: 'POST',
        url: `/users/create_role/${personal_office_id}/`,
      }),
    }),
  }),
})

export const { endpoints: roleEndpoints, util: roleUtil, useCreateRoleMutation } = roleApi
