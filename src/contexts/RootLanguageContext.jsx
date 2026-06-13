import React, { createContext, useContext, useEffect, useState } from 'react'

const LANGUAGE_STORAGE_KEY = 'todayler_root_language'

const RootLanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
})

function readStoredLanguage() {
  if (typeof window === 'undefined') {
    return null
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return storedLanguage === 'el' || storedLanguage === 'en' ? storedLanguage : null
}

async function readGeoLanguage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const response = await window.fetch('/api/geo', { credentials: 'same-origin' })
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data?.country === 'GR' || data?.language === 'el' ? 'el' : 'en'
  } catch {
    return null
  }
}

export function RootLanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => readStoredLanguage() ?? 'en')

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    if (readStoredLanguage()) {
      return undefined
    }

    let cancelled = false

    readGeoLanguage().then((resolvedLanguage) => {
      if (cancelled || !resolvedLanguage) {
        return
      }

      setLanguageState((currentLanguage) => (currentLanguage === resolvedLanguage ? currentLanguage : resolvedLanguage))
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage)
  }

  const toggleLanguage = () => {
    setLanguageState((currentLanguage) => (currentLanguage === 'en' ? 'el' : 'en'))
  }

  return (
    <RootLanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </RootLanguageContext.Provider>
  )
}

export function useRootLanguage() {
  return useContext(RootLanguageContext)
}
