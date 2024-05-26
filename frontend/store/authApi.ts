// store/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface RegisterResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/graphql/', // 添加斜杠
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { userName: string, password: string }>({
      query: ({ userName, password }) => ({
        url: '', // 保持空字符串，使用 baseUrl
        method: 'POST',
        body: {
          query: `
            mutation {
              tokenAuth(username: "${userName}", password: "${password}") {
                token
                refreshToken
                user {
                  id
                  username
                  email
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data?: { tokenAuth?: LoginResponse } }) => {
        if (!response.data?.tokenAuth) {
          throw new Error('Invalid response structure');
        }
        return response.data.tokenAuth;
      },
    }),
    register: builder.mutation<RegisterResponse, { userName: string, password: string, email: string }>({
      query: ({ userName, password, email }) => ({
        url: '', // 保持空字符串，使用 baseUrl
        method: 'POST',
        body: {
          query: `
            mutation {
              createUser(username: "${userName}", password: "${password}", email: "${email}") {
                token
                refreshToken
                user {
                  id
                  username
                  email
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response: { data?: { createUser?: RegisterResponse } }) => {
        if (!response.data?.createUser) {
          throw new Error('Invalid response structure');
        }
        return response.data.createUser;
      },
    }),
    getAuthData: builder.query<User, { token: string }>({
      query: ({ token }) => ({
        url: '', // 保持空字符串，使用 baseUrl
        method: 'POST',
        body: {
          query: `
            query {
              whoami {
                id
                username
                email
              }
            }
          `,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: { data?: { whoami?: User } }) => {
        if (!response.data?.whoami) {
          throw new Error('Invalid response structure');
        }
        return response.data.whoami;
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetAuthDataQuery } = authApi;
