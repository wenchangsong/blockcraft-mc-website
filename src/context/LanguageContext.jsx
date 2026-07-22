import { createContext, useContext, useState, useCallback } from 'react'
import translations from '../i18n/translations.js'

const LanguageContext = createContext(null)

const savedLang = localStorage.getItem('lang') || 'zh'
const defaultLang = ['en', 'zh'].includes(savedLang) ? savedLang : 'zh'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(defaultLang)

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'zh' ? 'en' : 'zh'
      localStorage.setItem('lang', next)
      return next
    })
  }, [])

  const t = useCallback((key, params) => {
    let text = translations[lang]?.[key] || translations.en?.[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v)
      })
    }
    return text
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider')
  return ctx
}
