import { useEffect, useRef } from 'react'
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ContextMenuProps {
    x: number
    y: number
    isVisible: boolean
    onClose: () => void
    onView: () => void
    onEdit: () => void
    onDelete: () => void
    isDarkMode?: boolean
}

export const ContextMenu = ({
    x,
    y,
    isVisible,
    onClose,
    onView,
    onEdit,
    onDelete,
    isDarkMode = false
}: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        const handleScroll = () => {
            onClose()
        }

        const handleContextMenu = (event: MouseEvent) => {
            // Eğer context menu açıksa ve sağ tık menu'nun dışındaysa kapat
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isVisible) {
            // mousedown yerine setTimeout ile biraz gecikme ekleyelim
            const timer = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside)
                document.addEventListener('keydown', handleEscape)
                document.addEventListener('scroll', handleScroll)
                document.addEventListener('contextmenu', handleContextMenu)
            }, 100)

            return () => {
                clearTimeout(timer)
                document.removeEventListener('mousedown', handleClickOutside)
                document.removeEventListener('keydown', handleEscape)
                document.removeEventListener('scroll', handleScroll)
                document.removeEventListener('contextmenu', handleContextMenu)
            }
        }

    }, [isVisible, onClose])

    if (!isVisible) return null

    const menuItems = [
        {
            icon: EyeIcon,
            label: 'View Details',
            onClick: () => {
                onView()
                onClose()
            }
        },
        {
            icon: PencilIcon,
            label: 'Edit',
            onClick: () => {
                onEdit()
                onClose()
            }
        },
        {
            icon: TrashIcon,
            label: 'Delete',
            onClick: () => {
                onDelete()
                onClose()
            },
            className: 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300'
        }
    ]

    return (
        <div
            ref={menuRef}
            className={`fixed z-50 min-w-[160px] rounded-md shadow-lg transition-colors duration-200 ${
                isDarkMode 
                    ? 'bg-gray-800 border border-gray-600' 
                    : 'bg-white border border-gray-200'
            }`}
            style={{
                left: x,
                top: y,
            }}
        >
            <div className="py-1">
                {menuItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className={`
                                w-full flex items-center px-4 py-2 text-sm transition-colors duration-200
                                ${item.className || `${
                                    isDarkMode 
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100' 
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            `}
                        >
                            <Icon className="h-4 w-4 mr-3" />
                            {item.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}