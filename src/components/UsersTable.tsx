import { useMemo, useState } from 'react'
import { useGetUsersQuery, useDeleteUserMutation } from '../store/api/usersApi'
import { useGetPostsQuery } from '../store/api/postsApi'
import { useLanguage } from '../contexts/LanguageContext'
import { UserDetailModal } from './UserDetailModal'
import { EditUserModal } from './EditUserModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { Toast, type ToastType } from './ui/Toast'
import { BaseTable, type Column } from './BaseTable'
import type { User } from '../types/user'

interface UsersTableProps {
    filterValue: string
    isDarkMode?: boolean
}

export const UsersTable = ({ filterValue, isDarkMode = false }: UsersTableProps) => {
    const { t } = useLanguage()
    const { data: users, isLoading, isError, error } = useGetUsersQuery()
    const { data: posts } = useGetPostsQuery()
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    
    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [userToEdit, setUserToEdit] = useState<User | null>(null)
    
    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    
    // Toast state
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

    // Helper function to get post count for a user (memoized for performance)
    const getPostCount = useMemo(() => {
        if (!posts) return () => 0
        
        const postCounts: Record<number, number> = {}
        posts.forEach(post => {
            postCounts[post.userId] = (postCounts[post.userId] || 0) + 1
        })
        
        return (userId: number) => postCounts[userId] || 0
    }, [posts])

    // Filter function for users
    const filterUsers = (users: User[], filterValue: string) => {
        const searchTerm = filterValue.toLowerCase().trim()
        return users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        )
    }

    // Table columns configuration
    const columns: Column<User>[] = [
        {
            key: 'id',
            label: t.id,
            render: (user) => <span className="font-normal">{user.id}</span>
        },
        {
            key: 'name',
            label: t.name,
            render: (user) => <span className="font-normal">{user.name}</span>
        },
        {
            key: 'username',
            label: t.username,
            render: (user) => (
                <span className="font-normal">
                    {user.username}
                </span>
            )
        },
        {
            key: 'email',
            label: t.email,
            render: (user) => (
                <span className="font-normal">
                    {user.email}
                </span>
            )
        },
        {
            key: 'postCount',
            label: t.postCount,
            render: (user) => (
                <span className="font-normal">
                    {getPostCount(user.id)}
                </span>
            )
        }
    ]

    // Event handlers
    const handleUserClick = (user: User) => {
        setSelectedUser(user)
        setIsDetailModalOpen(true)
    }

    const handleUserView = (user: User) => {
        setSelectedUser(user)
        setIsDetailModalOpen(true)
    }

    const handleUserEdit = (user: User) => {
        setUserToEdit(user)
        setIsEditModalOpen(true)
    }

    const handleUserDelete = (user: User) => {
        setUserToDelete(user)
        setIsDeleteModalOpen(true)
    }

    const handleEditSuccess = () => {
        setToast({ message: t.userUpdateSuccess, type: 'success' })
        if (isDetailModalOpen) {
            setIsDetailModalOpen(false)
            setSelectedUser(null)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return

        try {
            await deleteUser(userToDelete.id).unwrap()
            setToast({ message: t.userDeleteSuccess, type: 'success' })
            setIsDeleteModalOpen(false)
            setUserToDelete(null)
            if (selectedUser && selectedUser.id === userToDelete.id) {
                setIsDetailModalOpen(false)
                setSelectedUser(null)
            }
        } catch {
            setToast({ message: t.userDeleteError, type: 'error' })
        }
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false)
        setUserToDelete(null)
    }

    return (
        <div>
            <BaseTable<User>
                data={users}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                error={error}
                filterValue={filterValue}
                filterFunction={filterUsers}
                isDarkMode={isDarkMode}
                getItemId={(user) => user.id}
                onItemClick={handleUserClick}
                onItemView={handleUserView}
                onItemEdit={handleUserEdit}
                onItemDelete={handleUserDelete}
                noDataMessage={t.noUsersFound}
                noFilterResultsMessage={(filter) => `${t.noUsersMatching} "${filter}"`}
                loadingMessage={t.loadingUsers}
                errorMessage={(err) => `${t.errorLoadingUsers}: ${err && typeof err === 'object' && err !== null && 'status' in err ? (err as {status: unknown}).status : 'Unknown error'}`}
            />

            {/* User Detail Modal */}
            <UserDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setSelectedUser(null)
                }}
                user={selectedUser}
                isDarkMode={isDarkMode}
                onDelete={handleUserDelete}
                onEdit={handleUserEdit}
            />

            {/* Edit User Modal */}
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setUserToEdit(null)
                }}
                user={userToEdit}
                isDarkMode={isDarkMode}
                onSuccess={handleEditSuccess}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                isDarkMode={isDarkMode}
                isLoading={isDeleting}
                isUser={true}
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