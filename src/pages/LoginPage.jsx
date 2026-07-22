import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || t('login.error.default'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="mc-container">
        <h2>{t('login.title')}</h2>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <div className="mc-form-group">
            <label className="mc-label">{t('login.email')}</label>
            <input
              type="email"
              className="mc-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mc-form-group">
            <label className="mc-label">{t('login.password')}</label>
            <input
              type="password"
              className="mc-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="mc-btn primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? t('login.submitting') : t('login.submit')}
          </button>
        </form>
        <p className="auth-footer">
          {t('login.noAccount')} <Link to="/register">{t('login.registerLink')}</Link>
        </p>
      </div>
    </div>
  )
}
