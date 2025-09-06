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
export interface CreatePostRequest extends Omit<Post, 'id'> {}
export interface UpdatePostRequest extends Partial<Omit<Post, 'id'>> {}

// Post list için display type (user name ile birlikte)
export interface PostWithUserName extends Post {
    userName: string
}