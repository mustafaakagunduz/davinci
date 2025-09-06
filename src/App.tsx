// src/App.tsx

import { useState } from 'react'
import { UsersTable } from './components/UsersTable'
import { PostsTable } from './components/PostsTable'
import './App.css'

function App() {
    const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users')

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    User & Post Management
                </h1>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="flex bg-white rounded-lg shadow p-1">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'users'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'posts'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Posts
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {activeTab === 'users' ? 'Users List' : 'Posts List'}
                            </h2>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                                Add New {activeTab === 'users' ? 'User' : 'Post'}
                            </button>
                        </div>

                        {activeTab === 'users' ? <UsersTable /> : <PostsTable />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App