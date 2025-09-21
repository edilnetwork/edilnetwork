// app/layout.tsx
import type { ReactNode } from 'react'

export const metadata = {
  title: 'EdilNetwork',
  description: 'Rete di aziende edili per subappalti e collaborazioni',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        {/* CSS di Leaflet (solo stile, nessuno script esterno) */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
