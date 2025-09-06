// src/components/AddPostModal.tsx

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from './ui/Modal'
import { useLanguage } from '../contexts/LanguageContext'
import { useAddPostMutation, useGetPostsQuery } from '../store/api/postsApi'
import { useGetUsersQuery } from '../store/api/usersApi'
import { Toast, type ToastType } from './ui/Toast'
import { useState, useRef, useEffect, useMemo } from 'react'
import { DocumentTextIcon, UserIcon, PencilIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface AddPostModalProps {
    isOpen: boolean
    onClose: () => void
    isDarkMode?: boolean
}

// Zod validation schema
const createPostSchema = (t: any) => z.object({
    userId: z.number().min(1, t.userRequired),
    title: z.string().min(1, t.titleRequired),
    body: z.string().min(1, t.contentRequired),
})

type FormData = z.infer<ReturnType<typeof createPostSchema>>

export const AddPostModal = ({ isOpen, onClose, isDarkMode = false }: AddPostModalProps) => {
    const { t } = useLanguage()
    const { data: posts } = useGetPostsQuery()
    const { data: users } = useGetUsersQuery()
    const [addPost, { isLoading }] = useAddPostMutation()
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
    const [userSearch, setUserSearch] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    
    // ID counter için ref kullan
    const nextIdRef = useRef<number | null>(null)
    
    // Initial ID'yi ayarla
    useEffect(() => {
        if (posts && posts.length > 0 && nextIdRef.current === null) {
            nextIdRef.current = Math.max(...posts.map(p => p.id)) + 1
        }
    }, [posts])
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            // Modal içindeyken sadece dropdown-container dışına tıklanması durumunda kapat
            if (!target.closest('.dropdown-container') && target.closest('.modal-content')) {
                setIsDropdownOpen(false)
            }
        }
        
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen])

    const schema = createPostSchema(t)
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            userId: 0,
            title: '',
            body: '',
        }
    })

    const selectedUserId = watch('userId')
    
    // Filtered users based on search
    const filteredUsers = useMemo(() => {
        if (!users) return []
        if (!userSearch.trim()) return users
        
        return users.filter(user => 
            user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.username.toLowerCase().includes(userSearch.toLowerCase())
        )
    }, [users, userSearch])
    
    const selectedUser = users?.find(u => u.id === selectedUserId)

    const onSubmit = async (data: FormData) => {
        try {
            // Fallback: eğer nextIdRef null ise backend posts'dan hesapla
            if (nextIdRef.current === null) {
                nextIdRef.current = posts && posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1
            }
            
            const newId = nextIdRef.current
            console.log('Assigning Post ID:', newId)

            // Backend API formatına uygun olarak dönüştür
            const postToAdd = {
                id: newId,
                userId: data.userId,
                title: data.title,
                body: data.body,
            }

            await addPost(postToAdd).unwrap()
            
            // Bir sonraki post için ID'yi artır
            nextIdRef.current = nextIdRef.current + 1
            
            setToast({ message: t.postAddSuccess, type: 'success' })
            reset()
            onClose()
        } catch (error) {
            setToast({ message: t.postAddError, type: 'error' })
        }
    }

    const handleClose = () => {
        reset()
        setUserSearch('')
        setIsDropdownOpen(false)
        onClose()
    }
    
    const handleUserSelect = (user: typeof users[0]) => {
        setValue('userId', user.id)
        setUserSearch(`${user.name} (@${user.username})`)
        setIsDropdownOpen(false)
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title={t.addPostTitle}
                size="lg"
                isDarkMode={isDarkMode}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* User Selection */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            <UserIcon className="h-5 w-5 mr-2" />
                            {t.selectUser} <span className={`ml-1 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>({t.required})</span>
                        </h3>
                        
                        <div className="relative dropdown-container">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => {
                                        setUserSearch(e.target.value)
                                        setIsDropdownOpen(true)
                                        if (!e.target.value) {
                                            setValue('userId', 0)
                                        }
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    onClick={() => {
                                        // Seçili kullanıcı varsa resetle
                                        if (selectedUserId > 0) {
                                            setUserSearch('')
                                            setValue('userId', 0)
                                            setIsDropdownOpen(true)
                                        } else {
                                            setIsDropdownOpen(true)
                                        }
                                    }}
                                    placeholder={t.searchUsers}
                                    className={`w-full px-3 py-2 pr-10 border rounded-lg transition-colors duration-200 ${
                                        errors.userId
                                            ? isDarkMode
                                                ? 'border-red-500 bg-gray-700 text-gray-100 focus:border-red-500'
                                                : 'border-red-500 bg-white text-gray-900 focus:border-red-500'
                                            : isDarkMode
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Seçili kullanıcı varsa resetle
                                        if (selectedUserId > 0) {
                                            setUserSearch('')
                                            setValue('userId', 0)
                                            setIsDropdownOpen(true)
                                        } else {
                                            setIsDropdownOpen(!isDropdownOpen)
                                        }
                                    }}
                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${
                                        isDropdownOpen ? 'rotate-180' : ''
                                    }`} />
                                </button>
                            </div>
                            
                            {/* Hidden input for form validation */}
                            <input
                                type="hidden"
                                {...register('userId', { 
                                    valueAsNumber: true,
                                    validate: (value) => value > 0 || t.userRequired
                                })}
                            />
                            
                            {/* Dropdown */}
                            {isDropdownOpen && (
                                <div className={`absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600' 
                                        : 'bg-white border-gray-300'
                                }`}>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => handleUserSelect(user)}
                                                className={`w-full px-3 py-1.5 text-left hover:bg-opacity-75 transition-colors duration-200 ${
                                                    selectedUserId === user.id
                                                        ? isDarkMode
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-blue-500 text-white'
                                                        : isDarkMode
                                                            ? 'hover:bg-gray-600 text-gray-100'
                                                            : 'hover:bg-gray-100 text-gray-900'
                                                }`}
                                            >
                                                <div className={`text-sm ${
                                                    selectedUserId === user.id
                                                        ? 'text-white'
                                                        : isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                                }`}>
                                                    @{user.username} • {user.name}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className={`px-3 py-2 text-sm ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            No users found
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>}
                        </div>
                    </div>

                    {/* Post Content */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            {t.postContent} <span className={`ml-1 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>({t.required})</span>
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    <PencilIcon className="h-4 w-4 mr-1 inline" />
                                    {t.postTitle} <span className={isDarkMode ? 'text-red-400' : 'text-red-500'}>*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('title')}
                                    className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                        errors.title
                                            ? isDarkMode
                                                ? 'border-red-500 bg-gray-700 text-gray-100 focus:border-red-500'
                                                : 'border-red-500 bg-white text-gray-900 focus:border-red-500'
                                            : isDarkMode
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                    placeholder={t.enterPostTitle}
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                            </div>

                            {/* Content */}
                            <div>
                                <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    {t.content} <span className={isDarkMode ? 'text-red-400' : 'text-red-500'}>*</span>
                                </label>
                                <textarea
                                    {...register('body')}
                                    rows={6}
                                    className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 resize-none ${
                                        errors.body
                                            ? isDarkMode
                                                ? 'border-red-500 bg-gray-700 text-gray-100 focus:border-red-500'
                                                : 'border-red-500 bg-white text-gray-900 focus:border-red-500'
                                            : isDarkMode
                                                ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                    placeholder={t.writePostContent}
                                />
                                {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>}
                            </div>
                        </div>
                    </div>


                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className={`px-6 py-2 rounded-lg font-medium border transition-colors duration-200 ${
                                isDarkMode
                                    ? 'border-gray-500 text-gray-200 hover:bg-gray-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? t.saving : t.save}
                        </button>
                    </div>
                </form>
            </Modal>

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
        </>
    )
}