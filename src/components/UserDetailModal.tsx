// src/components/UserDetailModal.tsx

import { Modal } from './ui/Modal'
import { useLanguage } from '../contexts/LanguageContext'
import type { User } from '../types/user'
import { MapPinIcon, PhoneIcon, GlobeAltIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

interface UserDetailModalProps {
    isOpen: boolean
    onClose: () => void
    user: User | null
    isDarkMode?: boolean
    onDelete?: (user: User) => void
    onEdit?: (user: User) => void
}

export const UserDetailModal = ({ isOpen, onClose, user, isDarkMode = false, onDelete, onEdit }: UserDetailModalProps) => {
    const { t } = useLanguage()

    if (!user) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t.userDetails}
            size="wide"
            isDarkMode={isDarkMode}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Basic Information */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-3 transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            {t.basicInformation}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg transition-colors duration-200 ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <label className={`text-sm font-medium transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t.id}
                                </label>
                                <p className={`text-sm mt-1 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {user.id}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg transition-colors duration-200 ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <label className={`text-sm font-medium transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t.name}
                                </label>
                                <p className={`text-sm mt-1 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {user.name}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg transition-colors duration-200 ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <label className={`text-sm font-medium transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t.username}
                                </label>
                                <p className={`text-sm mt-1 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {user.username}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg transition-colors duration-200 ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <label className={`text-sm font-medium transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t.email}
                                </label>
                                <p className={`text-sm mt-1 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            <PhoneIcon className="h-5 w-5 mr-2" />
                            {t.contactInformation}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg transition-colors duration-200 ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <label className={`text-sm font-medium transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t.phone}
                                </label>
                                <p className={`text-sm mt-1 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {user.phone}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg transition-colors duration-200 ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                                <label className={`text-sm font-medium flex items-center transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    <GlobeAltIcon className="h-4 w-4 mr-1" />
                                    {t.website}
                                </label>
                                <a 
                                    href={`https://${user.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-sm mt-1 hover:underline transition-colors duration-200 ${
                                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                    }`}
                                >
                                    {user.website}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Address Information */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            {t.addressInformation}
                        </h3>
                        <div className={`p-4 rounded-lg transition-colors duration-200 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className={`text-sm font-medium transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {t.street}
                                    </label>
                                    <p className={`text-sm mt-1 transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                        {user.address.street}
                                    </p>
                                </div>
                                <div>
                                    <label className={`text-sm font-medium transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {t.suite}
                                    </label>
                                    <p className={`text-sm mt-1 transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                        {user.address.suite}
                                    </p>
                                </div>
                                <div>
                                    <label className={`text-sm font-medium transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {t.city}
                                    </label>
                                    <p className={`text-sm mt-1 transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                        {user.address.city}
                                    </p>
                                </div>
                                <div>
                                    <label className={`text-sm font-medium transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {t.zipcode}
                                    </label>
                                    <p className={`text-sm mt-1 transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                        {user.address.zipcode}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className={`text-sm font-medium transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {t.coordinates}
                                </label>
                                <p className={`text-sm mt-1 transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {t.latitude}: {user.address.geo.lat}, {t.longitude}: {user.address.geo.lng}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Company Information */}
                    <div>
                        <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                            {t.companyInformation}
                        </h3>
                        <div className={`p-4 rounded-lg transition-colors duration-200 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                            <div className="space-y-3">
                                <div>
                                    <label className={`text-sm font-medium transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {t.companyName}
                                    </label>
                                    <p className={`text-sm mt-1 font-medium transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                        {user.company.name}
                                    </p>
                                </div>
                                <div>
                                    <label className={`text-sm font-medium transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {t.catchPhrase}
                                    </label>
                                    <p className={`text-sm mt-1 italic transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                        "{user.company.catchPhrase}"
                                    </p>
                                </div>
                                <div>
                                    <label className={`text-sm font-medium transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {t.businessStrategy}
                                    </label>
                                    <p className={`text-sm mt-1 transition-colors duration-200 ${
                                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                        {user.company.bs}
                                    </p>
                                </div>
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
                                onEdit(user)
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
                                onDelete(user)
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