import { createContext, useContext, ReactNode } from 'react'

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
    postContent: string
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
    TR: {
        title: 'Kullanıcı & Gönderi Görüntüleyici',
        users: 'Kullanıcılar',
        posts: 'Gönderiler',
        usersList: 'Kullanıcı Listesi',
        postsList: 'Gönderi Listesi',
        addNewUser: 'Yeni Kullanıcı Ekle',
        addNewPost: 'Yeni Gönderi Ekle',
        loadingUsers: 'Kullanıcılar yükleniyor...',
        loadingPosts: 'Gönderiler yükleniyor...',
        errorLoadingUsers: 'Kullanıcılar yüklenirken hata oluştu',
        errorLoadingPosts: 'Gönderiler yüklenirken hata oluştu',
        noUsersFound: 'Kullanıcı bulunamadı',
        noPostsFound: 'Gönderi bulunamadı',
        noUsersMatching: 'eşleşen kullanıcı bulunamadı',
        noPostsMatching: 'eşleşen gönderi bulunamadı',
        searchUsersPlaceholder: 'İsim, kullanıcı adı veya e-posta ile ara...',
        searchPostsPlaceholder: 'Başlık ile ara...',
        id: 'ID',
        name: 'İsim',
        username: 'Kullanıcı Adı',
        email: 'E-posta',
        postCount: 'Gönderi Sayısı',
        userId: 'Kullanıcı ID',
        title_field: 'Başlık',
        actions: 'İşlemler',
        userDetails: 'Kullanıcı Detayları',
        basicInformation: 'Temel Bilgiler',
        contactInformation: 'İletişim Bilgileri',
        addressInformation: 'Adres Bilgileri',
        companyInformation: 'Şirket Bilgileri',
        phone: 'Telefon',
        website: 'Web Sitesi',
        street: 'Sokak',
        suite: 'Apartman/Daire',
        city: 'Şehir',
        zipcode: 'Posta Kodu',
        coordinates: 'Koordinatlar',
        latitude: 'Enlem',
        longitude: 'Boylam',
        companyName: 'Şirket Adı',
        catchPhrase: 'Slogan',
        businessStrategy: 'İş Stratejisi',
        close: 'Kapat',
        edit: 'Düzenle',
        delete: 'Sil',
        postDetails: 'Gönderi Detayları',
        postContent: 'Gönderi İçeriği',
        content: 'İçerik',
        author: 'Yazar',
        authorDetails: 'Yazar Bilgileri',
        confirmDelete: 'Silmeyi Onayla',
        deleteConfirmation: 'Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
        cancel: 'İptal',
        confirm: 'Onayla',
        deleteSuccess: 'Gönderi başarıyla silindi!',
        deleteError: 'Gönderi silinirken hata oluştu!',
        deleting: 'Siliniyor...',
        deleteUserConfirmation: 'Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
        userDeleteSuccess: 'Kullanıcı başarıyla silindi!',
        userDeleteError: 'Kullanıcı silinirken hata oluştu!',
        addUser: 'Yeni Kullanıcı Ekle',
        addUserTitle: 'Kullanıcı Ekle',
        userAddSuccess: 'Kullanıcı başarıyla eklendi!',
        userAddError: 'Kullanıcı eklenirken hata oluştu!',
        save: 'Kaydet',
        required: 'zorunlu',
        nameRequired: 'İsim gerekli',
        usernameRequired: 'Kullanıcı adı gerekli',
        emailRequired: 'E-posta gerekli',
        invalidEmail: 'Geçerli bir e-posta adresi girin',
        optional: 'opsiyonel',
        address: 'Adres',
        company: 'Şirket',
        saving: 'Kaydediliyor...',
        addPost: 'Yeni Gönderi Ekle',
        addPostTitle: 'Gönderi Ekle',
        postAddSuccess: 'Gönderi başarıyla eklendi!',
        postAddError: 'Gönderi eklenirken hata oluştu!',
        selectUser: 'Kullanıcı Seçin',
        userRequired: 'Kullanıcı seçimi gerekli',
        titleRequired: 'Başlık gerekli',
        contentRequired: 'İçerik gerekli',
        postTitle: 'Başlık',
        postContent: 'İçerik',
        enterPostTitle: 'Gönderi başlığını girin...',
        writePostContent: 'Gönderi içeriğinizi buraya yazın...',
        searchUsers: 'Kullanıcı ara...',
        editPost: 'Gönderiyi Düzenle',
        postUpdateSuccess: 'Gönderi başarıyla güncellendi!',
        postUpdateError: 'Gönderi güncellenirken hata oluştu!',
        updating: 'Güncelleniyor...',
        update: 'Güncelle'
    },
    EN: {
        title: 'User & Post Viewer',
        users: 'Users',
        posts: 'Posts',
        usersList: 'Users List',
        postsList: 'Posts List',
        addNewUser: 'Add New User',
        addNewPost: 'Add New Post',
        loadingUsers: 'Loading users...',
        loadingPosts: 'Loading posts...',
        errorLoadingUsers: 'Error loading users',
        errorLoadingPosts: 'Error loading posts',
        noUsersFound: 'No users found',
        noPostsFound: 'No posts found',
        noUsersMatching: 'No users found matching',
        noPostsMatching: 'No posts found matching',
        searchUsersPlaceholder: 'Search users by name, username or email...',
        searchPostsPlaceholder: 'Search posts by title...',
        id: 'ID',
        name: 'Name',
        username: 'Username',
        email: 'Email',
        postCount: 'Post Count',
        userId: 'User ID',
        title_field: 'Title',
        actions: 'Actions',
        userDetails: 'User Details',
        basicInformation: 'Basic Information',
        contactInformation: 'Contact Information',
        addressInformation: 'Address Information',
        companyInformation: 'Company Information',
        phone: 'Phone',
        website: 'Website',
        street: 'Street',
        suite: 'Suite',
        city: 'City',
        zipcode: 'Zipcode',
        coordinates: 'Coordinates',
        latitude: 'Latitude',
        longitude: 'Longitude',
        companyName: 'Company Name',
        catchPhrase: 'Catch Phrase',
        businessStrategy: 'Business Strategy',
        close: 'Close',
        edit: 'Edit',
        delete: 'Delete',
        postDetails: 'Post Details',
        postContent: 'Post Content',
        content: 'Content',
        author: 'Author',
        authorDetails: 'Author Details',
        confirmDelete: 'Confirm Delete',
        deleteConfirmation: 'Are you sure you want to delete this post? This action cannot be undone.',
        cancel: 'Cancel',
        confirm: 'Confirm',
        deleteSuccess: 'Post deleted successfully!',
        deleteError: 'Error deleting post!',
        deleting: 'Deleting...',
        deleteUserConfirmation: 'Are you sure you want to delete this user? This action cannot be undone.',
        userDeleteSuccess: 'User deleted successfully!',
        userDeleteError: 'Error deleting user!',
        addUser: 'Add New User',
        addUserTitle: 'Add User',
        userAddSuccess: 'User added successfully!',
        userAddError: 'Error adding user!',
        save: 'Save',
        required: 'required',
        nameRequired: 'Name is required',
        usernameRequired: 'Username is required',
        emailRequired: 'Email is required',
        invalidEmail: 'Please enter a valid email address',
        optional: 'optional',
        address: 'Address',
        company: 'Company',
        saving: 'Saving...',
        addPost: 'Add New Post',
        addPostTitle: 'Add Post',
        postAddSuccess: 'Post added successfully!',
        postAddError: 'Error adding post!',
        selectUser: 'Select User',
        userRequired: 'User selection is required',
        titleRequired: 'Title is required',
        contentRequired: 'Content is required',
        postTitle: 'Title',
        postContent: 'Content',
        enterPostTitle: 'Enter post title...',
        writePostContent: 'Write your post content here...',
        searchUsers: 'Search users...',
        editPost: 'Edit Post',
        postUpdateSuccess: 'Post updated successfully!',
        postUpdateError: 'Error updating post!',
        updating: 'Updating...',
        update: 'Update'
    }
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

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}