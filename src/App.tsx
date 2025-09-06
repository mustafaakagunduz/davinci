// src/App.tsx

import { useState, useEffect } from 'react'
import { UsersTable } from './components/UsersTable'
import { PostsTable } from './components/PostsTable'
import { FilterBar } from './components/FilterBar'
import { AddUserModal } from './components/AddUserModal'
import { AddPostModal } from './components/AddPostModal'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import type { Language } from './contexts/LanguageContext'

function App() {
    const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users')
    const [filterValue, setFilterValue] = useState('')
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved === 'dark'
    })
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language')
        return (saved === 'TR' || saved === 'EN') ? saved : 'EN'
    })

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    useEffect(() => {
        localStorage.setItem('language', language)
    }, [language])

    return (
        <LanguageProvider language={language} setLanguage={setLanguage}>
            <AppContent 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                language={language}
                setLanguage={setLanguage}
            />
        </LanguageProvider>
    )
}

interface AppContentProps {
    activeTab: 'users' | 'posts'
    setActiveTab: (tab: 'users' | 'posts') => void
    filterValue: string
    setFilterValue: (value: string) => void
    isDarkMode: boolean
    setIsDarkMode: (value: boolean) => void
    language: Language
    setLanguage: (language: Language) => void
}

function AppContent({
    activeTab,
    setActiveTab,
    filterValue,
    setFilterValue,
    isDarkMode,
    setIsDarkMode,
    language,
    setLanguage,
}: AppContentProps) {
    const { t } = useLanguage()
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
    const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false)

    return (
        <div className={`min-h-screen transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
            {/* Header */}
            <header className="bg-transparent relative z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left - Title */}
                        <h1 className={`text-xl font-normal transition-colors duration-200 ${
                            isDarkMode ? 'text-white' : 'text-blue-600'
                        }`}>
                            {t.title}
                        </h1>

                        {/* Center - Tab Navigation */}
                        <div className={`flex rounded-lg shadow p-1 transition-colors duration-200 ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <button
                                onClick={() => {
                                    setActiveTab('users')
                                    setFilterValue('')
                                }}
                                className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                                    activeTab === 'users'
                                        ? 'bg-blue-500 text-white'
                                        : isDarkMode 
                                            ? 'text-gray-300 hover:text-white' 
                                            : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {t.users}
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('posts')
                                    setFilterValue('')
                                }}
                                className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                                    activeTab === 'posts'
                                        ? 'bg-blue-500 text-white'
                                        : isDarkMode 
                                            ? 'text-gray-300 hover:text-white' 
                                            : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {t.posts}
                            </button>
                        </div>

                        {/* Right - Theme and Language Buttons */}
                        <div className="flex items-center space-x-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className={`p-2 rounded-lg shadow transition-colors duration-200 ${
                                    isDarkMode 
                                        ? 'bg-gray-800 hover:bg-gray-700' 
                                        : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                {isDarkMode ? (
                                    <SunIcon className="h-5 w-5 text-white" />
                                ) : (
                                    <MoonIcon className="h-5 w-5 text-gray-600" />
                                )}
                            </button>

                            {/* Language Toggle */}
                            <button
                                onClick={() => setLanguage(language === 'TR' ? 'EN' : 'TR')}
                                className={`px-3 py-2 rounded-lg shadow transition-colors duration-200 font-medium min-w-[60px] text-center ${
                                    isDarkMode 
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                                        : 'bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                {language === 'EN' ? 'En' : 'Tr'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">

                {/* Filter Bar */}
                <FilterBar
                    value={filterValue}
                    onChange={setFilterValue}
                    placeholder={
                        activeTab === 'users' 
                            ? t.searchUsersPlaceholder
                            : t.searchPostsPlaceholder
                    }
                    isDarkMode={isDarkMode}
                />

                {/* Content */}
                <div className={`rounded-lg shadow transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-xl font-semibold transition-colors duration-200 ${
                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                                {activeTab === 'users' ? t.usersList : t.postsList}
                            </h2>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => {
                                        if (activeTab === 'users') {
                                            setIsAddUserModalOpen(true)
                                        } else {
                                            setIsAddPostModalOpen(true)
                                        }
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    {activeTab === 'users' ? t.addNewUser : t.addNewPost}
                                </button>
                            </div>
                        </div>

                        {activeTab === 'users' ? <UsersTable filterValue={filterValue} isDarkMode={isDarkMode} /> : <PostsTable filterValue={filterValue} isDarkMode={isDarkMode} />}
                    </div>
                </div>

            </div>

            {/* Add User Modal */}
            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                isDarkMode={isDarkMode}
            />

            {/* Add Post Modal */}
            <AddPostModal
                isOpen={isAddPostModalOpen}
                onClose={() => setIsAddPostModalOpen(false)}
                isDarkMode={isDarkMode}
            />
        </div>
    )
}

export default App