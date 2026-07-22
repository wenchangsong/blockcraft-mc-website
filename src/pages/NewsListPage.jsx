import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function NewsListPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { isAdmin } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    api.get(`/api/news?page=${page}&limit=10`)
      .then((res) => {
        setArticles(res.data.data)
        setTotalPages(res.data.totalPages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm(t('news.list.deleteConfirm'))) return
    try {
      await api.delete(`/api/news/${id}`)
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } catch {
      alert(t('news.list.deleteFailed'))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="action-bar">
        <h2>{t('news.list.title')}</h2>
        {isAdmin && (
          <Link to="/news/create" className="mc-btn primary">{t('news.list.create')}</Link>
        )}
      </div>

      {articles.length === 0 ? (
        <p style={{ color: 'var(--mc-light-gray)' }}>{t('news.list.empty')}</p>
      ) : (
        <div className="news-grid">
          {articles.map((article) => (
            <div
              key={article.id}
              className="news-card clickable"
              onClick={() => navigate(`/news/${article.id}`)}
            >
              <div className="meta">
                {article.author_username} · {new Date(article.created_at).toLocaleDateString()}
              </div>
              <h3>{article.title}</h3>
              <p className="excerpt">{article.excerpt}</p>
              {isAdmin && (
                <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                  <Link to={`/news/${article.id}/edit`} className="mc-btn small">{t('news.list.edit')}</Link>
                  <button className="mc-btn small danger" onClick={(e) => handleDelete(e, article.id)}>{t('news.list.delete')}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>{t('news.list.prev')}</button>
          <span className="page-info">{t('news.list.page', { page, total: totalPages })}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>{t('news.list.next')}</button>
        </div>
      )}
    </div>
  )
}
