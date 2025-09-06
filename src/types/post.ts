// src/types/post.ts

export interface Post {
    userId: number
    id: number
    title: string
    body: string
}

// Form için kullanılacak post type
export interface PostFormData {
    userId: number
    title: string
    body: string
}

// API response types
export type CreatePostRequest = Omit<Post, 'id'>
export type UpdatePostRequest = Partial<Omit<Post, 'id'>>

// Post list için display type (user name ile birlikte)
export interface PostWithUserName extends Post {
    userName: string
}