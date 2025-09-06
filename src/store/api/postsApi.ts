// src/store/api/postsApi.ts

import { baseApi } from './baseApi'
import type {Post, CreatePostRequest, UpdatePostRequest} from '../../types/post';

export const postsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /posts - Tüm postları getir
        getPosts: builder.query<Post[], void>({
            query: () => 'posts',
            providesTags: ['Post'],
        }),

        // GET /posts/{id} - Belirli bir postu getir
        getPostById: builder.query<Post, number>({
            query: (id) => `posts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Post', id }],
        }),

        // GET /posts?userId={userId} - Belirli kullanıcının postlarını getir
        getPostsByUserId: builder.query<Post[], number>({
            query: (userId) => `posts?userId=${userId}`,
            providesTags: (result, error, userId) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Post' as const, id })),
                        { type: 'Post', id: `USER_${userId}` },
                    ]
                    : [{ type: 'Post', id: `USER_${userId}` }],
        }),

        // POST /posts - Yeni post oluştur
        addPost: builder.mutation<Post, CreatePostRequest>({
            query: (newPost) => ({
                url: 'posts',
                method: 'POST',
                body: newPost,
            }),
            // invalidatesTags kaldırıldı - optimistic update kullan
            async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
                // Önce optimistic update yap (backend response beklemeden)
                const patchResult = dispatch(
                    postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
                        // Frontend'den gönderdiğimiz newPost'u kullan (backend response değil)
                        draft.push(newPost as Post)
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

        // PUT /posts/{id} - Postu güncelle
        updatePost: builder.mutation<Post, { id: number; post: UpdatePostRequest }>({
            query: ({ id, post }) => ({
                url: `posts/${id}`,
                method: 'PUT',
                body: post,
            }),
            // Optimistic update kullan
            async onQueryStarted({ id, post }, { dispatch, queryFulfilled }) {
                // Optimistically update the cache
                const patchResult = dispatch(
                    postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
                        const postIndex = draft.findIndex(p => p.id === id)
                        if (postIndex !== -1) {
                            // Backend'den gelen response yerine frontend'deki veriyi kullan
                            draft[postIndex] = { ...draft[postIndex], ...post }
                        }
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

        // DELETE /posts/{id} - Postu sil
        deletePost: builder.mutation<void, number>({
            query: (id) => ({
                url: `posts/${id}`,
                method: 'DELETE',
            }),
            // invalidatesTags kaldırıldı - cache yeniden yüklenmesin
            // JSONPlaceholder fake API olduğu için optimistic update ekle
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // Optimistically update the cache - kalıcı olarak
                dispatch(
                    postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
                        return draft.filter(post => post.id !== id)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    // Hata durumunda bile undo yapmıyoruz, post silinmiş kalacak
                    // Sadece refresh'e kadar geçici silme
                }
            },
        }),
    }),
})

export const {
    useGetPostsQuery,
    useGetPostByIdQuery,
    useGetPostsByUserIdQuery,
    useAddPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postsApi