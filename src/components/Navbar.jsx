import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { lang, toggleLang, t } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          ⛏ {t('brand.name')}
        </Link>
        <ul className="navbar-links">
          <li><Link to="/">{t('nav.home')}</Link></li>
          <li><Link to="/news">{t('nav.news')}</Link></li>
          <li><Link to="/forum">{t('nav.forum')}</Link></li>
        </ul>
        <div className="navbar-user">
          <button
            className="mc-btn small"
            onClick={toggleLang}
            title="Switch Language"
            style={{ marginRight: '0.5rem' }}
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <span className="nav-avatar" style={{
                  backgroundImage: user.avatar_url ? `url(${user.avatar_url})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }}>
                  {!user.avatar_url && user.username[0].toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--mc-grass)' }}>
                  {user.username}
                  {isAdmin && <span className="admin-badge">ADMIN</span>}
                </span>
              </Link>
              <button className="mc-btn small" onClick={handleLogout}>{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="mc-btn small primary">{t('nav.login')}</button></Link>
              <Link to="/register"><button className="mc-btn small diamond">{t('nav.register')}</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
