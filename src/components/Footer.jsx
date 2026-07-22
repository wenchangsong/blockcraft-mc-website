import { useTranslation } from '../context/LanguageContext.jsx'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="footer">
      <p>{t('footer.copyright')}</p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>{t('footer.disclaimer')}</p>
    </footer>
  )
}
