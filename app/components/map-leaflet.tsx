
'use client'

import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet'
import { useMemo } from 'react'

type Point = { id: string; name: string; lat: number; lng: number; verified?: boolean }

export default function MapLeaflet({
  points,
  center,
  radiusKm,
}: {
  points: Point[]
  center?: { lat: number; lng: number }
  radiusKm?: number
}) {
  const defaultCenter = { lat: 41.125, lng: 16.866 } // Bari fallback

  const bounds = useMemo(() => {
    if (!points?.length) return null
    const lats = points.map(p => p.lat)
    const lngs = points.map(p => p.lng)
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ] as [[number, number], [number, number]]
  }, [points])

  const mapCenter = center ?? (points[0] ? { lat: points[0].lat, lng: points[0].lng } : defaultCenter)

  return (
    <div style={{ height: 420, width: '100%', borderRadius: 16, overflow: 'hidden' }}>
      {bounds ? (
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [40, 40] }}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {points.map(p => (
            <Circle
              key={p.id}
              center={[p.lat, p.lng]}
              radius={80}
              pathOptions={{ weight: 1, fillOpacity: 0.6 }}
            >
              <Popup>
                <strong>{p.name}</strong>
                {p.verified ? <div>✅ Verificata</div> : null}
                <div>
                  {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      ) : (
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {typeof radiusKm === 'number' && (
            <Circle
              center={[mapCenter.lat, mapCenter.lng]}
              radius={radiusKm * 1000}
              pathOptions={{ weight: 1, fillOpacity: 0.05 }}
            />
          )}

          {points.map(p => (
            <Circle
              key={p.id}
              center={[p.lat, p.lng]}
              radius={80}
              pathOptions={{ weight: 1, fillOpacity: 0.6 }}
            >
              <Popup>
                <strong>{p.name}</strong>
                {p.verified ? <div>✅ Verificata</div> : null}
                <div>
                  {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      )}
    </div>
  )
}
