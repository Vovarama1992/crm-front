/* eslint-disable perfectionist/sort-objects */
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
    me: builder.query<UserAuthenticatedDto, void>({
      query: () => ({
        url: '/users/me',
        cache: 'no-cache',
      }),
      providesTags: [SESSION_TAG],
    }),

    signUp: builder.mutation<BaseUserDto, RegistrationDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/users/register',
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
      query: body => ({
        body,
        method: 'POST',
        url: '/auth/logout',
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled
          dispatch(baseApi.util?.resetApiState())
        } catch (error) {
          return
        }
      },
    }),

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
  }),
})

export const {
  util: sessionUtil,
  endpoints: sessionEndpoints,
  useMeQuery,
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useAskNlpMutation,
  useCloseDialogueMutation,
} = sessionApi
