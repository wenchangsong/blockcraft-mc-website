import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { t } = useTranslation()

  // Password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwSubmitting, setPwSubmitting] = useState(false)

  // Profile edit
  const [editUsername, setEditUsername] = useState(user?.username || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileSubmitting, setProfileSubmitting] = useState(false)

  if (!user) return null

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAvatarUrl(res.data.data.url)
    } catch {
      setProfileError(t('profile.avatarUploadFailed'))
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setProfileSubmitting(true)
    try {
      await updateProfile({ username: editUsername, avatar_url: avatarUrl || null })
      setProfileSuccess(t('profile.profileUpdated'))
    } catch (err) {
      setProfileError(err.response?.data?.error || t('profile.profileError'))
    } finally {
      setProfileSubmitting(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')

    if (newPassword !== confirmPassword) {
      setPwError(t('register.error.mismatch'))
      return
    }
    if (newPassword.length < 6) {
      setPwError(t('register.error.passwordLength'))
      return
    }

    setPwSubmitting(true)
    try {
      await api.put('/api/auth/password', { currentPassword, newPassword })
      setPwSuccess(t('profile.passwordChanged'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwError(err.response?.data?.error || t('profile.passwordError'))
    } finally {
      setPwSubmitting(false)
    }
  }

  return (
    <div>
      <h2>{t('profile.title')}</h2>

      {/* Avatar & basic info */}
      <div className="mc-container profile-card mt-1" style={{ textAlign: 'center' }}>
        <div className="post-avatar" style={{
          width: 80, height: 80, fontSize: '1.5rem', margin: '0 auto 1rem',
          backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}>
          {!avatarUrl && user.username[0].toUpperCase()}
        </div>

        <ErrorMessage message={profileError} />
        {profileSuccess && <div className="success-message">{profileSuccess}</div>}

        <form onSubmit={handleProfileUpdate}>
          <div className="mc-form-group">
            <label className="mc-label">{t('profile.avatar')}</label>
            <input type="file" className="mc-input" accept="image/*" onChange={handleAvatarUpload} />
            {avatarUploading && <p style={{ color: 'var(--mc-diamond)', fontSize: '0.75rem', marginTop: '0.3rem' }}>Uploading...</p>}
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('profile.username')}</label>
            <input type="text" className="mc-input" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} required />
          </div>
          <button type="submit" className="mc-btn primary" style={{ width: '100%' }} disabled={profileSubmitting}>
            {profileSubmitting ? '...' : t('profile.updateProfile')}
          </button>
        </form>

        <div className="info-row">
          <span className="info-label">{t('profile.email')}</span>
          <span className="info-value">{user.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">{t('profile.role')}</span>
          <span className="info-value">
            {user.role === 'admin' ? (
              <><span className="admin-badge">ADMIN</span> {t('profile.role.admin')}</>
            ) : t('profile.role.player')}
          </span>
        </div>
      </div>

      {/* Change password */}
      <div className="mc-container profile-card mt-2">
        <h3 style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>{t('profile.changePassword')}</h3>
        <ErrorMessage message={pwError} />
        {pwSuccess && <div className="success-message">{pwSuccess}</div>}
        <form onSubmit={handleChangePassword}>
          <div className="mc-form-group">
            <label className="mc-label">{t('profile.currentPassword')}</label>
            <input type="password" className="mc-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('profile.newPassword')}</label>
            <input type="password" className="mc-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('register.confirmPassword')}</label>
            <input type="password" className="mc-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="mc-btn primary" disabled={pwSubmitting}>
            {pwSubmitting ? '...' : t('profile.changePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}
