import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function CategoryPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    api.get(`/api/forum/categories/${id}/topics?page=${page}&limit=20`)
      .then((res) => {
        setCategory(res.data.category)
        setTopics(res.data.data)
        setTotalPages(res.data.totalPages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, page])

  if (loading) return <LoadingSpinner />
  if (!category) return null

  return (
    <div>
      <Link to="/forum" style={{ fontSize: '0.8rem' }}>&larr; {t('category.back')}</Link>

      <div className="topics-header mt-1">
        <h2>{category.name}</h2>
        {isAuthenticated && (
          <Link to={`/forum/new-topic/${category.id}`} className="mc-btn primary">{t('category.newTopic')}</Link>
        )}
      </div>

      {topics.length === 0 ? (
        <p style={{ color: 'var(--mc-light-gray)' }}>{t('category.empty')}</p>
      ) : (
        <div className="topic-list">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="topic-item clickable"
              onClick={() => navigate(`/forum/t/${topic.id}`)}
            >
              <div className="topic-main">
                <h4>{topic.title}</h4>
                <span className="topic-meta">
                  {t('category.by')} {topic.author_username} · {new Date(topic.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="topic-stats">
                <strong>{topic.post_count}</strong> {t('category.replies')}
                {topic.last_post_at && (
                  <div style={{ fontSize: '0.65rem' }}>{t('category.last')} {new Date(topic.last_post_at).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>{t('category.prev')}</button>
          <span className="page-info">{t('category.page', { page, total: totalPages })}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>{t('category.next')}</button>
        </div>
      )}
    </div>
  )
}
