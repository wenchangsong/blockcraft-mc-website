import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwSubmitting, setPwSubmitting] = useState(false)

  if (!user) return null

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

      <div className="mc-container profile-card mt-1">
        <div className="info-row">
          <span className="info-label">{t('profile.username')}</span>
          <span className="info-value">{user.username}</span>
        </div>
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

      <div className="mc-container profile-card mt-2">
        <h3 style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>{t('profile.changePassword')}</h3>
        <ErrorMessage message={pwError} />
        {pwSuccess && <div className="success-message">{pwSuccess}</div>}
        <form onSubmit={handleChangePassword}>
          <div className="mc-form-group">
            <label className="mc-label">{t('profile.currentPassword')}</label>
            <input
              type="password"
              className="mc-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('profile.newPassword')}</label>
            <input
              type="password"
              className="mc-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('register.confirmPassword')}</label>
            <input
              type="password"
              className="mc-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="mc-btn primary" disabled={pwSubmitting}>
            {pwSubmitting ? '...' : t('profile.changePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}
