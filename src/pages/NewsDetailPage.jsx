import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import DOMPurify from 'dompurify'
import api from '../api/axios.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function NewsDetailPage() {
  const { id } = useParams()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/news/${id}`)
      .then((res) => setArticle(res.data.data))
      .catch(() => navigate('/news'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    if (!confirm(t('news.detail.deleteConfirm'))) return
    try {
      await api.delete(`/api/news/${id}`)
      navigate('/news')
    } catch {
      alert(t('news.detail.deleteFailed'))
    }
  }

  const sanitizedContent = useMemo(() => DOMPurify.sanitize(article?.content || '', {
    ALLOWED_TAGS: ['b', 'i', 'u', 's', 'strong', 'em', 'h2', 'h3', 'p', 'br', 'img', 'font', 'div', 'span'],
    ALLOWED_ATTR: ['size', 'color', 'src', 'alt'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'meta', 'style'],
  }), [article])

  if (loading) return <LoadingSpinner />
  if (!article) return null

  return (
    <div className="news-detail">
      <Link to="/news" style={{ fontSize: '0.8rem' }}>&larr; {t('news.detail.back')}</Link>

      <div className="mc-container mt-1">
        <h1 style={{ fontSize: '1.3rem' }}>{article.title}</h1>
        <div className="meta">
          {t('news.detail.by')} {article.author_username} · {new Date(article.created_at).toLocaleDateString()}
          {article.updated_at !== article.created_at && (
            <> ({t('news.detail.updated')} {new Date(article.updated_at).toLocaleDateString()})</>
          )}
        </div>
        {article.image_url && (
          <div className="article-image mb-1">
            <img src={article.image_url} alt={article.title} />
          </div>
        )}
        <div className="content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

        {isAdmin && (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <Link to={`/news/${id}/edit`} className="mc-btn">{t('news.detail.edit')}</Link>
            <button className="mc-btn danger" onClick={handleDelete}>{t('news.detail.delete')}</button>
          </div>
        )}
      </div>
    </div>
  )
}
