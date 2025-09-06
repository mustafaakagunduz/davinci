import { createContext, useContext, type ReactNode } from 'react'
import { tr, en } from '../locales'

export type Language = 'TR' | 'EN'

export interface Translations {
    title: string
    users: string
    posts: string
    usersList: string
    postsList: string
    addNewUser: string
    addNewPost: string
    loadingUsers: string
    loadingPosts: string
    errorLoadingUsers: string
    errorLoadingPosts: string
    noUsersFound: string
    noPostsFound: string
    noUsersMatching: string
    noPostsMatching: string
    searchUsersPlaceholder: string
    searchPostsPlaceholder: string
    id: string
    name: string
    username: string
    email: string
    postCount: string
    userId: string
    title_field: string
    actions: string
    userDetails: string
    basicInformation: string
    contactInformation: string
    addressInformation: string
    companyInformation: string
    phone: string
    website: string
    street: string
    suite: string
    city: string
    zipcode: string
    coordinates: string
    latitude: string
    longitude: string
    companyName: string
    catchPhrase: string
    businessStrategy: string
    close: string
    edit: string
    delete: string
    postDetails: string
    postContentLabel: string
    content: string
    author: string
    authorDetails: string
    confirmDelete: string
    deleteConfirmation: string
    cancel: string
    confirm: string
    deleteSuccess: string
    deleteError: string
    deleting: string
    deleteUserConfirmation: string
    userDeleteSuccess: string
    userDeleteError: string
    addUser: string
    addUserTitle: string
    userAddSuccess: string
    userAddError: string
    editUserTitle: string
    userUpdateSuccess: string
    userUpdateError: string
    save: string
    required: string
    nameRequired: string
    usernameRequired: string
    emailRequired: string
    invalidEmail: string
    optional: string
    address: string
    company: string
    saving: string
    addPost: string
    addPostTitle: string
    postAddSuccess: string
    postAddError: string
    selectUser: string
    userRequired: string
    titleRequired: string
    contentRequired: string
    postTitle: string
    postContent: string
    enterPostTitle: string
    writePostContent: string
    searchUsers: string
    editPost: string
    postUpdateSuccess: string
    postUpdateError: string
    updating: string
    update: string
}

const translations: Record<Language, Translations> = {
    TR: tr,
    EN: en
}

interface LanguageContextType {
    language: Language
    setLanguage: (language: Language) => void
    t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
    children: ReactNode
    language: Language
    setLanguage: (language: Language) => void
}

export const LanguageProvider = ({ children, language, setLanguage }: LanguageProviderProps) => {
    const t = translations[language]

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}