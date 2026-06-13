import { useEffect, useRef, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import logoImage from './assets/todayler-logo.jpg'
import heroPhoneImage from './assets/antiheroimage.png'
import { getHeroActivitiesForAgeMonths } from './data/heroDailyActivities'
import { APP_STORE_URL } from './content'
import { useRootLanguage } from './contexts/RootLanguageContext.jsx'
import { getRootCopy, useRootCopy } from './rootCopy'

const HERO_AGE_MIN_MONTHS = 0
const HERO_AGE_MAX_MONTHS = 24
const HERO_DEFAULT_AGE_MONTHS = 15
const HERO_CARD_ROTATION_MS = 4200
const HERO_ACTIVITY_LABELS = {
  spark: 'think',
  move: 'move',
  play: 'bond',
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<LegalPage page="privacy" />} />
        <Route path="/terms" element={<LegalPage page="terms" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

function Meta({ title, description }) {
  const location = useLocation()

  useEffect(() => {
    document.title = title

    updateHeadTag('meta[name="description"]', {
      tag: 'meta',
      attributes: { name: 'description', content: description },
    })
    updateHeadTag('link[rel="canonical"]', {
      tag: 'link',
      attributes: {
        rel: 'canonical',
        href: `https://example.com${location.pathname}`,
      },
    })
    updateHeadTag('meta[property="og:title"]', {
      tag: 'meta',
      attributes: { property: 'og:title', content: title },
    })
    updateHeadTag('meta[property="og:description"]', {
      tag: 'meta',
      attributes: { property: 'og:description', content: description },
    })
    updateHeadTag('meta[property="og:type"]', {
      tag: 'meta',
      attributes: { property: 'og:type', content: 'website' },
    })
    updateHeadTag('meta[property="og:url"]', {
      tag: 'meta',
      attributes: {
        property: 'og:url',
        content: `https://example.com${location.pathname}`,
      },
    })
    updateHeadTag('meta[property="og:image"]', {
      tag: 'meta',
      attributes: { property: 'og:image', content: 'https://example.com/og-image.jpg' },
    })
    updateHeadTag('meta[name="twitter:card"]', {
      tag: 'meta',
      attributes: { name: 'twitter:card', content: 'summary_large_image' },
    })
    updateHeadTag('meta[name="twitter:title"]', {
      tag: 'meta',
      attributes: { name: 'twitter:title', content: title },
    })
    updateHeadTag('meta[name="twitter:description"]', {
      tag: 'meta',
      attributes: { name: 'twitter:description', content: description },
    })
    updateHeadTag('meta[name="twitter:image"]', {
      tag: 'meta',
      attributes: { name: 'twitter:image', content: 'https://example.com/og-image.jpg' },
    })
  }, [description, location.pathname, title])

  return null
}

function updateHeadTag(selector, config) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement(config.tag)
    document.head.appendChild(element)
  }

  Object.entries(config.attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function HomePage() {
  const copy = useRootCopy()

  return (
    <>
      <Meta title={copy.homeMeta.title} description={copy.homeMeta.description} />
      <SiteHeader />
      <main className="home-page">
        <HeroSection copy={copy} />
        <TransitionSection copy={copy} />
        <ComparisonSection copy={copy} />
        <FeaturesSection copy={copy} />
        <SupportNoteSection />
        <ProcessSection copy={copy} />
        <FaqSection copy={copy} />
        <FinalCtaSection copy={copy} />
      </main>
      <Footer />
    </>
  )
}

function SiteHeader() {
  const copy = useRootCopy()
  const { language, setLanguage } = useRootLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <header className="site-header">
      <PageShell>
        <div className="site-header-inner">
          <Link to="/" className="brand-link brand-link--header">
            <img src={logoImage} alt="Todayler" />
            <span>Todayler</span>
          </Link>
          <div className="header-actions">
            <div className="language-switcher" ref={menuRef}>
              <button
                type="button"
                className="language-switcher-button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label={copy.header.languageLabel}
                onClick={() => setMenuOpen((current) => !current)}
              >
                <span>{language === 'el' ? 'Ελ' : 'En'}</span>
                <span className="language-switcher-caret" aria-hidden="true">
                  ▾
                </span>
              </button>
              {menuOpen ? (
                <div className="language-switcher-menu" role="menu" aria-label={copy.header.languageLabel}>
                  <button
                    type="button"
                    className={`language-switcher-option${language === 'en' ? ' is-active' : ''}`}
                    role="menuitemradio"
                    aria-checked={language === 'en'}
                    onClick={() => {
                      setLanguage('en')
                      setMenuOpen(false)
                    }}
                  >
                    {copy.header.languageOptions.en}
                  </button>
                  <button
                    type="button"
                    className={`language-switcher-option${language === 'el' ? ' is-active' : ''}`}
                    role="menuitemradio"
                    aria-checked={language === 'el'}
                    onClick={() => {
                      setLanguage('el')
                      setMenuOpen(false)
                    }}
                  >
                    {copy.header.languageOptions.el}
                  </button>
                </div>
              ) : null}
            </div>
            <StoreButton location="header-cta">{copy.header.download}</StoreButton>
          </div>
        </div>
      </PageShell>
    </header>
  )
}

function HeroSection({ copy }) {
  const { language } = useRootLanguage()
  const [isMobileHero, setIsMobileHero] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 719px)').matches : false,
  )
  const [heroAgeInput, setHeroAgeInput] = useState(String(HERO_DEFAULT_AGE_MONTHS))
  const [heroAgeMonths, setHeroAgeMonths] = useState(HERO_DEFAULT_AGE_MONTHS)
  const [heroActivities, setHeroActivities] = useState(
    () => getHeroActivitiesForAgeMonths(HERO_DEFAULT_AGE_MONTHS, language),
  )
  const [heroCenteredIndex, setHeroCenteredIndex] = useState(0)
  const [heroAgeError, setHeroAgeError] = useState('')
  const [heroAgeAttentionTick, setHeroAgeAttentionTick] = useState(0)
  const [heroAgeAttentionActive, setHeroAgeAttentionActive] = useState(false)
  const [heroAutoAdvanceDelayMs, setHeroAutoAdvanceDelayMs] = useState(0)
  const heroAgeCardRef = useRef(null)
  const heroAgeInputRef = useRef(null)
  const heroAgeAutoAdvanceTimeoutRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(max-width: 719px)')
    const handleChange = (event) => {
      setIsMobileHero(event.matches)
    }

    setIsMobileHero(mediaQuery.matches)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  function handleHeroAgeSubmit(event) {
    event.preventDefault()

    const parsedMonths = Number.parseFloat(heroAgeInput)
    const isValidAge =
      Number.isFinite(parsedMonths) &&
      parsedMonths >= HERO_AGE_MIN_MONTHS &&
      parsedMonths <= HERO_AGE_MAX_MONTHS

    if (!isValidAge) {
      setHeroAgeError('Enter an age between 0 and 24 months.')
      return
    }

    setHeroAgeError('')
    setHeroAgeMonths(parsedMonths)
    setHeroActivities(getHeroActivitiesForAgeMonths(parsedMonths, language))
    setHeroCenteredIndex(0)
  }

  function resetHeroAge() {
    setHeroAgeInput(String(HERO_DEFAULT_AGE_MONTHS))
    setHeroAgeMonths(null)
    setHeroActivities(getHeroActivitiesForAgeMonths(HERO_DEFAULT_AGE_MONTHS, language))
    setHeroCenteredIndex(0)
    setHeroAgeError('')
  }

  function openHeroAgeInput() {
    resetHeroAge()
    setHeroAgeAttentionTick((currentTick) => currentTick + 1)
  }

  function shiftHeroCenteredIndex(direction) {
    if (heroActivities.length < 2) {
      return
    }

    setHeroAutoAdvanceDelayMs(5000)
    setHeroCenteredIndex(
      (currentIndex) => (currentIndex + direction + heroActivities.length) % heroActivities.length,
    )
  }

  useEffect(() => {
    if (heroAgeMonths === null || heroActivities.length < 2) {
      if (heroAgeAutoAdvanceTimeoutRef.current) {
        window.clearTimeout(heroAgeAutoAdvanceTimeoutRef.current)
        heroAgeAutoAdvanceTimeoutRef.current = null
      }

      return undefined
    }

    if (heroAgeAutoAdvanceTimeoutRef.current) {
      window.clearTimeout(heroAgeAutoAdvanceTimeoutRef.current)
    }

    const rotationDelay = HERO_CARD_ROTATION_MS + heroAutoAdvanceDelayMs
    heroAgeAutoAdvanceTimeoutRef.current = window.setTimeout(() => {
      setHeroCenteredIndex((currentIndex) => (currentIndex + 1) % heroActivities.length)
      setHeroAutoAdvanceDelayMs(0)
      heroAgeAutoAdvanceTimeoutRef.current = null
    }, rotationDelay)

    return () => {
      if (heroAgeAutoAdvanceTimeoutRef.current) {
        window.clearTimeout(heroAgeAutoAdvanceTimeoutRef.current)
        heroAgeAutoAdvanceTimeoutRef.current = null
      }
    }
  }, [heroAgeMonths, heroActivities.length, heroCenteredIndex, heroAutoAdvanceDelayMs])

  useEffect(() => {
    const ageForLanguage = heroAgeMonths ?? HERO_DEFAULT_AGE_MONTHS
    setHeroActivities(getHeroActivitiesForAgeMonths(ageForLanguage, language))
  }, [heroAgeMonths, language])

  useEffect(() => {
    if (heroAgeMonths !== null || heroAgeAttentionTick === 0) {
      return undefined
    }

    const isMobile = window.matchMedia('(max-width: 719px)').matches
    const card = heroAgeCardRef.current
    const input = heroAgeInputRef.current
    let focusTimeoutId = null
    let mobileRefocusTimeoutId = null

    const animationFrame = window.requestAnimationFrame(() => {
      if (isMobile) {
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        focusTimeoutId = window.setTimeout(() => {
          input?.focus({ preventScroll: true })
        }, 260)
        mobileRefocusTimeoutId = window.setTimeout(() => {
          input?.focus({ preventScroll: true })
        }, 760)
      } else {
        setHeroAgeAttentionActive(true)
        window.setTimeout(() => {
          setHeroAgeAttentionActive(false)
        }, 1100)
        focusTimeoutId = window.setTimeout(() => {
          input?.focus({ preventScroll: true })
        }, 0)
      }
    })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      if (focusTimeoutId) {
        window.clearTimeout(focusTimeoutId)
      }
      if (mobileRefocusTimeoutId) {
        window.clearTimeout(mobileRefocusTimeoutId)
      }
    }
  }, [heroAgeAttentionTick, heroAgeMonths])

  return (
    <section className="section hero-section">
      <PageShell className="hero-layout">
        <Reveal as="div" className="hero-copy reveal reveal-fade-up">
          <div className="hero-eyebrow-pill">
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            <span>{copy.hero.eyebrow}</span>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-wipe">{copy.hero.titleLead}</span>{' '}
            <span className="hero-title-accent">{copy.hero.titleAccent}</span>
          </h1>
          <p className="hero-description">{copy.hero.description}</p>
          <div className="hero-cta-row">
            <button
              type="button"
              className="button button-primary button-hero-cta"
              onClick={openHeroAgeInput}
            >
              {copy.hero.primaryCta}
            </button>
            <p className="fine-print">{copy.hero.finePrint}</p>
          </div>
        </Reveal>
        <Reveal as="div" className="hero-visual reveal reveal-rise" delay={120}>
          <div className="hero-device-stage">
            <PhoneFrame
              src={heroPhoneImage}
              alt={copy.heroPhoneAlt}
              className="phone-frame-hero"
            />
            <div className="hero-age-overlay" aria-live="polite">
              {heroAgeMonths === null ? (
                <form
                  ref={heroAgeCardRef}
                  className={`hero-age-card hero-age-card--input${heroAgeAttentionActive ? ' hero-age-card--attention' : ''}`}
                  onSubmit={handleHeroAgeSubmit}
                >
                  <p className="hero-age-prompt">{copy.hero.agePrompt}</p>
                  <label className="hero-age-field">
                    <span className="sr-only">{copy.hero.ageInputAriaLabel}</span>
                    <input
                      ref={heroAgeInputRef}
                      className="hero-age-input"
                      type="number"
                      min={HERO_AGE_MIN_MONTHS}
                      max={HERO_AGE_MAX_MONTHS}
                      step="0.1"
                      inputMode="decimal"
                      placeholder={copy.hero.agePlaceholder}
                      value={heroAgeInput}
                      onChange={(event) => {
                        setHeroAgeInput(event.target.value)
                        if (heroAgeError) {
                          setHeroAgeError('')
                        }
                      }}
                    />
                    <span className="hero-age-unit" aria-hidden="true">
                      {copy.hero.ageUnit}
                    </span>
                  </label>
                  <button type="submit" className="button button-primary hero-age-submit">
                    {copy.hero.ageSubmit}
                  </button>
                  {heroAgeError ? (
                    <p className="hero-age-feedback hero-age-feedback-error" role="alert">
                      {heroAgeError}
                    </p>
                  ) : (
                    <p className="hero-age-feedback">{copy.hero.ageHelp}</p>
                  )}
                </form>
              ) : (
                <div className="hero-age-card hero-age-card--results">
                  <div className="hero-age-results-head">
                    <div className="hero-age-results-heading">
                      <p className="hero-age-results-kicker hero-age-results-kicker--desktop-only">
                        {copy.hero.ageResultsKicker}
                      </p>
                      {!isMobileHero ? (
                        <h2 className="hero-age-results-title hero-age-results-title--desktop-only">
                          {heroAgeMonths.toFixed(1).replace(/\.0$/, '')} {copy.hero.ageResultsSuffix}
                        </h2>
                      ) : null}
                    </div>
                  </div>
                  {heroActivities.length > 0 ? (
                    <div className="hero-age-carousel-shell">
                      <div className="hero-age-results-controls" aria-label="Activity navigation">
                        <button
                          type="button"
                          className="hero-age-nav hero-age-nav--prev"
                          aria-label="Show previous activity"
                          onClick={() => shiftHeroCenteredIndex(-1)}
                          disabled={heroActivities.length < 2}
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          className="hero-age-nav hero-age-nav--next"
                          aria-label="Show next activity"
                          onClick={() => shiftHeroCenteredIndex(1)}
                          disabled={heroActivities.length < 2}
                        >
                          →
                        </button>
                      </div>
                      <div className="hero-age-carousel" data-centered-index={heroCenteredIndex}>
                        {heroActivities.map((activity, index) => {
                          const slotOffset = (index - heroCenteredIndex + heroActivities.length) % heroActivities.length
                          const slotClass =
                            slotOffset === 0
                              ? 'hero-age-activity-card--center'
                              : slotOffset === 1
                                ? 'hero-age-activity-card--right'
                                : 'hero-age-activity-card--left'
                          return (
                            <article
                              key={activity.id}
                              className={`hero-age-activity-card hero-age-activity-card--${activity.category} ${slotClass}`}
                            >
                              {activity.heroImageUrl ? (
                                <div className="hero-age-activity-media">
                                  <img
                                    src={activity.heroImageUrl}
                                    alt=""
                                    aria-hidden="true"
                                    loading="lazy"
                                    decoding="async"
                                    draggable="false"
                                  />
                                </div>
                              ) : null}
                              <p className="hero-age-category">
                                {copy.hero.activityLabels[activity.category] ?? activity.category}
                              </p>
                              <h3>{activity.title}</h3>
                              <p className="hero-age-activity-instruction">{activity.instruction}</p>
                            </article>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}
                  <button type="button" className="hero-age-change-age hero-age-change-age--desktop" onClick={resetHeroAge}>
                    {copy.hero.changeAge}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </PageShell>
    </section>
  )
}

function TransitionSection({ copy }) {
  return (
    <section className="section section-tight" id="about">
      <PageShell narrow>
        <Reveal as="div" className="transition-panel reveal reveal-fade-up">
          <h2 className="transition-title">
            <span>{copy.transition.titleLead}</span>
            <span className="section-title-accent">{copy.transition.titleAccent}</span>
          </h2>
          <p className="section-intro">{copy.transition.body}</p>
        </Reveal>
      </PageShell>
    </section>
  )
}

function ComparisonSection({ copy }) {
  return (
    <section className="section section-tight comparison-section">
      <PageShell narrow>
        <div className="comparison-grid">
          {copy.comparison.columns.map((column, index) => (
            <Reveal
              as="article"
              key={column.label}
              className={`comparison-card comparison-card-${index + 1} reveal reveal-fade-up-soft`}
              delay={90 + index * 70}
            >
              <span className="comparison-number">{column.number}</span>
              <h3 className={`comparison-heading comparison-heading-${index + 1}`}>
                {column.label}
              </h3>
              <ul className="comparison-list">
                {column.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </PageShell>
    </section>
  )
}

function FeaturesSection({ copy }) {
  const featureItems = copy.features.items.filter((item) => item.id !== 'meet-mia')
  const meetMiaItem = copy.features.items.find((item) => item.id === 'meet-mia')

  return (
    <section className="section features-section" id="features">
      <PageShell>
        <div className="section-heading section-heading-centered">
          <Reveal as="h2" className="features-title reveal reveal-fade-up">
            <span>{copy.features.titleLead}</span>
            <span className="section-title-accent">{copy.features.titleAccent}</span>
          </Reveal>
          <Reveal
            as="p"
            className="section-intro section-intro-light reveal reveal-fade-up"
            delay={80}
          >
            {copy.features.intro}
          </Reveal>
        </div>
        <div className="feature-card-grid">
          {featureItems.map((item, index) => (
            <Reveal
              as="article"
              key={item.title}
              className="feature-card reveal reveal-fade-up-soft"
              delay={100 + index * 60}
            >
              <span className="feature-icon-badge" aria-hidden="true">
                <FeatureIcon type={item.iconKey} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
          {meetMiaItem ? (
            <div className="feature-card-duo">
              <Reveal
                as="article"
                className="feature-card feature-card--subtle reveal reveal-fade-up-soft"
                delay={100 + copy.features.items.length * 60}
              >
                <span className="feature-icon-badge" aria-hidden="true">
                  <FeatureIcon type={meetMiaItem.iconKey} />
                </span>
                <h3>{meetMiaItem.title}</h3>
                <p>{meetMiaItem.body}</p>
              </Reveal>
              <Reveal
                as="article"
                className="feature-card feature-card-accent feature-card--subtle reveal reveal-fade-up-soft"
                delay={100 + copy.features.items.length * 60 + 40}
              >
                <span className="feature-icon-badge feature-icon-badge-accent" aria-hidden="true">
                  <FeatureIcon type={copy.supportNote.iconKey} />
                </span>
                <h3>{copy.supportNote.title}</h3>
                <p>{copy.supportNote.body}</p>
              </Reveal>
            </div>
          ) : null}
        </div>
      </PageShell>
    </section>
  )
}

function SupportNoteSection() {
  return null
}

function ProcessSection({ copy }) {
  return (
    <section className="section process-section" id="today-flow">
      <div className="process-curve" aria-hidden="true" />
      <PageShell narrow>
        <div className="section-heading section-heading-centered">
          <Reveal as="h2" className="process-title reveal reveal-fade-up">
            <span>{copy.process.titleLead}</span>
            <span className="section-title-accent">{copy.process.titleAccent}</span>
          </Reveal>
        </div>
        <div className="steps-list process-grid">
          {copy.process.steps.map((step, index) => (
            <Reveal
              as="article"
              key={step.number}
              className="step-card process-card reveal reveal-fade-up-soft"
              delay={110 + index * 70}
            >
              <p className="step-number">{step.number}</p>
              <div className="step-copy">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </PageShell>
    </section>
  )
}

function FaqSection({ copy }) {
  return (
    <section className="section faq-section">
      <PageShell narrow>
        <div className="section-heading section-heading-centered faq-section-heading">
          <Reveal as="h2" className="faq-section-title reveal reveal-fade-up">
            <span>Co-created with </span>
            <span className="faq-section-title-highlight faq-section-title-highlight--parent">
              real parents
            </span>
            <span>. Recommended by </span>
            <span className="faq-section-title-highlight faq-section-title-highlight--pediatricians">
              pediatricians
            </span>
            <span>.</span>
          </Reveal>
        </div>
        <div className="faq-list">
          {copy.faq.items.map((faq, index) => (
            <Reveal
              as="details"
              key={faq.question}
              className="faq-card reveal reveal-fade-up-soft"
              delay={100 + index * 70}
              open={index === 0}
            >
              <summary className="faq-summary">
                <h3>{faq.question}</h3>
                <span className="faq-toggle" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </PageShell>
    </section>
  )
}

function FinalCtaSection({ copy }) {
  return (
    <section className="section final-cta">
      <PageShell narrow>
        <div className="final-card final-card-cta">
          <Reveal as="h2" className="final-cta-title reveal reveal-fade-up">
            <span>{copy.finalCta.titleLead}</span>
            <span className="section-title-accent-light">{copy.finalCta.titleAccent}</span>
          </Reveal>
          <Reveal as="p" className="section-intro reveal reveal-fade-up" delay={70}>
            {copy.finalCta.body}
          </Reveal>
          <StoreButton location="final-cta">{copy.finalCta.cta}</StoreButton>
          <p className="fine-print">{copy.finalCta.finePrint}</p>
        </div>
      </PageShell>
    </section>
  )
}

function LegalPage({ page }) {
  const copy = useRootCopy()
  const { language } = useRootLanguage()
  const pageCopy = copy.legal[page]

  return (
    <>
      <Meta title={pageCopy.metaTitle} description={pageCopy.metaDescription} />
      <div className="legal-page">
        <SiteHeader />
        <main className="legal-main">
          <PageShell narrow>
            <h1 className="legal-title">{pageCopy.title}</h1>
            <p className="legal-updated">
              Todayler ·{' '}
              {language === 'el'
                ? `Τελευταία ενημέρωση: ${pageCopy.lastUpdated}`
                : `Last updated: ${pageCopy.lastUpdated}`}
            </p>
            <div className="legal-sections">
              {pageCopy.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.link ? (
                    <a
                      className="button button-primary legal-link-button"
                      href={section.link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {section.link.label}
                    </a>
                  ) : null}
                </section>
              ))}
            </div>
          </PageShell>
        </main>
      </div>
    </>
  )
}

function NotFoundPage() {
  const copy = useRootCopy()

  return (
    <>
      <Meta title={copy.notFound.title} description={copy.notFound.description} />
      <SiteHeader />
      <main className="not-found-page">
        <PageShell narrow>
          <div className="not-found-card">
            <p className="not-found-code">404</p>
            <h1>{copy.notFound.heading}</h1>
            <p>{copy.notFound.body}</p>
            <Link className="button button-primary" to="/">
              {copy.notFound.cta}
            </Link>
          </div>
        </PageShell>
      </main>
    </>
  )
}

function Footer() {
  const copy = useRootCopy()

  return (
    <footer className="site-footer">
      <PageShell className="footer-layout">
        <div className="footer-brand">
          <div className="brand-link brand-link--footer">
            <img src={logoImage} alt="Todayler" />
            <span>Todayler</span>
          </div>
          <p className="footer-tagline">{copy.footer.tagline}</p>
        </div>
        <div className="footer-groups">
          {copy.footer.groups.map((group) => (
            <nav key={group.title} className="footer-group" aria-label={group.title}>
              <p className="footer-group-title">{group.title}</p>
              <div className="footer-links">
                {group.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  ) : link.href.startsWith('/#') ? (
                    <a key={link.label} href={link.href}>
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.label} to={link.href}>
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </nav>
          ))}
        </div>
        <div className="footer-meta">
          <p>{copy.footer.copyright}</p>
        </div>
      </PageShell>
    </footer>
  )
}

function StoreButton({ children, block = false, location, className = '' }) {
  return (
    <a
      className={`button button-primary${block ? ' button-block' : ''}${className ? ` ${className}` : ''}`}
      href={APP_STORE_URL}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackCtaTap(children, location)}
    >
      {children}
    </a>
  )
}

function InlineButton({ children, href, location }) {
  return (
    <a
      className="button button-secondary"
      href={href}
      onClick={() => trackCtaTap(children, location)}
    >
      {children}
    </a>
  )
}

function trackCtaTap(label, location) {
  const eventPayload = {
    event: 'todayler_cta_tap',
    label,
    location,
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventPayload)
  }

  window.dispatchEvent(new CustomEvent('todayler:cta', { detail: eventPayload }))
}

function PageShell({ children, narrow = false, className = '' }) {
  const shellClassName = ['page-shell', narrow ? 'page-shell--narrow' : '', className]
    .filter(Boolean)
    .join(' ')

  return <div className={shellClassName}>{children}</div>
}

function PhoneFrame({ src, alt, className = '' }) {
  return (
    <div className={`phone-frame ${className}`.trim()}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  )
}

function FeatureIcon({ type }) {
  const paths = {
    '3 Daily Activities':
      'M4 12h4l2-7 4 14 2-8h4',
    'Baby Tracker':
      'M10.9 5.8c-1.1 0-2 .7-2.4 1.8-.2-.1-.4-.1-.6-.1-1.6 0-2.8 1.3-2.8 2.9 0 .8.3 1.5.8 2-.4.4-.6 1-.6 1.7 0 1.7 1.4 3.1 3.1 3.1.3 0 .7-.1 1-.2.5 1 1.4 1.6 2.5 1.6V5.8zm2.2 0c1.1 0 2 .7 2.4 1.8.2-.1.4-.1.6-.1 1.6 0 2.8 1.3 2.8 2.9 0 .8-.3 1.5-.8 2 .4.4.6 1 .6 1.7 0 1.7-1.4 3.1-3.1 3.1-.3 0-.7-.1-1-.2-.5 1-1.4 1.6-2.5 1.6V5.8zm-1.1 0v12.8m-1.8-8.3c0-.8-.7-1.4-1.4-1.4m1.4 5.1c0-.8-.7-1.4-1.4-1.4m3.6-2.3c0-.8.7-1.4 1.4-1.4m-1.4 5.1c0-.8.7-1.4 1.4-1.4m-1.8-1h1m-1-3.3h1',
    'Milestone Chapters':
      'M5.8 7h4.7c1.5 0 2.8.6 3.5 1.6.7-1 2-1.6 3.5-1.6H18v10.2h-.5c-1.8 0-3.3.7-4.4 1.9-1.1-1.2-2.6-1.9-4.4-1.9h-.5zm6.2 1.2v10.7m-5-9.1h2.8m4.4 0h2.8',
    'Bedtime Stories':
      'M15.5 4.5a7 7 0 1 0 4 12.8A8 8 0 1 1 15.5 4.5z',
    'Meet Mia':
      'M12 5c4.4 0 8 2.9 8 6.5S16.4 18 12 18c-.8 0-1.7-.1-2.5-.4L6 19l1.2-3C5.8 14.9 4 13.3 4 11.5 4 7.9 7.6 5 12 5z',
    'Built next to real parents':
      'M12 19.2c-2.2-1.4-7.2-4.9-7.2-8.8 0-2.2 1.6-3.9 3.7-3.9 1.5 0 2.6.8 3.3 1.9.7-1.1 1.8-1.9 3.3-1.9 2.1 0 3.7 1.7 3.7 3.9 0 3.9-5 7.4-7.2 8.8z',
  }

  return (
    <svg
      className={type === 'Built next to real parents' ? 'feature-icon-svg feature-icon-svg-heart' : 'feature-icon-svg'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[type] ?? 'M5 12h14'} />
    </svg>
  )
}

function Reveal({
  as = 'div',
  children,
  className = '',
  threshold,
  rootMargin,
  delay = 0,
}) {
  const { isVisible, setNode } = useReveal({ threshold, rootMargin })
  const Tag = as

  return (
    <Tag
      ref={setNode}
      className={getRevealClassName(className, isVisible)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

function useReveal({ threshold = 0.22, rootMargin = '0px 0px -10% 0px' } = {}) {
  const nodeRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const element = nodeRef.current
    if (!element || isVisible || prefersReducedMotion) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isVisible, prefersReducedMotion, rootMargin, threshold])

  return {
    isVisible: isVisible || prefersReducedMotion,
    setNode: (node) => {
      nodeRef.current = node
    },
  }
}

function getRevealClassName(baseClassName, isVisible) {
  return [baseClassName, isVisible ? 'reveal-visible' : '']
    .filter(Boolean)
    .join(' ')
}

export default App
