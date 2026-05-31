export interface TimelineEvent {
  year: string
  event: string
}

export interface TipALocation {
  id: string
  name: string
  period: string
  civilization: string
  coordinates: [number, number]
  polygon: GeoJSON.Feature<GeoJSON.Polygon>
  summary: string
  mainText: string
  timeline: TimelineEvent[]
  whyImportant: string
  imageUrl: string
  readMoreUrl: string
}

export interface CityFeature {
  type: 'Feature'
  properties: {
    id: string
    name: string
    summary: string
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export interface CitiesGeoJSON {
  type: 'FeatureCollection'
  features: CityFeature[]
}

export type GpsStatus = 'idle' | 'watching' | 'error'
