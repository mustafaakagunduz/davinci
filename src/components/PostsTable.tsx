// src/components/PostsTable.tsx

import { useMemo, useState } from 'react'
import { useGetPostsQuery, useDeletePostMutation } from '../store/api/postsApi'
import { EyeIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'
import { PostDetailModal } from './PostDetailModal'
import { EditPostModal } from './EditPostModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { Toast, type ToastType } from './ui/Toast'

import type { Post } from '../types/post'

interface PostsTableProps {
    filterValue: string
    isDarkMode?: boolean
}

export const PostsTable = ({ filterValue, isDarkMode = false }: PostsTableProps) => {
    const { t } = useLanguage()
    const { data: posts, isLoading: postsLoading, isError: postsError, error: postsErrorData } = useGetPostsQuery()
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    
    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [postToEdit, setPostToEdit] = useState<Post | null>(null)
    
    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<Post | null>(null)
    
    // Toast state
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

    // Filter posts based on title
    const filteredPosts = useMemo(() => {
        if (!posts || !filterValue.trim()) return posts

        const searchTerm = filterValue.toLowerCase().trim()
        
        return posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm)
        )
    }, [posts, filterValue])

    // Calculate pagination
    const totalItems = filteredPosts?.length || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPosts = filteredPosts?.slice(startIndex, endIndex) || []

    // Reset to first page when filter changes
    useMemo(() => {
        setCurrentPage(1)
    }, [filterValue])

    // Handle delete
    const handleDeleteClick = (post: Post) => {
        setPostToDelete(post)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!postToDelete) return

        try {
            await deletePost(postToDelete.id).unwrap()
            setToast({ message: t.deleteSuccess, type: 'success' })
            setIsDeleteModalOpen(false)
            setPostToDelete(null)
            // Detail modal'ı da kapat eğer silinen post açıksa
            if (selectedPost && selectedPost.id === postToDelete.id) {
                setIsDetailModalOpen(false)
                setSelectedPost(null)
            }
        } catch (error) {
            setToast({ message: t.deleteError, type: 'error' })
        }
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
        setPostToDelete(null)
    }

    // Handle edit
    const handleEditClick = (post: Post) => {
        setPostToEdit(post)
        setIsEditModalOpen(true)
    }

    const handleEditClose = () => {
        setIsEditModalOpen(false)
        setPostToEdit(null)
    }

    if (postsLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-lg">{t.loadingPosts}</div>
            </div>
        )
    }

    if (postsError) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">
                    {t.errorLoadingPosts}: {postsErrorData && 'status' in postsErrorData ? postsErrorData.status : 'Unknown error'}
                </div>
            </div>
        )
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{t.noPostsFound}</div>
            </div>
        )
    }

    if (filteredPosts && filteredPosts.length === 0 && filterValue.trim()) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    {t.noPostsMatching} "{filterValue}"
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="overflow-x-auto">
                <table className={`min-w-full border transition-colors duration-200 ${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-600' 
                    : 'bg-white border-gray-200'
            }`}>
                <thead className={`transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                <tr>
                    <th className={`px-6 py-2 text-center text-base font-normal uppercase tracking-wider transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                        {t.id}
                    </th>
                    <th className={`px-6 py-2 text-center text-base font-normal uppercase tracking-wider transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                        {t.userId}
                    </th>
                    <th className={`px-6 py-2 text-center text-base font-normal uppercase tracking-wider transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                        {t.title_field}
                    </th>
                    <th className={`px-6 py-2 text-center text-base font-normal uppercase tracking-wider transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                        {t.actions}
                    </th>
                </tr>
                </thead>
                <tbody className={`divide-y transition-colors duration-200 ${
                    isDarkMode 
                        ? 'bg-gray-800 divide-gray-600' 
                        : 'bg-white divide-gray-200'
                }`}>
                {currentPosts.map((post) => (
                    <tr 
                        key={post.id} 
                        className={`cursor-pointer transition-colors duration-200 ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                            setSelectedPost(post)
                            setIsDetailModalOpen(true)
                        }}
                    >
                        <td className={`px-6 py-2 whitespace-nowrap text-base text-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            {post.id}
                        </td>
                        <td className={`px-6 py-2 whitespace-nowrap text-base text-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            {post.userId}
                        </td>
                        <td className={`px-6 py-2 text-base font-normal max-w-xs text-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            <div className="truncate">
                                {post.title}
                            </div>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-base font-normal space-x-1 text-center">
                            <button 
                                className={`p-2 cursor-pointer transition-colors duration-200 relative z-10 ${
                                    isDarkMode 
                                        ? 'text-gray-300 hover:bg-gray-600' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedPost(post)
                                    setIsDetailModalOpen(true)
                                }}
                            >
                                <EyeIcon className="h-5 w-5" />
                            </button>
                            <button 
                                className={`p-2 cursor-pointer transition-colors duration-200 relative z-10 ${
                                    isDarkMode 
                                        ? 'text-gray-300 hover:bg-gray-600' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditClick(post)
                                }}
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button 
                                className={`p-2 cursor-pointer transition-colors duration-200 relative z-10 ${
                                    isDarkMode 
                                        ? 'text-gray-300 hover:bg-gray-600' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteClick(post)
                                }}
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center mt-4 space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                            currentPage === 1
                                ? 'opacity-50 cursor-not-allowed'
                                : isDarkMode 
                                    ? 'hover:bg-gray-700 text-gray-300' 
                                    : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    
                    <span className={`px-3 py-1 text-sm transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        {currentPage} / {totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                            currentPage === totalPages
                                ? 'opacity-50 cursor-not-allowed'
                                : isDarkMode 
                                    ? 'hover:bg-gray-700 text-gray-300' 
                                    : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            )}
            
            {/* Post Detail Modal */}
            <PostDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setSelectedPost(null)
                }}
                post={selectedPost}
                isDarkMode={isDarkMode}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
            />

            {/* Edit Post Modal */}
            <EditPostModal
                isOpen={isEditModalOpen}
                onClose={handleEditClose}
                post={postToEdit}
                isDarkMode={isDarkMode}
                onSuccess={(message) => setToast({ message, type: 'success' })}
                onError={(message) => setToast({ message, type: 'error' })}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                isDarkMode={isDarkMode}
                isLoading={isDeleting}
            />

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={!!toast}
                    onClose={() => setToast(null)}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    )
}