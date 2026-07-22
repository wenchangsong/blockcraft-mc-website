import { useTranslation } from '../context/LanguageContext.jsx'

export default function LoadingSpinner() {
  const { t } = useTranslation()
  return <div className="loading-spinner">{t('loading')}</div>
}
