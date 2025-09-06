// src/types/modal.ts

export interface BaseModalProps {
    isOpen: boolean
    onClose: () => void
}

export interface ConfirmationModalProps extends BaseModalProps {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    variant?: 'danger' | 'warning' | 'info'
}

export interface FormModalProps extends BaseModalProps {
    title: string
    onSubmit: () => void
    submitText?: string
    isLoading?: boolean
}