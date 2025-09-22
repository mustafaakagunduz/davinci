import { useState } from 'react'
import { useGetPostsQuery, useDeletePostMutation } from '../store/api/postsApi'
import { useLanguage } from '../contexts/LanguageContext'
import { PostDetailModal } from './PostDetailModal'
import { EditPostModal } from './EditPostModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { Toast, type ToastType } from './ui/Toast'
import { BaseTable, type Column } from './BaseTable'
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
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    
    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [postToEdit, setPostToEdit] = useState<Post | null>(null)
    
    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<Post | null>(null)
    
    // Toast state
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

    // Filter function for posts
    const filterPosts = (posts: Post[], filterValue: string) => {
        const searchTerm = filterValue.toLowerCase().trim()
        return posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm)
        )
    }

    // Table columns configuration
    const columns: Column<Post>[] = [
        {
            key: 'id',
            label: t.id,
            render: (post) => <span className="font-normal">{post.id}</span>
        },
        {
            key: 'userId',
            label: t.userId,
            render: (post) => <span className="font-normal">{post.userId}</span>
        },
        {
            key: 'title',
            label: t.title_field,
            render: (post) => (
                <div className="max-w-xs mx-auto">
                    <div className="truncate text-center font-normal">
                        {post.title}
                    </div>
                </div>
            )
        }
    ]

    // Event handlers
    const handlePostClick = (post: Post) => {
        setSelectedPost(post)
        setIsDetailModalOpen(true)
    }

    const handlePostView = (post: Post) => {
        setSelectedPost(post)
        setIsDetailModalOpen(true)
    }

    const handlePostEdit = (post: Post) => {
        setPostToEdit(post)
        setIsEditModalOpen(true)
    }

    const handlePostDelete = (post: Post) => {
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
            if (selectedPost && selectedPost.id === postToDelete.id) {
                setIsDetailModalOpen(false)
                setSelectedPost(null)
            }
        } catch {
            setToast({ message: t.deleteError, type: 'error' })
        }
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
        setPostToDelete(null)
    }

    const handleEditClose = () => {
        setIsEditModalOpen(false)
        setPostToEdit(null)
    }

    return (
        <div>
            <BaseTable<Post>
                data={posts}
                columns={columns}
                isLoading={postsLoading}
                isError={postsError}
                error={postsErrorData}
                filterValue={filterValue}
                filterFunction={filterPosts}
                isDarkMode={isDarkMode}
                getItemId={(post) => post.id}
                onItemClick={handlePostClick}
                onItemView={handlePostView}
                onItemEdit={handlePostEdit}
                onItemDelete={handlePostDelete}
                noDataMessage={t.noPostsFound}
                noFilterResultsMessage={(filter) => `${t.noPostsMatching} "${filter}"`}
                loadingMessage={t.loadingPosts}
                errorMessage={(err) => `${t.errorLoadingPosts}: ${err && typeof err === 'object' && err !== null && 'status' in err ? (err as {status: unknown}).status : 'Unknown error'}`}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
            />

            {/* Post Detail Modal */}
            <PostDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setSelectedPost(null)
                }}
                post={selectedPost}
                isDarkMode={isDarkMode}
                onDelete={handlePostDelete}
                onEdit={handlePostEdit}
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