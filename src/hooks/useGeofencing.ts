'use client'

import { useEffect, useState } from 'react'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'
import { TipALocation } from '@/lib/types'
import { GpsPosition } from './useGps'

export function useGeofencing(
  gpsPosition: GpsPosition | null,
  locations: TipALocation[]
): TipALocation | null {
  const [matched, setMatched] = useState<TipALocation | null>(null)

  useEffect(() => {
    if (!gpsPosition) {
      setMatched(null)
      return
    }

    const pt = point([gpsPosition.lng, gpsPosition.lat])

    const found = locations.find((loc) =>
      booleanPointInPolygon(pt, loc.polygon)
    )

    setMatched(found ?? null)
  }, [gpsPosition, locations])

  return matched
}
