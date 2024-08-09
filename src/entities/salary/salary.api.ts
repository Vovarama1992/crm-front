import type { CreateSalaryDto, SalaryDto, UpdateSalaryDto } from './salary.types'

import { baseApi } from '@/shared/api'

const salaryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createSalary: builder.mutation<SalaryDto, CreateSalaryDto>({
      query: newSalary => ({
        body: newSalary,
        method: 'POST',
        url: '/salaries',
      }),
    }),
    getUserSalaries: builder.query<SalaryDto[], number>({
      query: userId => ({
        method: 'GET',
        url: `/salaries/${userId}`,
      }),
    }),
    updateSalary: builder.mutation<SalaryDto, { data: UpdateSalaryDto; id: number }>({
      query: ({ data, id }) => ({
        body: data,
        method: 'PATCH',
        url: `/salaries/${id}`,
      }),
    }),
  }),
})

export const {
  endpoints: salaryEndpoints,
  useCreateSalaryMutation,
  useGetUserSalariesQuery,
  useUpdateSalaryMutation,
  util: salaryUtil,
} = salaryApi
