import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function CreateTopicPage() {
  const { categoryId } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setImageUrl(res.data.data.url)
    } catch {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post(`/api/forum/categories/${categoryId}/topics`, {
        title,
        content,
        image_url: imageUrl || null,
      })
      navigate(`/forum/t/${res.data.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || t('createTopic.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>{t('createTopic.title')}</h2>
      <div className="mc-container mt-1">
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <div className="mc-form-group">
            <label className="mc-label">{t('createTopic.titleLabel')}</label>
            <input type="text" className="mc-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('createTopic.contentLabel')}</label>
            <textarea className="mc-input mc-textarea" value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('image.upload')}</label>
            <input type="file" className="mc-input" accept="image/*" onChange={handleImageUpload} />
            {uploading && <p style={{ color: 'var(--mc-diamond)', fontSize: '0.8rem', marginTop: '0.3rem' }}>Uploading...</p>}
            {imageUrl && (
              <div className="image-preview mt-1">
                <img src={imageUrl} alt="Preview" />
                <button type="button" className="mc-btn small danger" onClick={() => setImageUrl('')}>{t('image.remove')}</button>
              </div>
            )}
            {!imageUrl && !uploading && <p style={{ color: 'var(--mc-light-gray)', fontSize: '0.75rem', marginTop: '0.3rem' }}>{t('image.none')}</p>}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="mc-btn primary" disabled={submitting}>
              {submitting ? t('createTopic.submitting') : t('createTopic.submit')}
            </button>
            <button type="button" className="mc-btn" onClick={() => navigate(`/forum/c/${categoryId}`)}>{t('createTopic.cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
