import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface FilterBarProps {
    value: string
    onChange: (value: string) => void
    placeholder: string
    isDarkMode?: boolean
}
export const FilterBar = ({ value, onChange, placeholder, isDarkMode = false }: FilterBarProps) => {
    return (
        <div className="mb-6">
            <div className="relative w-full">
                <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`} />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400' 
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                />
            </div>
        </div>
    )
}