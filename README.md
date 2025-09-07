# DaVinci Project - User & Post Management System

A modern, responsive React application built with TypeScript and Vite for managing users and posts. This project features a clean UI with dark/light mode support and bilingual (Turkish/English) interface.

## 🚀 Live Demo

https://davinci-dun.vercel.app

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mustafaakagunduz/davinci.git
   cd davinci
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## ✨ Features

### Core Functionality
- **User Management**: Complete CRUD operations for users
- **Post Management**: Complete CRUD operations for posts  
- **Data Relationships**: Visual connection between users and their posts
- **Real-time Search**: Filter users by name, username, or email
- **Post Filtering**: Search posts by title

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Bilingual Support**: Switch between Turkish and English languages
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Interactive Tables**: Click-to-view details with context menu support
- **Context Menu**: Right-click or long-press for quick actions (View/Edit/Delete)
- **Modal System**: User-friendly forms and confirmations
- **Toast Notifications**: Success and error feedback
- **Pagination**: Efficient data browsing with 10 items per page

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **State Management**: Redux Toolkit with RTK Query for efficient API calls
- **Form Validation**: Zod schema validation with React Hook Form
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Error Handling**: Comprehensive error states and user feedback
- **Accessibility**: Keyboard navigation and screen reader support

## 🖱️ Interaction Features

### Table Interactions
- **Left Click**: Opens detailed view modal
- **Right Click**: Opens context menu with quick actions
- **Quick Actions**: Access View, Edit, and Delete without opening modals first

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### State Management & Data Fetching
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### UI Components & Icons
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Toast notifications
- **Custom Modal System** - Reusable modal components

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### Build for Production

```bash
# Build the project
npm run build
# or
yarn build

# Preview the production build
npm run preview
# or
yarn preview
```

## 🎯 Usage Guide

### Navigation
- Use the **Users** and **Posts** tabs to switch between different views
- Toggle **theme** with the sun/moon icon in the header
- Switch **language** using the EN/TR button

### User Management
- **View Users**: Browse the user list with pagination
- **Search Users**: Use the search bar to filter by name, username, or email  
- **Add User**: Click "Add New User" button and fill the comprehensive form
- **Quick Actions**: Right-click on any user row or long-press (touchpad) for context menu
- **Edit User**: Use context menu or detail modal's edit button
- **Delete User**: Use context menu and confirm deletion
- **View Details**: Left-click on any user row for detailed information

### Post Management  
- **View Posts**: Browse posts with user relationship information
- **Search Posts**: Filter posts by title using the search bar
- **Add Post**: Click "Add New Post", select a user, and create content
- **Quick Actions**: Right-click on any post row or long-press (touchpad) for context menu
- **Edit Post**: Use context menu to modify existing posts
- **Delete Post**: Use context menu and confirm deletion
- **View Details**: Left-click on any post row for full content view

### Data Relationships
- User table shows **post count** for each user
- Post table displays **userId** showing the relationship
- When creating posts, select from existing users

## 🌐 API Integration

The application integrates with [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API:

- **GET** `/users` - Fetch all users
- **GET** `/users/{id}` - Fetch specific user
- **POST** `/users` - Create new user
- **PUT** `/users/{id}` - Update user
- **DELETE** `/users/{id}` - Delete user
- **GET** `/posts` - Fetch all posts  
- **GET** `/posts/{id}` - Fetch specific post
- **GET** `/posts?userId={userId}` - Fetch user's posts
- **POST** `/posts` - Create new post
- **PUT** `/posts/{id}` - Update post
- **DELETE** `/posts/{id}` - Delete post

## 🧪 Code Quality

### ESLint Configuration
The project uses strict ESLint rules for code quality:
```bash
npm run lint
```

### Type Safety
Full TypeScript coverage with strict mode enabled for maximum type safety.

### Form Validation
Zod schemas ensure data integrity with user-friendly error messages.

## 🚀 Performance Optimizations

- **Optimistic Updates**: Immediate UI feedback using RTK Query
- **Efficient Re-renders**: Proper state management and dependencies
- **Event Optimization**: Smart event handling for context menus