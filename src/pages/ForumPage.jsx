import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function ForumPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    api.get('/api/forum/categories')
      .then((res) => setCategories(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm(t('forum.deleteConfirm'))) return
    try {
      await api.delete(`/api/forum/categories/${id}`)
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch {
      alert(t('forum.deleteFailed'))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h2>{t('forum.title')}</h2>
      <div className="category-list mt-1">
        {categories.map((cat) => (
          <div key={cat.id} className="category-item">
            <div className="category-info">
              <h3><Link to={`/forum/c/${cat.id}`}>{cat.name}</Link></h3>
              <p>{cat.description}</p>
            </div>
            <div className="category-stats">
              <strong>{cat.topic_count}</strong> {t('forum.topics')}
            </div>
            {isAdmin && (
              <button className="mc-btn small danger" onClick={() => handleDelete(cat.id)}>{t('forum.delete')}</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
