import type { LogisticsLineDto, SaleDto, SupplierLineDto } from '../deal/deal.types'
import type {
  BaseUserDto,
  LoginDto,
  RegistrationDto,
  UserAuthenticatedDto,
  UserRegisteredDto,
} from './session.types'

import { SESSION_TAG, baseApi } from '@/shared/api'

const sessionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    askNlp: builder.mutation<
      { dialogueId: number; reply: string },
      { dialogueId: null | number; message: string }
    >({
      query: body => ({
        body,
        method: 'POST',
        url: '/nlp',
      }),
    }),

    closeDialogue: builder.mutation<void, { dialogueId: number }>({
      query: ({ dialogueId }) => ({
        method: 'POST',
        url: `/nlp/${dialogueId}/close`,
      }),
    }),

    // Эндпоинт для скачивания PDF для строк логистики
    downloadLogisticsPdf: builder.query<Blob, { filename: string }>({
      query: ({ filename }) => ({
        method: 'GET',
        responseHandler: async response => {
          const blob = await response.blob()

          return blob
        },
        url: `/files/download/logistics-pdf/${filename}`,
      }),
    }),

    // Эндпоинт для скачивания PDF
    downloadPdf: builder.query<Blob, { filename: string }>({
      query: ({ filename }) => ({
        method: 'GET',
        responseHandler: async response => {
          const blob = await response.blob()

          return blob
        },
        url: `/files/download/pdf/${filename}`,
      }),
    }),

    downloadSupplierPdf: builder.query<Blob, { filename: string }>({
      query: ({ filename }) => ({
        method: 'GET',
        responseHandler: async response => {
          const blob = await response.blob()

          return blob
        },
        url: `/files/download/supplier-pdf/${filename}`,
      }),
    }),

    me: builder.query<UserAuthenticatedDto, void>({
      providesTags: [SESSION_TAG],
      query: () => ({
        cache: 'no-cache',
        url: '/users/me',
      }),
    }),

    signIn: builder.mutation<UserRegisteredDto, LoginDto>({
      invalidatesTags: (_, error) => (!error ? [SESSION_TAG] : []),
      query: body => ({
        body,
        method: 'POST',
        url: '/users/login',
      }),
    }),

    signOut: builder.mutation<void, void>({
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util?.resetApiState())
        } catch (error) {
          return
        }
      },
      query: body => ({
        body,
        method: 'POST',
        url: '/auth/logout',
      }),
    }),

    signUp: builder.mutation<BaseUserDto, RegistrationDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/users/register',
      }),
    }),

    // Эндпоинт для загрузки PDF для строк логистики
    uploadLogisticsPdf: builder.mutation<
      { logisticsLine: LogisticsLineDto; message: string },
      { file: File; logisticsLineId: string }
    >({
      query: ({ file, logisticsLineId }) => {
        const formData = new FormData()

        formData.append('file', file)

        return {
          body: formData,
          method: 'POST',
          url: `/files/upload/logistics-pdf/${logisticsLineId}`,
        }
      },
    }),

    // Эндпоинт для загрузки PDF для продажи
    uploadPdf: builder.mutation<{ message: string; sale: SaleDto }, { file: File; saleId: string }>(
      {
        query: ({ file, saleId }) => {
          const formData = new FormData()

          formData.append('file', file)

          return {
            body: formData,
            method: 'POST',
            url: `/files/upload/pdf/${saleId}`,
          }
        },
      }
    ),

    // Эндпоинт для загрузки PDF для строк поставщиков
    uploadSupplierPdf: builder.mutation<
      { message: string; supplierLine: SupplierLineDto },
      { file: File; supplierLineId: string }
    >({
      query: ({ file, supplierLineId }) => {
        const formData = new FormData()

        formData.append('file', file)

        return {
          body: formData,
          method: 'POST',
          url: `/files/upload/supplier-pdf/${supplierLineId}`,
        }
      },
    }),
  }),
})

export const {
  endpoints: sessionEndpoints,
  useAskNlpMutation,
  useCloseDialogueMutation,
  useDownloadLogisticsPdfQuery, // Хук для скачивания PDF для строк логистики
  useDownloadPdfQuery,
  useDownloadSupplierPdfQuery,
  useLazyDownloadPdfQuery, // Хук для скачивания PDF по запросу
  useLazyDownloadSupplierPdfQuery,
  useMeQuery,
  useSignInMutation,
  useSignOutMutation,
  useSignUpMutation,
  useUploadLogisticsPdfMutation, // Хук для загрузки PDF для строк логистики
  useUploadPdfMutation, // Хук для загрузки PDF для продажи
  useUploadSupplierPdfMutation, // Хук для загрузки PDF для строк поставщиков
  util: sessionUtil,
} = sessionApi
