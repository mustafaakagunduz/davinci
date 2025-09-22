import { useMemo, useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { ContextMenu } from './ui/ContextMenu'
import { Toast, type ToastType } from './ui/Toast'

export interface Column<T> {
    key: string
    label: string
    render: (item: T) => React.ReactNode
    sortable?: boolean
}

export interface BaseTableProps<T> {
    data: T[] | undefined
    columns: Column<T>[]
    isLoading: boolean
    isError: boolean
    error?: unknown
    filterValue: string
    filterFunction: (items: T[], filterValue: string) => T[]
    isDarkMode?: boolean
    itemsPerPage?: number
    getItemId: (item: T) => number | string
    onItemClick: (item: T) => void
    onItemView: (item: T) => void
    onItemEdit: (item: T) => void
    onItemDelete: (item: T) => void
    noDataMessage: string
    noFilterResultsMessage: (filterValue: string) => string
    loadingMessage: string
    errorMessage: (error: unknown) => string
    sortOrder?: 'asc' | 'desc'
    onSortChange?: (sortOrder: 'asc' | 'desc') => void
}

export function BaseTable<T>({
    data,
    columns,
    isLoading,
    isError,
    error,
    filterValue,
    filterFunction,
    isDarkMode = false,
    itemsPerPage = 20,
    getItemId,
    onItemClick,
    onItemView,
    onItemEdit,
    onItemDelete,
    noDataMessage,
    noFilterResultsMessage,
    loadingMessage,
    errorMessage,
    sortOrder = 'asc',
    onSortChange
}: BaseTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1)
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null)
    
    // Context menu state
    const [contextMenu, setContextMenu] = useState<{
        x: number
        y: number
        item: T | null
        isVisible: boolean
    }>({ x: 0, y: 0, item: null, isVisible: false })

    // Filter and sort data
    const filteredData = useMemo(() => {
        if (!data) return data
        
        let result = filterValue.trim() ? filterFunction(data, filterValue) : data
        
        // Sort by id based on sortOrder prop
        result = [...result].sort((a: T, b: T) => {
            const aId = Number(getItemId(a))
            const bId = Number(getItemId(b))
            return sortOrder === 'desc' ? bId - aId : aId - bId
        })
        
        return result
    }, [data, filterValue, filterFunction, getItemId, sortOrder])

    // Calculate pagination
    const totalItems = filteredData?.length || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = filteredData?.slice(startIndex, endIndex) || []

    // Reset to first page when filter changes
    useEffect(() => {
        setCurrentPage(1)
    }, [filterValue])

    // Context menu handlers
    const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement>, item: T) => {
        event.preventDefault()
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            item,
            isVisible: true
        })
    }

    const handleContextMenuClose = () => {
        setContextMenu({ x: 0, y: 0, item: null, isVisible: false })
    }

    const handleContextMenuView = () => {
        if (contextMenu.item) {
            onItemView(contextMenu.item)
        }
    }

    const handleContextMenuEdit = () => {
        if (contextMenu.item) {
            onItemEdit(contextMenu.item)
        }
    }

    const handleContextMenuDelete = () => {
        if (contextMenu.item) {
            onItemDelete(contextMenu.item)
        }
    }

    // Long press handlers for touchpad compatibility
    const handleMouseDown = (event: React.MouseEvent<HTMLTableRowElement>, item: T) => {
        if (longPressTimer) {
            clearTimeout(longPressTimer)
        }
        
        const timer = setTimeout(() => {
            setContextMenu({
                x: event.clientX,
                y: event.clientY,
                item,
                isVisible: true
            })
        }, 500)
        
        setLongPressTimer(timer)
    }

    const handleMouseUp = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer)
            setLongPressTimer(null)
        }
    }

    const handleMouseLeave = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer)
            setLongPressTimer(null)
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-lg">{loadingMessage}</div>
            </div>
        )
    }

    // Error state
    if (isError) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500">{errorMessage(error)}</div>
            </div>
        )
    }

    // No data state
    if (!data || data.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{noDataMessage}</div>
            </div>
        )
    }

    // No filter results state
    if (filteredData && filteredData.length === 0 && filterValue.trim()) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    {noFilterResultsMessage(filterValue)}
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
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-2 text-center text-base font-normal uppercase tracking-wider transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                    } ${
                                        column.key === 'id' && onSortChange ? 'cursor-pointer hover:bg-opacity-75' : ''
                                    }`}
                                    onClick={() => {
                                        if (column.key === 'id' && onSortChange) {
                                            onSortChange(sortOrder === 'asc' ? 'desc' : 'asc')
                                        }
                                    }}
                                >
                                    {column.label}
                                    {column.key === 'id' && (
                                        <span className="ml-1">
                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y transition-colors duration-200 ${
                        isDarkMode 
                            ? 'bg-gray-800 divide-gray-600' 
                            : 'bg-white divide-gray-200'
                    }`}>
                        {currentItems.map((item, index) => {
                            const itemId = getItemId(item)
                            const isContextMenuActive = contextMenu.isVisible && 
                                contextMenu.item && getItemId(contextMenu.item) === itemId
                            
                            // Row styling with context menu active state
                            let rowClassName
                            if (isContextMenuActive) {
                                rowClassName = isDarkMode ? 'bg-gray-700' : 
                                    (index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100')
                            } else {
                                const baseClassName = index % 2 === 0 
                                    ? isDarkMode ? 'bg-gray-800' : 'bg-white'
                                    : isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                                
                                const hoverClassName = isDarkMode ? 'hover:bg-gray-700' : 
                                    (index % 2 === 0 ? 'hover:bg-gray-50' : 'hover:bg-gray-100')
                                
                                rowClassName = `${baseClassName} ${hoverClassName}`
                            }
                            
                            return (
                                <tr 
                                    key={itemId}
                                    className={`cursor-pointer transition-colors duration-200 ${rowClassName}`}
                                    onClick={() => onItemClick(item)}
                                    onContextMenu={(e) => handleContextMenu(e, item)}
                                    onMouseDown={(e) => handleMouseDown(e, item)}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {columns.map((column) => (
                                        <td 
                                            key={column.key}
                                            className={`px-6 py-2 whitespace-nowrap text-base text-center transition-colors duration-200 ${
                                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}
                                        >
                                            {column.render(item)}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
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