// src/components/ui/Toast.tsx

import { useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export type ToastType = 'success' | 'error'

interface ToastProps {
    message: string
    type: ToastType
    isVisible: boolean
    onClose: () => void
    duration?: number
    isDarkMode?: boolean
}

export const Toast = ({ 
    message, 
    type, 
    isVisible, 
    onClose, 
    duration = 3000,
    isDarkMode = false 
}: ToastProps) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            
            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    if (!isVisible) return null

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full">
            <div className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg transition-colors duration-200
                ${type === 'success' 
                    ? isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
                    : isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'
                }
            `}>
                {type === 'success' ? (
                    <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                ) : (
                    <XCircleIcon className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className={`ml-2 text-lg leading-none transition-colors duration-200 ${
                        type === 'success'
                            ? isDarkMode ? 'hover:text-green-300' : 'hover:text-green-600'
                            : isDarkMode ? 'hover:text-red-300' : 'hover:text-red-600'
                    }`}
                >
                    ×
                </button>
            </div>
        </div>
    )
}