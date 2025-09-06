// src/types/api.ts

// Generic API response wrapper
export interface ApiResponse<T> {
    data: T
    success: boolean
    message?: string
}

// Loading states
export interface LoadingState {
    isLoading: boolean
    isError: boolean
    error?: string
}

// Pagination (JSONPlaceholder doesn't support but we might need later)
export interface PaginationParams {
    page?: number
    limit?: number
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
}

// Common error types
export interface ApiError {
    status: number
    message: string
    details?: string
}