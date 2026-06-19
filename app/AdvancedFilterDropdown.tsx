'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const ramOptions = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB']
const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']

function buildHref(params: URLSearchParams) {
  const qs = params.toString()
  return `/${qs ? `?${qs}` : ''}#phones`
}

export default function AdvancedFilterDropdown() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams.toString()])
  const currentRam = params.get('ram') ?? ''
  const currentStorage = params.get('storage') ?? ''
  const currentPriceMin = params.get('priceMin') ?? ''
  const currentPriceMax = params.get('priceMax') ?? ''

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [priceMin, setPriceMin] = useState(currentPriceMin)
  const [priceMax, setPriceMax] = useState(currentPriceMax)

  useEffect(() => {
    setPriceMin(currentPriceMin)
    setPriceMax(currentPriceMax)
    if (currentRam) {
      setStep(currentStorage ? 3 : 2)
    } else {
      setStep(1)
    }
  }, [currentRam, currentStorage, currentPriceMin, currentPriceMax])

  const navigateWith = (nextParams: URLSearchParams) => {
    const href = buildHref(nextParams)
    router.push(href)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const setQuery = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    return next
  }

  const selectRam = (ram: string) => {
    const next = setQuery('ram', ram)
    next.delete('storage')
    next.delete('priceMin')
    next.delete('priceMax')
    navigateWith(next)
    setOpen(true)
    setStep(2)
  }

  const selectStorage = (storage: string) => {
    const next = setQuery('storage', storage)
    next.delete('priceMin')
    next.delete('priceMax')
    navigateWith(next)
    setOpen(true)
    setStep(3)
  }

  const applyPrice = () => {
    const next = new URLSearchParams(params.toString())
    if (priceMin) next.set('priceMin', priceMin)
    else next.delete('priceMin')
    if (priceMax) next.set('priceMax', priceMax)
    else next.delete('priceMax')
    navigateWith(next)
  }

  const resetFilters = () => {
    const next = new URLSearchParams(params.toString())
    next.delete('ram')
    next.delete('storage')
    next.delete('priceMin')
    next.delete('priceMax')
    navigateWith(next)
    setOpen(true)
    setStep(1)
  }

  return (
    <div className="advanced-filter-dropdown">
      <button
        type="button"
        className="advanced-dropdown-toggle"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>فیلتر پیشرفته</span>
        <span className="dropdown-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="advanced-dropdown-panel">
          <div className={`step-card ${step === 1 ? 'active' : ''}`}>
            <button type="button" className="step-header" onClick={() => setStep(1)}>
              <span>۱. انتخاب رم</span>
              {currentRam ? <span className="step-badge">{currentRam}</span> : null}
            </button>
            {step === 1 && (
              <div className="step-body">
                {ramOptions.map((ram) => (
                  <button
                    key={ram}
                    type="button"
                    className={`step-button ${currentRam === ram ? 'active' : ''}`}
                    onClick={() => selectRam(ram)}
                  >
                    {ram}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`step-card ${step === 2 ? 'active' : ''}`}>
            <button
              type="button"
              className="step-header"
              onClick={() => setStep(2)}
              disabled={!currentRam}
            >
              <span>۲. انتخاب حافظه</span>
              {currentStorage ? <span className="step-badge">{currentStorage}</span> : null}
            </button>
            {step === 2 && (
              <div className="step-body">
                {storageOptions.map((storage) => (
                  <button
                    key={storage}
                    type="button"
                    className={`step-button ${currentStorage === storage ? 'active' : ''}`}
                    onClick={() => selectStorage(storage)}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`step-card ${step === 3 ? 'active' : ''}`}>
            <button
              type="button"
              className="step-header"
              onClick={() => setStep(3)}
              disabled={!currentStorage}
            >
              <span>۳. محدوده قیمت</span>
              {(currentPriceMin || currentPriceMax) ? (
                <span className="step-badge">{currentPriceMin || '۰'} - {currentPriceMax || '∞'}</span>
              ) : null}
            </button>
            {step === 3 && (
              <div className="step-body">
                <div className="price-row">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="حداقل"
                    className="price-input"
                  />
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="حداکثر"
                    className="price-input"
                  />
                </div>
                <div className="step-actions">
                  <button type="button" className="step-action" onClick={applyPrice}>
                    اعمال
                  </button>
                  <button type="button" className="step-action secondary" onClick={() => {
                    setPriceMin('')
                    setPriceMax('')
                  }}>
                    پاک کردن قیمت
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="advanced-dropdown-footer">
            <button type="button" className="footer-button" onClick={resetFilters}>
              پاک کردن فیلترها
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
