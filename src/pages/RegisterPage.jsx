import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captchaQuestion, setCaptchaQuestion] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const fetchCaptcha = async () => {
    try {
      const res = await api.get('/api/auth/captcha')
      setCaptchaQuestion(res.data.data.question)
      setCaptchaToken(res.data.data.token)
      setCaptchaAnswer('')
    } catch {
      setCaptchaQuestion('? + ? = ?')
    }
  }

  useEffect(() => { fetchCaptcha() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError(t('register.error.mismatch'))
      return
    }
    if (username.length < 3) {
      setError(t('register.error.usernameLength'))
      return
    }
    if (password.length < 6) {
      setError(t('register.error.passwordLength'))
      return
    }
    if (!captchaAnswer) {
      setError('Please answer the math question')
      return
    }

    setSubmitting(true)
    try {
      await register(username, email, password, captchaToken, captchaAnswer)
      setSuccess(t('register.success'))
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      fetchCaptcha()
      setError(err.response?.data?.error || t('register.error.default'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="mc-container">
        <h2>{t('register.title')}</h2>
        <ErrorMessage message={error} />
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mc-form-group">
            <label className="mc-label">{t('register.username')}</label>
            <input
              type="text"
              className="mc-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('register.email')}</label>
            <input
              type="email"
              className="mc-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('register.password')}</label>
            <input
              type="password"
              className="mc-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <div className="mc-form-group">
            <label className="mc-label">Math CAPTCHA</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.8rem',
                color: 'var(--mc-gold)',
                background: 'var(--mc-black)',
                border: '3px solid var(--mc-gray)',
                padding: '0.5rem 1rem',
                letterSpacing: '2px',
                whiteSpace: 'nowrap',
              }}>
                {captchaQuestion}
              </span>
              <button type="button" className="mc-btn small" onClick={fetchCaptcha} style={{ flexShrink: 0 }}>
                ↻
              </button>
            </div>
            <input
              type="number"
              className="mc-input mt-1"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder="Enter the answer"
              style={{ width: '120px' }}
              required
            />
          </div>
          <button type="submit" className="mc-btn primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? t('register.submitting') : t('register.submit')}
          </button>
        </form>
        <p className="auth-footer">
          {t('register.hasAccount')} <Link to="/login">{t('register.loginLink')}</Link>
        </p>
      </div>
    </div>
  )
}
