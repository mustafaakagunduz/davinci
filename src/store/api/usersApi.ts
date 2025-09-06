// src/store/api/usersApi.ts

import { baseApi } from './baseApi'
import type {User, CreateUserRequest, UpdateUserRequest} from '../../types/user';

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /users - Tüm kullanıcıları getir
        getUsers: builder.query<User[], void>({
            query: () => 'users',
            providesTags: ['User'],
        }),

        // GET /users/{id} - Belirli bir kullanıcıyı getir
        getUserById: builder.query<User, number>({
            query: (id) => `users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        // POST /users - Yeni kullanıcı oluştur
        addUser: builder.mutation<User, CreateUserRequest>({
            query: (newUser) => ({
                url: 'users',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: ['User'],
        }),

        // PUT /users/{id} - Kullanıcıyı güncelle
        updateUser: builder.mutation<User, { id: number; user: UpdateUserRequest }>({
            query: ({ id, user }) => ({
                url: `users/${id}`,
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
        }),

        // DELETE /users/{id} - Kullanıcıyı sil
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User', 'Post'], // User silinince Posts da etkilenir
        }),
    }),
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi