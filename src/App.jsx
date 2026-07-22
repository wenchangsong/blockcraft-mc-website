import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import NewsListPage from './pages/NewsListPage.jsx'
import NewsDetailPage from './pages/NewsDetailPage.jsx'
import NewsCreatePage from './pages/NewsCreatePage.jsx'
import NewsEditPage from './pages/NewsEditPage.jsx'
import ForumPage from './pages/ForumPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import TopicPage from './pages/TopicPage.jsx'
import CreateTopicPage from './pages/CreateTopicPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/news/create" element={<AdminRoute><NewsCreatePage /></AdminRoute>} />
          <Route path="/news/:id/edit" element={<AdminRoute><NewsEditPage /></AdminRoute>} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/c/:id" element={<CategoryPage />} />
          <Route path="/forum/t/:id" element={<TopicPage />} />
          <Route path="/forum/new-topic/:categoryId" element={<ProtectedRoute><CreateTopicPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
