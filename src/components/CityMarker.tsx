'use client'

import { CityFeature } from '@/lib/types'

interface Props {
  city: CityFeature
  onClick: (city: CityFeature) => void
}

// Haritada Mapbox GL katmanı olarak render edilir (MapCanvas.tsx).
// Bu bileşen bilgi popup'ı için kullanılmak üzere hazır tutulmaktadır.
export default function CityMarker({ city, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(city)}
      className="text-left"
      style={{ fontFamily: "'Source Serif 4', serif" }}
    >
      <span className="text-xs">{city.properties.name}</span>
    </button>
  )
}
