import { Link } from 'react-router-dom'
import { useTranslation } from '../context/LanguageContext.jsx'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="not-found">
      <div className="icon">🧟</div>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.message')}</p>
      <Link to="/" className="mc-btn primary">{t('notFound.button')}</Link>
    </div>
  )
}
