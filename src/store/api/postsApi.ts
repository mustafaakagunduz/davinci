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
            invalidatesTags: ['Post'],
        }),

        // PUT /posts/{id} - Postu güncelle
        updatePost: builder.mutation<Post, { id: number; post: UpdatePostRequest }>({
            query: ({ id, post }) => ({
                url: `posts/${id}`,
                method: 'PUT',
                body: post,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
        }),

        // DELETE /posts/{id} - Postu sil
        deletePost: builder.mutation<void, number>({
            query: (id) => ({
                url: `posts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Post'],
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