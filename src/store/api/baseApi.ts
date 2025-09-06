import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base API slice - tüm API çağrıları için temel konfigürasyon
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://jsonplaceholder.typicode.com/',
    }),
    tagTypes: ['User', 'Post'],
    endpoints: () => ({}),
})