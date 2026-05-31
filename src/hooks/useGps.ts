'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { GpsStatus } from '@/lib/types'

export interface GpsPosition {
  lat: number
  lng: number
  accuracy: number
}

export function useGps() {
  const [position, setPosition] = useState<GpsPosition | null>(null)
  const [status, setStatus] = useState<GpsStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Tarayıcınız GPS desteklemiyor.')
      setStatus('error')
      return
    }

    setStatus('watching')
    setError(null)

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setError(null)
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Konum izni reddedildi.',
          2: 'Konum alınamıyor.',
          3: 'Konum isteği zaman aşımına uğradı.',
        }
        setError(messages[err.code] ?? 'Bilinmeyen GPS hatası.')
        setStatus('error')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    )
  }, [])

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setStatus('idle')
  }, [])

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  return { position, status, error, startWatching, stopWatching }
}
