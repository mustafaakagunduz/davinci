// src/components/EditUserModal.tsx

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from './ui/Modal'
import { useLanguage, type Translations } from '../contexts/LanguageContext'
import { useUpdateUserMutation } from '../store/api/usersApi'
import { useEffect } from 'react'
import { UserIcon, MapPinIcon, PhoneIcon, GlobeAltIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import type { User } from '../types/user'

interface EditUserModalProps {
    isOpen: boolean
    onClose: () => void
    user: User | null
    isDarkMode?: boolean
    onSuccess?: () => void
}

// Zod validation schema
const createUserSchema = (t: Translations) => z.object({
    name: z.string().min(1, t.nameRequired),
    username: z.string().min(1, t.usernameRequired),
    email: z.string().email(t.invalidEmail).min(1, t.emailRequired),
    phone: z.string().optional(),
    website: z.string().optional(),
    address: z.object({
        street: z.string().optional(),
        suite: z.string().optional(),
        city: z.string().optional(),
        zipcode: z.string().optional(),
        geo: z.object({
            lat: z.string().optional(),
            lng: z.string().optional(),
        }).optional(),
    }).optional(),
    company: z.object({
        name: z.string().optional(),
        catchPhrase: z.string().optional(),
        bs: z.string().optional(),
    }).optional(),
})

type FormData = z.infer<ReturnType<typeof createUserSchema>>

export const EditUserModal = ({ isOpen, onClose, user, isDarkMode = false, onSuccess }: EditUserModalProps) => {
    const { t } = useLanguage()
    const [updateUser, { isLoading }] = useUpdateUserMutation()

    const schema = createUserSchema(t)
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            phone: '',
            website: '',
            address: {
                street: '',
                suite: '',
                city: '',
                zipcode: '',
                geo: {
                    lat: '',
                    lng: '',
                }
            },
            company: {
                name: '',
                catchPhrase: '',
                bs: '',
            }
        }
    })

    // Form alanlarını kullanıcı verileriyle doldur
    useEffect(() => {
        if (user && isOpen) {
            reset({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                website: user.website || '',
                address: {
                    street: user.address?.street || '',
                    suite: user.address?.suite || '',
                    city: user.address?.city || '',
                    zipcode: user.address?.zipcode || '',
                    geo: {
                        lat: user.address?.geo?.lat || '',
                        lng: user.address?.geo?.lng || '',
                    }
                },
                company: {
                    name: user.company?.name || '',
                    catchPhrase: user.company?.catchPhrase || '',
                    bs: user.company?.bs || '',
                }
            })
        }
    }, [user, isOpen, reset])

    const onSubmit = async (data: FormData) => {
        if (!user) return

        try {
            const updatedUser = {
                ...user,
                name: data.name,
                username: data.username,
                email: data.email,
                phone: data.phone || '',
                website: data.website || '',
                address: {
                    street: data.address?.street || '',
                    suite: data.address?.suite || '',
                    city: data.address?.city || '',
                    zipcode: data.address?.zipcode || '',
                    geo: {
                        lat: data.address?.geo?.lat || '0',
                        lng: data.address?.geo?.lng || '0',
                    }
                },
                company: {
                    name: data.company?.name || '',
                    catchPhrase: data.company?.catchPhrase || '',
                    bs: data.company?.bs || '',
                }
            }

            await updateUser(updatedUser).unwrap()
            
            onClose()
            onSuccess?.()
        } catch (error) {
            console.error('Error updating user:', error)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!user) return null

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title={t.editUserTitle}
                size="wide"
                isDarkMode={isDarkMode}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    <UserIcon className="h-5 w-5 mr-2" />
                                    {t.basicInformation} <span className={`ml-1 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>({t.required})</span>
                                </h3>
                                
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {t.name} <span className={isDarkMode ? 'text-red-400' : 'text-red-500'}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('name')}
                                            className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                errors.name
                                                    ? isDarkMode
                                                        ? 'border-red-500 bg-gray-700 text-gray-100 focus:border-red-500'
                                                        : 'border-red-500 bg-white text-gray-900 focus:border-red-500'
                                                    : isDarkMode
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {t.username} <span className={isDarkMode ? 'text-red-400' : 'text-red-500'}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('username')}
                                            className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                errors.username
                                                    ? isDarkMode
                                                        ? 'border-red-500 bg-gray-700 text-gray-100 focus:border-red-500'
                                                        : 'border-red-500 bg-white text-gray-900 focus:border-red-500'
                                                    : isDarkMode
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        />
                                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {t.email} <span className={isDarkMode ? 'text-red-400' : 'text-red-500'}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            {...register('email')}
                                            className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                errors.email
                                                    ? isDarkMode
                                                        ? 'border-red-500 bg-gray-700 text-gray-100 focus:border-red-500'
                                                        : 'border-red-500 bg-white text-gray-900 focus:border-red-500'
                                                    : isDarkMode
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    <PhoneIcon className="h-5 w-5 mr-2" />
                                    {t.contactInformation} <span className={`ml-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({t.optional})</span>
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {t.phone}
                                        </label>
                                        <input
                                            type="text"
                                            {...register('phone')}
                                            className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                isDarkMode
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            <GlobeAltIcon className="h-4 w-4 mr-1 inline" />
                                            {t.website}
                                        </label>
                                        <input
                                            type="text"
                                            {...register('website')}
                                            className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                isDarkMode
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Address & Company */}
                        <div className="space-y-4">
                            {/* Address Information */}
                            <div>
                                <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    <MapPinIcon className="h-5 w-5 mr-2" />
                                    {t.address} <span className={`ml-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({t.optional})</span>
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                {t.street}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('address.street')}
                                                className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                    isDarkMode
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                {t.suite}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('address.suite')}
                                                className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                    isDarkMode
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                {t.city}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('address.city')}
                                                className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                    isDarkMode
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                {t.zipcode}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('address.zipcode')}
                                                className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                    isDarkMode
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                {t.latitude}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('address.geo.lat')}
                                                className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                    isDarkMode
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                {t.longitude}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('address.geo.lng')}
                                                className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                    isDarkMode
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Company Information */}
                            <div>
                                <h3 className={`text-lg font-semibold mb-3 flex items-center transition-colors duration-200 ${
                                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                                    {t.company} <span className={`ml-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({t.optional})</span>
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {t.companyName}
                                        </label>
                                        <input
                                            type="text"
                                            {...register('company.name')}
                                            className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                isDarkMode
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {t.catchPhrase}
                                        </label>
                                        <input
                                            type="text"
                                            {...register('company.catchPhrase')}
                                            className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                isDarkMode
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {t.businessStrategy}
                                        </label>
                                        <input
                                            type="text"
                                            {...register('company.bs')}
                                            className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                                                isDarkMode
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100 focus:border-blue-500'
                                                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className={`px-6 py-2 rounded-lg font-medium border transition-colors duration-200 ${
                                isDarkMode
                                    ? 'border-gray-500 text-gray-200 hover:bg-gray-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? t.updating : t.update}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}