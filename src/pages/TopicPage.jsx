import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function TopicPage() {
  const { id } = useParams()
  const { user, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [topic, setTopic] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [replyContent, setReplyContent] = useState('')
  const [replyImageUrl, setReplyImageUrl] = useState('')
  const [replyUploading, setReplyUploading] = useState(false)
  const [replyError, setReplyError] = useState('')
  const [replySubmitting, setReplySubmitting] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [editContent, setEditContent] = useState('')

  const fetchPosts = useCallback(() => {
    api.get(`/api/forum/topics/${id}/posts?page=${page}&limit=20`)
      .then((res) => {
        setPosts(res.data.data)
        setTotalPages(res.data.totalPages)
      })
      .catch(() => {})
  }, [id, page])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/api/forum/topics/${id}`),
      api.get(`/api/forum/topics/${id}/posts?page=${page}&limit=20`),
    ])
      .then(([topicRes, postsRes]) => {
        setTopic(topicRes.data.data)
        setPosts(postsRes.data.data)
        setTotalPages(postsRes.data.totalPages)
      })
      .catch(() => navigate('/forum'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  useEffect(() => {
    if (topic) fetchPosts()
  }, [page])

  const handleReplyImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setReplyUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setReplyImageUrl(res.data.data.url)
    } catch {
      setReplyError('Image upload failed')
    } finally {
      setReplyUploading(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    setReplyError('')
    setReplySubmitting(true)
    try {
      await api.post(`/api/forum/topics/${id}/posts`, {
        content: replyContent,
        image_url: replyImageUrl || null,
      })
      setReplyContent('')
      setReplyImageUrl('')
      fetchPosts()
    } catch (err) {
      setReplyError(err.response?.data?.error || t('topic.reply.error'))
    } finally {
      setReplySubmitting(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/api/forum/posts/${postId}/like`)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, liked_by_user: res.data.data.liked, likes_count: res.data.data.likes_count } : p
        )
      )
    } catch {}
  }

  const handleEdit = async (postId) => {
    if (!editContent.trim()) return
    try {
      const res = await api.put(`/api/forum/posts/${postId}`, { content: editContent })
      setEditingPost(null)
      setEditContent('')
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...res.data.data } : p
        )
      )
    } catch {
      alert(t('topic.updateFailed'))
    }
  }

  const handleDelete = async (postId) => {
    if (!confirm(t('topic.deleteConfirm'))) return
    try {
      await api.delete(`/api/forum/posts/${postId}`)
      fetchPosts()
    } catch {
      alert(t('topic.deleteFailed'))
    }
  }

  const handleDeleteTopic = async () => {
    if (!confirm(t('topic.deleteTopicConfirm'))) return
    try {
      await api.delete(`/api/forum/topics/${id}`)
      navigate(`/forum/c/${topic.category_id}`)
    } catch {
      alert(t('topic.deleteTopicFailed'))
    }
  }

  const canDeletePost = (post) => {
    if (!user) return false
    return isAdmin || user.id === post.author_id
  }

  const canEditPost = (post) => {
    if (!user) return false
    return user.id === post.author_id
  }

  const getFloor = (index) => (page - 1) * 20 + index + 1

  if (loading) return <LoadingSpinner />
  if (!topic) return null

  return (
    <div>
      <Link to={`/forum/c/${topic.category_id}`} style={{ fontSize: '0.8rem' }}>
        &larr; {t('topic.back', { category: topic.category_name })}
      </Link>

      <div className="mt-1 mb-1 flex-between">
        <h2 style={{ margin: 0 }}>{topic.title}</h2>
        {isAdmin && (
          <button className="mc-btn small danger" onClick={handleDeleteTopic}>{t('topic.deleteTopic')}</button>
        )}
      </div>
      <p style={{ color: 'var(--mc-light-gray)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        {t('topic.postedBy')} {topic.author_username} · {new Date(topic.created_at).toLocaleDateString()}
      </p>

      {posts.map((post, idx) => (
        <div key={post.id} className="post">
          <div className="post-header">
            <div className="post-author">
              <span className="floor-badge">{t('floor', { num: getFloor(idx) })}</span>
              <div className="post-avatar">{post.author_username[0].toUpperCase()}</div>
              <div>
                <strong>{post.author_username}</strong>
                {post.author_role === 'admin' && <span className="admin-badge">ADMIN</span>}
              </div>
            </div>
            <span className="post-date">
              {post.updated_at !== post.created_at ? t('topic.edited') + ' ' : ''}
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>

          {editingPost === post.id ? (
            <div>
              <textarea
                className="mc-input mc-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="post-actions">
                <button className="mc-btn small primary" onClick={() => handleEdit(post.id)}>{t('topic.editSave')}</button>
                <button className="mc-btn small" onClick={() => { setEditingPost(null); setEditContent(''); }}>{t('topic.editCancel')}</button>
              </div>
            </div>
          ) : (
            <>
              <div className="post-content">{post.content}</div>
              {post.image_url && (
                <div className="post-image mt-1">
                  <img src={post.image_url} alt="Attached" />
                </div>
              )}
              <div className="post-actions">
                <button
                  className={`like-btn ${post.liked_by_user ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                  title={post.liked_by_user ? t('unlike') : t('like')}
                  disabled={!isAuthenticated}
                >
                  {post.liked_by_user ? '❤' : '♡'} <span>{post.likes_count || 0}</span>
                </button>
                {canEditPost(post) && (
                  <button className="mc-btn small" onClick={() => { setEditingPost(post.id); setEditContent(post.content); }}>
                    {t('topic.edit')}
                  </button>
                )}
                {canDeletePost(post) && (
                  <button className="mc-btn small danger" onClick={() => handleDelete(post.id)}>{t('topic.delete')}</button>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>{t('topic.prev')}</button>
          <span className="page-info">{t('topic.page', { page, total: totalPages })}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>{t('topic.next')}</button>
        </div>
      )}

      {isAuthenticated ? (
        <div className="reply-form">
          <h3>{t('topic.reply.title')}</h3>
          <ErrorMessage message={replyError} />
          <form onSubmit={handleReply}>
            <textarea
              className="mc-input mc-textarea mb-1"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t('topic.reply.placeholder')}
              required
            />
            <div className="mc-form-group">
              <label className="mc-label">{t('image.upload')}</label>
              <input type="file" className="mc-input" accept="image/*" onChange={handleReplyImage} />
              {replyUploading && <p style={{ color: 'var(--mc-diamond)', fontSize: '0.8rem', marginTop: '0.3rem' }}>Uploading...</p>}
              {replyImageUrl && (
                <div className="image-preview mt-1">
                  <img src={replyImageUrl} alt="Preview" />
                  <button type="button" className="mc-btn small danger" onClick={() => setReplyImageUrl('')}>{t('image.remove')}</button>
                </div>
              )}
            </div>
            <button type="submit" className="mc-btn primary" disabled={replySubmitting}>
              {replySubmitting ? t('topic.reply.submitting') : t('topic.reply.submit')}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--mc-light-gray)' }}>
            <Link to="/login">{t('topic.loginToReply')}</Link>{t('topic.loginToReplyText')}
          </p>
        </div>
      )}
    </div>
  )
}
