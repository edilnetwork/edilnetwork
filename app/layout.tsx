
import './globals.css'

export const metadata = { title: 'EdilNetwork.it', description: 'Trova imprese edili verificate in Puglia' }

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="it">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script defer src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      </head>
      <body>
        <header className="hero" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <a href="/" style={{fontSize:24,fontWeight:800,color:'#43ffd8'}}>EdilNetwork.it</a>
          <nav style={{display:'flex',gap:12}}>
            <a href="/trova-impresa">Trova Impresa</a>
            <a href="/upload-document">Upload documenti</a>
            <a href="/admin">Admin</a>
          </nav>
        </header>
        {children}
        <footer className="hero footer">© {new Date().getFullYear()} EdilNetwork – Puglia</footer>
      </body>
    </html>
  )
}
