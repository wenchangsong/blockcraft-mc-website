import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../context/LanguageContext.jsx'
import api from '../api/axios.js'

export default function HomePage() {
  const [news, setNews] = useState([])
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/news?limit=3').then((res) => setNews(res.data.data)).catch(() => {})
  }, [])

  const copyIP = () => {
    navigator.clipboard.writeText('play.blockcraft.example.com').then(() => {
      alert(t('copy.success'))
    }).catch(() => {})
  }

  return (
    <div>
      <section className="hero">
        <h1>⛏ {t('home.hero.title')}</h1>
        <p className="subtitle">{t('home.hero.subtitle')}</p>
        <div className="server-ip" onClick={copyIP} title="Click to copy">
          ⛓ play.blockcraft.example.com
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--mc-light-gray)', marginTop: '0.5rem' }}>
          {t('home.hero.version')}
        </p>
      </section>

      <section className="mb-2">
        <h2 className="section-title">{t('home.features.title')}</h2>
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🛡</div>
            <h3>{t('home.features.grief.title')}</h3>
            <p>{t('home.features.grief.desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>{t('home.features.economy.title')}</h3>
            <p>{t('home.features.economy.desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺</div>
            <h3>{t('home.features.world.title')}</h3>
            <p>{t('home.features.world.desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚔</div>
            <h3>{t('home.features.community.title')}</h3>
            <p>{t('home.features.community.desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>{t('home.features.uptime.title')}</h3>
            <p>{t('home.features.uptime.desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎉</div>
            <h3>{t('home.features.events.title')}</h3>
            <p>{t('home.features.events.desc')}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex-between mb-1">
          <h2 className="section-title">{t('home.news.title')}</h2>
          <Link to="/news" className="mc-btn small diamond">{t('home.news.viewAll')}</Link>
        </div>
        {news.length === 0 ? (
          <p style={{ color: 'var(--mc-light-gray)' }}>{t('home.news.empty')}</p>
        ) : (
          <div className="news-grid">
            {news.map((article) => (
              <div
                key={article.id}
                className="news-card clickable"
                onClick={() => navigate(`/news/${article.id}`)}
              >
                <div className="meta">
                  {article.author_username} · {new Date(article.created_at).toLocaleDateString()}
                </div>
                <h3>{article.title}</h3>
                <p className="excerpt">{article.excerpt}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
