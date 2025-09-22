// app/page.tsx
export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#0a0a0a',
      color: '#fff',
      textAlign: 'center',
      padding: 20
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#39ff14',
        textShadow: '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14'
      }}>
        EdilNetwork
      </h1>
      <p style={{
        fontSize: 20,
        color: '#aaa',
        marginTop: 10,
        textShadow: '0 0 5px #ff00de, 0 0 10px #ff00de'
      }}>
        Portale per trovare e collaborare con imprese edili in Puglia.
      </p>

      <div style={{
        marginTop: 40,
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <a href="/trova-impresa" style={{
          padding: '14px 28px',
          borderRadius: 12,
          background: '#111',
          color: '#39ff14',
          border: '2px solid #39ff14',
          textDecoration: 'none',
          fontWeight: 'bold',
          textShadow: '0 0 5px #39ff14, 0 0 10px #39ff14',
          boxShadow: '0 0 10px #39ff14, inset 0 0 5px #39ff14',
          transition: '0.2s ease-in-out'
        }}>
          Trova Impresa
        </a>

        <a href="/admin" style={{
          padding: '14px 28px',
          borderRadius: 12,
          background: '#111',
          color: '#ff00de',
          border: '2px solid #ff00de',
          textDecoration: 'none',
          fontWeight: 'bold',
          textShadow: '0 0 5px #ff00de, 0 0 10px #ff00de',
          boxShadow: '0 0 10px #ff00de, inset 0 0 5px #ff00de',
          transition: '0.2s ease-in-out'
        }}>
          Area Admin (protetta)
        </a>
      </div>
    </main>
  )
}
