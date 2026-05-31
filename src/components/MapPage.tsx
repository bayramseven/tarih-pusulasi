'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { TipALocation, CityFeature } from '@/lib/types'
import { useGps } from '@/hooks/useGps'
import { useGeofencing } from '@/hooks/useGeofencing'
import BottomSheet from './BottomSheet'
import GpsButton from './GpsButton'
import SplashScreen from './SplashScreen'

const MapCanvas = dynamic(() => import('./MapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'var(--parchment)' }}>
      <div className="text-center">
        <div className="compass-spin inline-block mb-4">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#C8960C" strokeWidth="1.5" strokeDasharray="4 6" />
            <circle cx="24" cy="24" r="6" fill="#C8960C" opacity="0.3" />
            <circle cx="24" cy="24" r="3" fill="#C8960C" />
            <path d="M24 4 L27 14 L24 11 L21 14 Z" fill="#C8960C" />
            <path d="M24 44 L27 34 L24 37 L21 34 Z" fill="#C8960C" opacity="0.5" />
          </svg>
        </div>
        <p className="text-sm" style={{ color: 'var(--ink-light)', fontFamily: "'Source Serif 4',serif" }}>
          Harita yükleniyor…
        </p>
      </div>
    </div>
  ),
})

interface Props {
  tipALocations: TipALocation[]
  cities: CityFeature[]
}

export default function MapPage({ tipALocations, cities }: Props) {
  const [splashDone, setSplashDone] = useState(false)

  const { position, status, startWatching, stopWatching } = useGps()
  const geofencedLocation = useGeofencing(position, tipALocations)

  const [manualTipA, setManualTipA] = useState<TipALocation | null>(null)
  const [manualCity, setManualCity] = useState<CityFeature | null>(null)

  const activeTipA = geofencedLocation ?? manualTipA
  const activeCity = geofencedLocation ? null : manualCity

  const handleTipAClick = useCallback((loc: TipALocation) => {
    setManualTipA(loc); setManualCity(null)
  }, [])

  const handleCityClick = useCallback((city: CityFeature) => {
    setManualCity(city); setManualTipA(null)
  }, [])

  const handleClose = useCallback(() => {
    setManualTipA(null); setManualCity(null)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ── Harita — sadece splash bittikten sonra mount edilir ── */}
      {splashDone && (
        <MapCanvas
          tipALocations={tipALocations}
          cities={cities}
          gpsPosition={position}
          onTipAClick={handleTipAClick}
          onCityClick={handleCityClick}
        />
      )}

      {/* ── Splash ── */}
      <AnimatePresence>
        {!splashDone && (
          <motion.div
            key="splash"
            className="absolute inset-0 z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SplashScreen onEnter={() => setSplashDone(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <AnimatePresence>
        {splashDone && (
          <motion.div
            className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="px-4 pt-4 pb-8"
              style={{ background: 'linear-gradient(to bottom, rgba(245,239,215,0.97) 55%, transparent)' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-px flex-1 opacity-25"
                  style={{ background: 'linear-gradient(to right, transparent, var(--gold))' }} />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" opacity="0.7">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" fill="var(--gold)" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
                <div className="h-px flex-1 opacity-25"
                  style={{ background: 'linear-gradient(to left, transparent, var(--gold))' }} />
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-xs tracking-[0.3em] uppercase mb-0.5"
                  style={{ color: 'var(--gold)', fontFamily: "'Source Serif 4', serif" }}>
                  Tarihi Coğrafya
                </p>
                <h1 className="text-2xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}>
                  Tarih Pusulası
                </h1>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ink-light)' }}>
                  Tarihi alanlara yaklaş, geçmişi keşfet
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GPS bildirimleri ── */}
      <AnimatePresence>
        {status === 'error' && splashDone && (
          <motion.div key="gps-error"
            className="absolute z-20 left-4 right-4 px-4 py-2.5 rounded-xl text-sm text-center font-medium"
            style={{ top: '108px', background: 'rgba(200,50,50,0.92)', color: '#fff',
              backdropFilter: 'blur(8px)', boxShadow: '0 4px 16px rgba(200,50,50,0.3)' }}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
            GPS alınamıyor — haritaya tıklayarak keşfedebilirsin
          </motion.div>
        )}
        {status === 'watching' && position && !geofencedLocation && !manualTipA && !manualCity && splashDone && (
          <motion.div key="gps-no-match"
            className="absolute z-20 left-4 right-4 px-4 py-3 rounded-xl text-sm text-center"
            style={{ top: '108px', background: 'rgba(245,239,215,0.96)', color: 'var(--ink)',
              backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(44,24,16,0.2)',
              border: '1px solid rgba(200,150,12,0.3)' }}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
            <span style={{ color: 'var(--gold)' }}>📍</span>{' '}
            Konumunuz tespit edildi. Yakında tarihi alan yok —{' '}
            <span style={{ color: 'var(--gold)', fontWeight: 600 }}>altın markerları</span> keşfedebilirsiniz.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GPS butonu ── */}
      {splashDone && (
        <GpsButton status={status} onStart={startWatching} onStop={stopWatching} />
      )}

      {/* ── Bottom sheet ── */}
      <BottomSheet
        tipALocation={activeTipA}
        cityLocation={activeCity}
        onClose={handleClose}
      />
    </div>
  )
}
