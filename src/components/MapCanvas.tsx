'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_TOKEN, MAP_STYLE, TURKEY_CENTER, DEFAULT_ZOOM } from '@/lib/mapbox'
import { TipALocation, CityFeature } from '@/lib/types'
import { GpsPosition } from '@/hooks/useGps'

mapboxgl.accessToken = MAPBOX_TOKEN

/* ── Tip A yer imi markeri (altın mühür) ── */
function createTipAMarkerEl(onClick: () => void): HTMLElement {
  const uid = `g${Math.random().toString(36).slice(2)}`
  const wrap = document.createElement('div')
  wrap.style.cssText = 'cursor:pointer;width:36px;height:48px;'
  wrap.className = 'tipa-marker'

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '36')
  svg.setAttribute('height', '48')
  svg.setAttribute('viewBox', '0 0 36 48')
  svg.setAttribute('overflow', 'visible')
  svg.innerHTML = `
    <defs>
      <linearGradient id="${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E8B84B"/>
        <stop offset="100%" stop-color="#A07008"/>
      </linearGradient>
      <filter id="s${uid}">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(100,60,0,0.5)"/>
      </filter>
    </defs>
    <path d="M3 0 L33 0 Q36 0 36 3 L36 34 L18 48 L0 34 L0 3 Q0 0 3 0 Z"
      fill="url(#${uid})" filter="url(#s${uid})"/>
    <path d="M6 3 L30 3 Q33 3 33 6 L33 31 L18 42 L3 31 L3 6 Q3 3 6 3 Z"
      fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
    <circle cx="18" cy="17" r="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>
    <text x="18" y="22" text-anchor="middle" fill="white"
      font-family="'Playfair Display',Georgia,serif" font-size="12" font-weight="bold">✦</text>
  `
  wrap.appendChild(svg)
  wrap.addEventListener('click', (e) => { e.stopPropagation(); onClick() })
  return wrap
}

/* ── GPS mavi nokta ── */
function createGpsDotEl(): HTMLElement {
  const el = document.createElement('div')
  el.style.cssText = `
    width:20px;height:20px;
    background:#4F9EFF;
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 0 0 6px rgba(79,158,255,0.22),0 2px 8px rgba(0,0,0,0.25);
  `
  return el
}

interface Props {
  tipALocations: TipALocation[]
  cities: CityFeature[]
  gpsPosition: GpsPosition | null
  onTipAClick: (location: TipALocation) => void
}

