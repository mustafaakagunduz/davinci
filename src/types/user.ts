// src/types/user.ts

export interface User {
    id: number
    name: string
    username: string
    email: string
    address: {
        street: string
        suite: string
        city: string
        zipcode: string
        geo: {
            lat: string
            lng: string
        }
    }
    phone: string
    website: string
    company: {
        name: string
        catchPhrase: string
        bs: string
    }
}

// Form için kullanılacak simplified user type
export interface UserFormData {
    name: string
    username: string
    email: string
    phone: string
    website: string
}

// API response types
export interface CreateUserRequest extends Omit<User, 'id'> {}
export interface UpdateUserRequest extends Partial<Omit<User, 'id'>> {}

// User list için display type (post count ile birlikte)
export interface UserWithPostCount extends User {
    postCount: number
}