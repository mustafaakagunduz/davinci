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
            // invalidatesTags kaldırıldı - optimistic update kullan
            async onQueryStarted(newUser, { dispatch, queryFulfilled, getState }) {
                // Önce optimistic update yap (backend response beklemeden)
                const patchResult = dispatch(
                    usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
                        // Frontend'den gönderdiğimiz newUser'ı kullan (backend response değil)
                        draft.push(newUser as User)
                    })
                )
                
                try {
                    // Backend'den response bekle (ama sadece hata kontrolü için)
                    await queryFulfilled
                } catch {
                    // Hata durumunda optimistic update'i geri al
                    patchResult.undo()
                }
            },
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
            // invalidatesTags kaldırıldı - cache yeniden yüklenmesin
            // JSONPlaceholder fake API olduğu için optimistic update ekle
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // Optimistically update the cache - kalıcı olarak
                dispatch(
                    usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
                        return draft.filter(user => user.id !== id)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    // Hata durumunda bile undo yapmıyoruz, user silinmiş kalacak
                    // Sadece refresh'e kadar geçici silme
                }
            },
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