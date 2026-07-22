import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'
import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import RichTextEditor from '../components/RichTextEditor.jsx'

export default function NewsEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [editorReady, setEditorReady] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const editorRef = useRef(null)
  const savedContentRef = useRef('')

  useEffect(() => {
    api.get(`/api/news/${id}`)
      .then((res) => {
        setTitle(res.data.data.title)
        setImageUrl(res.data.data.image_url || '')
        savedContentRef.current = res.data.data.content || ''
        setEditorReady(true)
      })
      .catch(() => navigate('/news'))
      .finally(() => setLoading(false))
  }, [id, navigate])

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
    const content = editorRef.current?.getHTML()
    if (!content || content === '<br>' || content === '<br />') {
      setError('Content is required')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await api.put(`/api/news/${id}`, { title, content, image_url: imageUrl || null })
      navigate(`/news/${id}`)
    } catch (err) {
      setError(err.response?.data?.error || t('news.edit.error'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h2>{t('news.edit.title')}</h2>
      <div className="mc-container mt-1">
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <div className="mc-form-group">
            <label className="mc-label">{t('news.edit.titleLabel')}</label>
            <input type="text" className="mc-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('news.edit.contentLabel')}</label>
            {editorReady && <RichTextEditor ref={editorRef} initialValue={savedContentRef.current} />}
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('image.upload')} ({t('news.edit.titleLabel')} cover)</label>
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
              {submitting ? t('news.edit.submitting') : t('news.edit.submit')}
            </button>
            <button type="button" className="mc-btn" onClick={() => navigate(`/news/${id}`)}>{t('news.edit.cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
