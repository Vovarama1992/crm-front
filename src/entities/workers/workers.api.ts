import type { UserAuthenticatedDto } from '../session/session.types'
import type { WorkerDto } from './workers.types'

import { WORKERS_TAG, baseApi } from '@/shared/api'

export type DepartmentDto = {
  id: number
  name: string
  ropId?: number
  users: WorkerDto[]
}

const workersApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createDepartment: builder.mutation<DepartmentDto, { name: string; ropId: number }>({
      invalidatesTags: [WORKERS_TAG],
      query: body => ({
        body,
        method: 'POST',
        url: 'users/departments',
      }),
    }),
    createWorker: builder.mutation<WorkerDto, WorkerDto>({
      invalidatesTags: [WORKERS_TAG],
      query: body => ({
        body,
        method: 'POST',
        url: '/users/register',
      }),
    }),
    deleteDepartment: builder.mutation<void, number>({
      invalidatesTags: [WORKERS_TAG],
      query: id => ({
        method: 'DELETE',
        url: `users/departments/${id}`,
      }),
    }),
    fireWorker: builder.mutation<void, number>({
      invalidatesTags: [WORKERS_TAG],
      query: id => ({
        body: { department_id: null, isActive: false }, // Устанавливаем isActive в false и удаляем из отдела
        method: 'PATCH',
        url: `/users/${id}`,
      }),
    }),
    getActive: builder.query<WorkerDto[], void>({
      providesTags: [WORKERS_TAG],
      query: () => ({
        url: '/users/active',
      }),
    }),
    getDepartments: builder.query<DepartmentDto[], void>({
      providesTags: [WORKERS_TAG],
      query: () => ({
        url: 'users/departments',
      }),
    }),
    getFiredWorkers: builder.query<WorkerDto[], void>({
      providesTags: [WORKERS_TAG],
      query: () => ({
        url: '/users/fired',
      }),
    }),
    getWorkerById: builder.query<WorkerDto, number>({
      providesTags: [WORKERS_TAG],
      query: id => ({
        url: `/users/${id}`,
      }),
    }),
    getWorkers: builder.query<WorkerDto[], void>({
      providesTags: [WORKERS_TAG],
      query: () => ({
        url: '/users',
      }),
    }),
    restoreWorker: builder.mutation<void, number>({
      invalidatesTags: [WORKERS_TAG],
      query: id => ({
        body: { isActive: true }, // Устанавливаем isActive в true
        method: 'PATCH',
        url: `/users/${id}`,
      }),
    }),
    updateDepartment: builder.mutation<DepartmentDto, Partial<DepartmentDto>>({
      invalidatesTags: [WORKERS_TAG],
      query: body => ({
        body,
        method: 'PATCH',
        url: `users/departments/${body.id}`,
      }),
    }),
    updateWorker: builder.mutation<
      WorkerDto,
      { id: number; updateData: Partial<UserAuthenticatedDto> }
    >({
      invalidatesTags: [WORKERS_TAG],
      query: ({ id, updateData }) => ({
        body: updateData,
        method: 'PATCH',
        url: `/users/${id}`, // id теперь передается в URL
      }),
    }),
  }),
})

export const {
  endpoints: workersEndpoints,
  useCreateDepartmentMutation,
  useCreateWorkerMutation,
  useDeleteDepartmentMutation,
  useFireWorkerMutation,
  useGetActiveQuery,
  useGetDepartmentsQuery,
  useGetFiredWorkersQuery,
  useGetWorkerByIdQuery, // Новый хук для получения пользователя по ID
  useGetWorkersQuery,
  useRestoreWorkerMutation,
  useUpdateDepartmentMutation,
  useUpdateWorkerMutation,
  util: workersUtil,
} = workersApi