export default function MapCanvas({ tipALocations, cities, gpsPosition, onTipAClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const gpsMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const hasFlewRef = useRef(false)
  const hoveredIdRef = useRef<number | string | null>(null)

  const initMap = useCallback(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: TURKEY_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 4,
      maxZoom: 18,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left')
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'bottom-left')

    map.on('load', () => {

      /* ══ TİP B — Şehir noktaları ══ */
      map.addSource('cities', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: cities as unknown as GeoJSON.Feature[] },
      })
      map.addLayer({
        id: 'cities-circle',
        type: 'circle',
        source: 'cities',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 4, 10, 7],
          'circle-color': '#F5EFD7',
          'circle-stroke-width': 1.8,
          'circle-stroke-color': '#C8960C',
          'circle-opacity': 0.92,
        },
      })
      map.addLayer({
        id: 'cities-label',
        type: 'symbol',
        source: 'cities',
        minzoom: 6.5,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 6.5, 10, 10, 13],
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#2C1810',
          'text-halo-color': '#F5EFD7',
          'text-halo-width': 1.8,
        },
      })

      /* Şehir tıklaması → mini Mapbox popup */
      map.on('click', 'cities-circle', (e) => {
        if (!e.features?.[0]) return
        const props = e.features[0].properties as { name: string; summary: string }
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number]

        new mapboxgl.Popup({ closeButton: true, closeOnClick: true, className: 'city-popup', maxWidth: '280px' })
          .setLngLat(coords)
          .setHTML(`
            <div class="city-popup-inner">
              <h3>${props.name}</h3>
              <p>${props.summary}</p>
              <span class="city-popup-footer">Daha fazla yakında ✦</span>
            </div>
          `)
          .addTo(map)
      })
      map.on('mouseenter', 'cities-circle', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'cities-circle', () => { map.getCanvas().style.cursor = '' })

      /* ══ TİP A — Poligon katmanları ══ */
      const polygonFeatures: GeoJSON.Feature[] = tipALocations.map((loc, i) => ({
        type: 'Feature' as const,
        id: i,
        properties: { id: loc.id, name: loc.name },
        geometry: loc.polygon.geometry,
      }))

      map.addSource('tip-a-polygons', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: polygonFeatures },
        generateId: true,
      })

      /* Dolgu — hover'da koyulaşır */
      map.addLayer({
        id: 'tip-a-fill',
        type: 'fill',
        source: 'tip-a-polygons',
        paint: {
          'fill-color': '#C8960C',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.42,
            0.18,
          ],
        },
      })

      /* Kenarlık */
      map.addLayer({
        id: 'tip-a-border',
        type: 'line',
        source: 'tip-a-polygons',
        paint: {
          'line-color': '#8B6914',
          'line-width': 2,
          'line-opacity': 0.75,
          'line-dasharray': [3, 1.5],
        },
      })

      /* İsim label — zoom 8+ */
      map.addLayer({
        id: 'tip-a-label',
        type: 'symbol',
        source: 'tip-a-polygons',
        minzoom: 8,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['DIN Offc Pro Italic', 'Arial Unicode MS Regular'],
          'text-size': 13,
          'text-anchor': 'center',
          'text-justify': 'center',
        },
        paint: {
          'text-color': '#5C3400',
          'text-halo-color': 'rgba(245,239,215,0.95)',
          'text-halo-width': 2.5,
        },
      })

      /* Hover efekti */
      map.on('mousemove', 'tip-a-fill', (e) => {
        if (!e.features?.length) return
        map.getCanvas().style.cursor = 'pointer'
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: 'tip-a-polygons', id: hoveredIdRef.current }, { hover: false })
        }
        hoveredIdRef.current = e.features[0].id as number
        map.setFeatureState({ source: 'tip-a-polygons', id: hoveredIdRef.current }, { hover: true })
      })
      map.on('mouseleave', 'tip-a-fill', () => {
        if (hoveredIdRef.current !== null) {
          map.setFeatureState({ source: 'tip-a-polygons', id: hoveredIdRef.current }, { hover: false })
          hoveredIdRef.current = null
        }
        map.getCanvas().style.cursor = ''
      })

      /* Poligon tıklaması → BottomSheet */
      map.on('click', 'tip-a-fill', (e) => {
        if (!e.features?.[0]) return
        const locId = e.features[0].properties?.id as string
        const loc = tipALocations.find(l => l.id === locId)
        if (loc) onTipAClick(loc)
      })

      /* ══ TİP A — Yer imi markerları (poligon üstünde) ══ */
      tipALocations.forEach((loc) => {
        const el = createTipAMarkerEl(() => onTipAClick(loc))
        new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(loc.coordinates)
          .addTo(map)
      })
    })

    mapRef.current = map
  }, [tipALocations, cities, onTipAClick])

  useEffect(() => {
    initMap()
    return () => { mapRef.current?.remove(); mapRef.current = null }
  }, [initMap])

  /* GPS nokta + flyTo */
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (!gpsPosition) {
      gpsMarkerRef.current?.remove()
      gpsMarkerRef.current = null
      hasFlewRef.current = false
      return
    }

    const lngLat: [number, number] = [gpsPosition.lng, gpsPosition.lat]

    if (!hasFlewRef.current) {
      hasFlewRef.current = true
      map.flyTo({ center: lngLat, zoom: 13, duration: 2200, essential: true })
    }

    if (!gpsMarkerRef.current) {
      gpsMarkerRef.current = new mapboxgl.Marker({ element: createGpsDotEl() })
        .setLngLat(lngLat)
        .addTo(map)
    } else {
      gpsMarkerRef.current.setLngLat(lngLat)
    }
  }, [gpsPosition])

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }}
    />
  )
}
