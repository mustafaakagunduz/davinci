// src/components/UsersTable.tsx

import { useMemo, useState, useEffect } from 'react'
import { useGetUsersQuery, useDeleteUserMutation } from '../store/api/usersApi'
import { useGetPostsQuery } from '../store/api/postsApi'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '../contexts/LanguageContext'
import { UserDetailModal } from './UserDetailModal'
import { EditUserModal } from './EditUserModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { Toast, type ToastType } from './ui/Toast'
import { ContextMenu } from './ui/ContextMenu'
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
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    
    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [userToEdit, setUserToEdit] = useState<User | null>(null)
    
    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    
    // Toast state
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
    
    // Context menu state
    const [contextMenu, setContextMenu] = useState<{
        x: number
        y: number
        user: User | null
        isVisible: boolean
    }>({ x: 0, y: 0, user: null, isVisible: false })
    
    // Long press state
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null)

    // Helper function to get post count for a user (memoized for performance)
    const getPostCount = useMemo(() => {
        if (!posts) return () => 0
        
        // Post count mapping'i oluştur (her user için)
        const postCounts: Record<number, number> = {}
        posts.forEach(post => {
            postCounts[post.userId] = (postCounts[post.userId] || 0) + 1
        })
        
        return (userId: number) => postCounts[userId] || 0
    }, [posts])

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        if (!users || !filterValue.trim()) return users

        const searchTerm = filterValue.toLowerCase().trim()
        
        return users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        )
    }, [users, filterValue])

    // Calculate pagination
    const totalItems = filteredUsers?.length || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentUsers = filteredUsers?.slice(startIndex, endIndex) || []

    // Reset to first page when filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [filterValue])

    // Handle edit
    const handleEditClick = (user: User) => {
        setUserToEdit(user)
        setIsEditModalOpen(true)
    }

    const handleEditSuccess = () => {
        setToast({ message: t.userUpdateSuccess, type: 'success' })
        // Detay modalını da kapat eğer açıksa
        if (isDetailModalOpen) {
            setIsDetailModalOpen(false)
            setSelectedUser(null)
        }
    }

    // Handle delete
    const handleDeleteClick = (user: User) => {
        setUserToDelete(user)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return

        try {
            await deleteUser(userToDelete.id).unwrap()
            setToast({ message: t.userDeleteSuccess, type: 'success' })
            setIsDeleteModalOpen(false)
            setUserToDelete(null)
            // Detail modal'ı da kapat eğer silinen user açıksa
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

    // Handle context menu
    const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement>, user: User) => {
        event.preventDefault()
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            user,
            isVisible: true
        })
    }

    const handleContextMenuClose = () => {
        setContextMenu({ x: 0, y: 0, user: null, isVisible: false })
    }

    const handleContextMenuView = () => {
        if (contextMenu.user) {
            setSelectedUser(contextMenu.user)
            setIsDetailModalOpen(true)
        }
    }

    const handleContextMenuEdit = () => {
        if (contextMenu.user) {
            handleEditClick(contextMenu.user)
        }
    }

    const handleContextMenuDelete = () => {
        if (contextMenu.user) {
            handleDeleteClick(contextMenu.user)
        }
    }

    // Handle long press for touchpad users
    const handleMouseDown = (event: React.MouseEvent<HTMLTableRowElement>, user: User) => {
        // Clear any existing timer
        if (longPressTimer) {
            clearTimeout(longPressTimer)
        }
        
        // Set up long press timer
        const timer = setTimeout(() => {
            // Trigger context menu after 500ms
            setContextMenu({
                x: event.clientX,
                y: event.clientY,
                user,
                isVisible: true
            })
        }, 500)
        
        setLongPressTimer(timer)
    }

    const handleMouseUp = () => {
        // Clear timer if mouse is released before 500ms
        if (longPressTimer) {
            clearTimeout(longPressTimer)
            setLongPressTimer(null)
        }
    }

    const handleMouseLeave = () => {
        // Clear timer if mouse leaves the row
        if (longPressTimer) {
            clearTimeout(longPressTimer)
            setLongPressTimer(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-lg">{t.loadingUsers}</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">
                    {t.errorLoadingUsers}: {error && 'status' in error ? error.status : 'Unknown error'}
                </div>
            </div>
        )
    }

    if (!users || users.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{t.noUsersFound}</div>
            </div>
        )
    }

    if (filteredUsers && filteredUsers.length === 0 && filterValue.trim()) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    {t.noUsersMatching} "{filterValue}"
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
                        {t.name}
                    </th>
                    <th className={`px-6 py-2 text-center text-base font-normal uppercase tracking-wider transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                        {t.username}
                    </th>
                    <th className={`px-6 py-2 text-center text-base font-normal uppercase tracking-wider transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                        {t.email}
                    </th>
                    <th className={`px-6 py-2 text-center text-base font-normal uppercase tracking-wider transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                        {t.postCount}
                    </th>
                </tr>
                </thead>
                <tbody className={`divide-y transition-colors duration-200 ${
                    isDarkMode 
                        ? 'bg-gray-800 divide-gray-600' 
                        : 'bg-white divide-gray-200'
                }`}>
                {currentUsers.map((user, index) => (
                    <tr 
                        key={user.id} 
                        className={`cursor-pointer transition-colors duration-200 ${
                            index % 2 === 0 
                                ? isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                                : isDarkMode ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                            setSelectedUser(user)
                            setIsDetailModalOpen(true)
                        }}
                        onContextMenu={(e) => handleContextMenu(e, user)}
                        onMouseDown={(e) => handleMouseDown(e, user)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    >
                        <td className={`px-6 py-2 whitespace-nowrap text-base text-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            {user.id}
                        </td>
                        <td className={`px-6 py-2 whitespace-nowrap text-base font-normal text-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            {user.name}
                        </td>
                        <td className={`px-6 py-2 whitespace-nowrap text-base text-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                            {user.username}
                        </td>
                        <td className={`px-6 py-2 whitespace-nowrap text-base text-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                            {user.email}
                        </td>
                        <td className={`px-6 py-2 whitespace-nowrap text-base text-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                            {getPostCount(user.id)}
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
            
            {/* User Detail Modal */}
            <UserDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setSelectedUser(null)
                }}
                user={selectedUser}
                isDarkMode={isDarkMode}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
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

            {/* Context Menu */}
            <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                isVisible={contextMenu.isVisible}
                onClose={handleContextMenuClose}
                onView={handleContextMenuView}
                onEdit={handleContextMenuEdit}
                onDelete={handleContextMenuDelete}
                isDarkMode={isDarkMode}
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