import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useTranslation()

  if (!user) return null

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
    </div>
  )
}
