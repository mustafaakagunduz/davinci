// src/components/ui/Modal.tsx

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide'
    showCloseButton?: boolean
    isDarkMode?: boolean
}

export const Modal = ({
                          isOpen,
                          onClose,
                          title,
                          children,
                          size = 'md',
                          showCloseButton = true,
                          isDarkMode = false
                      }: ModalProps) => {
    // Escape key ile kapama ve scroll yönetimi
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            
            // Scrollbar genişliğini hesapla
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
            
            // Body'ye modal-open class'ını ekle
            document.body.classList.add('modal-open')
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.classList.remove('modal-open')
            document.documentElement.style.removeProperty('--scrollbar-width')
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null
    }

    // Modal boyut sınıfları
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        wide: 'max-w-6xl'
    }

    const modalContent = (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 transition-opacity"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`modal-content relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg shadow-xl transition-all ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className={`flex items-center justify-between px-6 py-4 border-b transition-colors duration-200 ${
                            isDarkMode ? 'border-gray-600' : 'border-gray-200'
                        }`}>
                            {title && (
                                <h3 className={`text-lg font-medium transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <button
                                    type="button"
                                    className={`transition-colors duration-200 ${
                                        isDarkMode 
                                            ? 'text-gray-400 hover:text-gray-200' 
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="px-6 py-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )

    // Portal ile render
    return createPortal(modalContent, document.body)
}