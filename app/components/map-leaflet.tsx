
'use client'

import { useEffect, useRef } from 'react'

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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    let map: any
    let L: any
    let markers: any[] = []
    let radiusCircle: any | null = null

    async function init() {
      // Import dinamico per evitare SSR
      // @ts-ignore
      L = await import('leaflet').then(m => (m.default ?? m))
      if (!containerRef.current) return

      // Crea mappa (una sola volta)
      if (!mapRef.current) {
        // centro di default (Bari)
        const def = { lat: 41.125, lng: 16.866 }
        const c = center ?? (points[0] ? { lat: points[0].lat, lng: points[0].lng } : def)

        map = L.map(containerRef.current).setView([c.lat, c.lng], 11)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map)
        mapRef.current = map
      } else {
        map = mapRef.current
      }

      // Pulisci layer precedenti
      map.eachLayer((layer: any) => {
        if (layer?.options?.pane === 'markerPane' || layer?.getPopup) {
          map.removeLayer(layer)
        }
      })

      // Aggiungi layer tiles (se l’abbiamo tolto per sbaglio)
      const hasTile = (map as any)._layers && Object.values((map as any)._layers).some((l: any) => l._url)
      if (!hasTile) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)
      }

      // Aggiungi i marker
      markers = points.map(p => {
        const m = L.circleMarker([p.lat, p.lng], {
          radius: 8,
          weight: 1,
          fillOpacity: 0.7,
        }).addTo(map)
        const html = `<strong>${p.name}</strong>${p.verified ? '<div>✅ Verificata</div>' : ''}<div>${p.lat.toFixed(
          4
        )}, ${p.lng.toFixed(4)}</div>`
        m.bindPopup(html)
        return m
      })

      // Fit bounds se ci sono più punti, altrimenti centra
      if (points.length > 1) {
        const latlngs = points.map(p => [p.lat, p.lng]) as [number, number][]
        const b = L.latLngBounds(latlngs)
        map.fitBounds(b, { padding: [40, 40] })
      } else if (center) {
        map.setView([center.lat, center.lng], 11)
      }

      // Cerchio raggio km (se richiesto e ho un centro)
      if (typeof radiusKm === 'number' && (center || points[0])) {
        const c = center ?? { lat: points[0].lat, lng: points[0].lng }
        radiusCircle = L.circle([c.lat, c.lng], {
          radius: radiusKm * 1000,
          weight: 1,
          fillOpacity: 0.05,
        }).addTo(map)
      }
    }

    init()

    return () => {
      // opzionale: non distruggiamo la mappa tra re-render se vuoi persistenza
      // se vuoi pulire tutto allo smontaggio, decommenta:
      // if (mapRef.current) {
      //   mapRef.current.remove()
      //   mapRef.current = null
      // }
    }
    // Aggiorna quando cambiano i dati
  }, [points, center?.lat, center?.lng, radiusKm])

  return <div ref={containerRef} style={{ height: 420, width: '100%', borderRadius: 16, overflow: 'hidden' }} />
}
