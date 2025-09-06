// src/components/PostsTable.tsx

import { useGetPostsQuery } from '../store/api/postsApi'
import { useGetUsersQuery } from '../store/api/usersApi'

export const PostsTable = () => {
    const { data: posts, isLoading: postsLoading, isError: postsError, error: postsErrorData } = useGetPostsQuery()
    const { data: users } = useGetUsersQuery()

    // Helper function to get username by userId
    const getUserName = (userId: number) => {
        const user = users?.find(u => u.id === userId)
        return user ? user.username : `User${userId}`
    }

    if (postsLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-lg">Loading posts...</div>
            </div>
        )
    }

    if (postsError) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">
                    Error loading posts: {postsErrorData && 'status' in postsErrorData ? postsErrorData.status : 'Unknown error'}
                </div>
            </div>
        )
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">No posts found</div>
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
                        Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {post.id}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                            <div className="truncate">
                                {post.title}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  @{getUserName(post.userId)}
                </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                            <div className="truncate">
                                {post.body}
                            </div>
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