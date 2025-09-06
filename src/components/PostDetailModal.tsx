// src/components/PostDetailModal.tsx

import { Modal } from './ui/Modal'
import { useLanguage } from '../contexts/LanguageContext'
import { useGetUsersQuery } from '../store/api/usersApi'
import type { Post } from '../types/post'
import { DocumentTextIcon, UserIcon, HashtagIcon } from '@heroicons/react/24/outline'

interface PostDetailModalProps {
    isOpen: boolean
    onClose: () => void
    post: Post | null
    isDarkMode?: boolean
    onDelete?: (post: Post) => void
    onEdit?: (post: Post) => void
}

export const PostDetailModal = ({ isOpen, onClose, post, isDarkMode = false, onDelete, onEdit }: PostDetailModalProps) => {
    const { t } = useLanguage()
    const { data: users } = useGetUsersQuery()

    if (!post) return null

    // Find the user who wrote this post
    const postAuthor = users?.find(user => user.id === post.userId)

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t.postDetails}
            size="wide"
            isDarkMode={isDarkMode}
        >
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Post Info & Author */}
                <div className="lg:w-1/3 space-y-4">
                    <div>
                        <h3 className={`text-lg font-semibold mb-3 transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            {t.basicInformation}
                        </h3>
                        <div className="space-y-3">
                            <div className={`p-3 rounded-lg transition-colors duration-200 ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <label className={`text-sm font-medium flex items-center transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    <HashtagIcon className="h-4 w-4 mr-1" />
                                    {t.id}
                                </label>
                                <p className={`text-sm mt-1 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {post.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Author Information */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            <UserIcon className="h-5 w-5 mr-2" />
                            {t.authorDetails}
                        </h3>
                        <div className={`p-4 rounded-lg transition-colors duration-200 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                            {postAuthor ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className={`text-sm font-medium transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            {t.username}
                                        </label>
                                        <p className={`text-sm mt-1 font-medium transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>
                                            {postAuthor.username}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`text-sm font-medium transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            {t.name}
                                        </label>
                                        <p className={`text-sm mt-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>
                                            {postAuthor.name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`text-sm font-medium transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            {t.email}
                                        </label>
                                        <p className={`text-sm mt-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                        }`}>
                                            {postAuthor.email}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className={`text-sm font-medium transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {t.author}
                                    </label>
                                    <p className={`text-sm mt-1 transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                        User {post.userId}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Columns - Content */}
                <div className="lg:w-2/3 flex flex-col">
                    <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        {t.postContent}
                    </h3>
                    
                    <div className={`p-4 rounded-lg space-y-4 flex-1 overflow-y-auto max-h-96 transition-colors duration-200 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                            {/* Title */}
                            <div>
                                <label className={`text-sm font-medium transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t.title_field}
                                </label>
                                <h4 className={`text-lg mt-2 font-semibold transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {post.title}
                                </h4>
                            </div>

                            {/* Body */}
                            <div>
                                <label className={`text-sm font-medium transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t.content}
                                </label>
                                <div className={`mt-2 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {post.body.split('\n').map((paragraph, index) => (
                                        <p key={index} className="mb-2 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 mt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-3">
                    <button
                        onClick={() => {
                            if (onEdit) {
                                onEdit(post)
                                onClose()
                            }
                        }}
                        className={`px-6 py-2 rounded-lg font-medium border cursor-pointer transition-colors duration-200 ${
                            isDarkMode
                                ? 'border-gray-500 text-gray-200 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {t.edit}
                    </button>
                    <button
                        onClick={() => {
                            if (onDelete) {
                                onDelete(post)
                            }
                        }}
                        className={`px-6 py-2 rounded-lg font-medium border cursor-pointer transition-colors duration-200 ${
                            isDarkMode
                                ? 'border-gray-500 text-gray-200 hover:border-red-500 hover:text-red-400'
                                : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                        }`}
                    >
                        {t.delete}
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className={`px-6 py-2 rounded-lg font-medium border cursor-pointer transition-colors duration-200 ${
                        isDarkMode
                            ? 'border-gray-500 text-gray-200 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {t.close}
                </button>
            </div>
        </Modal>
    )
}