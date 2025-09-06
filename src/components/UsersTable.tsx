// src/components/UsersTable.tsx

import { useGetUsersQuery } from '../store/api/usersApi'
import { useGetPostsQuery } from '../store/api/postsApi'

export const UsersTable = () => {
    const { data: users, isLoading, isError, error } = useGetUsersQuery()
    const { data: posts } = useGetPostsQuery()

    // Helper function to get post count for a user
    const getPostCount = (userId: number) => {
        if (!posts) return 0
        return posts.filter(post => post.userId === userId).length
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-lg">Loading users...</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">
                    Error loading users: {error && 'status' in error ? error.status : 'Unknown error'}
                </div>
            </div>
        )
    }

    if (!users || users.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">No users found</div>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Post Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getPostCount(user.id)}
                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                                View
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                                Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}