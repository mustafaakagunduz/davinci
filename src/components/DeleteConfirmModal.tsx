// src/components/DeleteConfirmModal.tsx

import { Modal } from './ui/Modal'
import { useLanguage } from '../contexts/LanguageContext'

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isDarkMode?: boolean
    isLoading?: boolean
    isUser?: boolean
}

export const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    isDarkMode = false,
    isLoading = false,
    isUser = false
}: DeleteConfirmModalProps) => {
    const { t } = useLanguage()

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            isDarkMode={isDarkMode}
            title={t.confirmDelete}
            showCloseButton={true}
        >
            <p className={`mb-6 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    {isUser ? t.deleteUserConfirmation : t.deleteConfirmation}
                </p>
                
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                            isDarkMode 
                                ? 'bg-gray-600 hover:bg-gray-700 text-gray-200' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {t.cancel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? t.deleting : t.confirm}
                    </button>
                </div>
        </Modal>
    )
}