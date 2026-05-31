import fs from 'fs'
import path from 'path'
import { TipALocation, CitiesGeoJSON } from '@/lib/types'
import MapPage from '@/components/MapPage'

const TIP_A_IDS = [
  'istanbul',
  'hattusa',
  'gobeklitepe',
  'efes',
  'troya',
  'nemrut',
  'catalhoyuk',
  'aspendos',
  'ani',
  'perge',
  'afrodisias',
  'sultanahmet',
]

export default function Page() {
  const dataDir = path.join(process.cwd(), 'public', 'data')

  const tipALocations: TipALocation[] = TIP_A_IDS.map((id) => {
    const raw = fs.readFileSync(path.join(dataDir, 'tip-a', `${id}.json`), 'utf-8')
    return JSON.parse(raw) as TipALocation
  })

  const citiesRaw = fs.readFileSync(
    path.join(dataDir, 'tip-b', 'cities.json'),
    'utf-8'
  )
  const cities = (JSON.parse(citiesRaw) as CitiesGeoJSON).features

  return <MapPage tipALocations={tipALocations} cities={cities} />
}
