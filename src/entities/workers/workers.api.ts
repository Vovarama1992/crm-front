import type { UserAuthenticatedDto } from '../session/session.types'
import type { CreateMotivation, Motivation, WorkerDto } from './workers.types'

import { WORKERS_TAG, baseApi } from '@/shared/api'

import { ChangeDto } from '../changes'

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
    createMotivation: builder.mutation<Motivation, CreateMotivation>({
      query: body => ({
        body,
        method: 'POST',
        url: '/motivation',
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

    deleteMotivation: builder.mutation<void, number>({
      query: motivationId => ({
        method: 'DELETE',
        url: `/motivation/${motivationId}`,
      }),
    }),
    downgradeToSimpleMotivation: builder.mutation<WorkerDto, number>({
      query: userId => ({
        method: 'PATCH',
        url: `/motivation/${userId}/demotivate`,
      }),
    }),
    fireWorker: builder.mutation<void, number>({
      invalidatesTags: [WORKERS_TAG],
      query: id => ({
        body: { department_id: null, isActive: false },
        method: 'PATCH',
        url: `/users/fire/${id}`,
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
    getUsersWithMotivations: builder.query<WorkerDto[], void>({
      query: () => ({
        url: '/motivation/users-with-motivations',
      }),
    }),
    getWorkerById: builder.query<WorkerDto, number>({
      providesTags: [WORKERS_TAG],
      query: id => ({
        url: `/users/${id}`,
      }),
    }),
    getWorkerChanges: builder.query<ChangeDto[], number>({
      query: workerId => ({
        url: `/change?entityType=EMPLOYEE&entityId=${workerId}`,
      }),
    }),
    getWorkers: builder.query<WorkerDto[], void>({
      providesTags: [WORKERS_TAG],
      query: () => ({
        url: '/users',
      }),
    }),
    recalculateAllUsersMargin: builder.mutation<
      { newMarginPercent: number; totalMargin: number; userId: string }[],
      void
    >({
      query: () => ({
        method: 'POST',
        url: '/motivation/recalculate-all',
      }),
    }),
    recalculateUserMargin: builder.mutation<void, number>({
      query: userId => ({
        method: 'POST',
        url: `/motivation/recalculate/${userId}`,
      }),
    }),
    restoreWorker: builder.mutation<void, number>({
      invalidatesTags: [WORKERS_TAG],
      query: id => ({
        body: { isActive: true },
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
    updateMotivation: builder.mutation<
      Motivation,
      { marginPercent: number; motivationId: number; threshold: number }
    >({
      query: ({ marginPercent, motivationId, threshold }) => ({
        body: { marginPercent, threshold },
        method: 'PATCH',
        url: `/motivation/${motivationId}`,
      }),
    }),
    updateWorker: builder.mutation<WorkerDto, Partial<UserAuthenticatedDto>>({
      invalidatesTags: [WORKERS_TAG],
      query: ({ id, ...updateData }) => ({
        body: updateData,
        method: 'PATCH',
        url: `/users/${id}`,
      }),
    }),
    upgradeToComplexMotivation: builder.mutation<WorkerDto, number>({
      query: userId => ({
        method: 'PATCH',
        url: `/motivation/${userId}/motivate`,
      }),
    }),
  }),
})

export const {
  endpoints: workersEndpoints,
  useCreateDepartmentMutation,
  useCreateMotivationMutation,
  useCreateWorkerMutation,
  useDeleteDepartmentMutation,
  useDeleteMotivationMutation,
  useDowngradeToSimpleMotivationMutation,
  useFireWorkerMutation,
  useGetActiveQuery,
  useGetDepartmentsQuery,
  useGetFiredWorkersQuery,
  useGetUsersWithMotivationsQuery,
  useGetWorkerByIdQuery,
  useGetWorkerChangesQuery,
  useGetWorkersQuery,
  useRecalculateAllUsersMarginMutation,
  useRecalculateUserMarginMutation,
  useRestoreWorkerMutation,
  useUpdateDepartmentMutation,
  useUpdateMotivationMutation,
  useUpdateWorkerMutation,
  useUpgradeToComplexMotivationMutation,
  util: workersUtil,
} = workersApi
