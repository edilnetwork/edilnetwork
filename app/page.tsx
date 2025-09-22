// app/page.tsx
import CompanyForm from './components/company-form'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        color: '#fff',
        padding: 20,
      }}
    >
      {/* Hero neon */}
      <section
        style={{
          width: '100%',
          maxWidth: 1100,
          textAlign: 'center',
          paddingTop: 40,
          paddingBottom: 30,
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            color: '#39ff14',
            textShadow: '0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14',
            margin: 0,
          }}
        >
          EdilNetwork
        </h1>
        <p
          style={{
            fontSize: 20,
            color: '#aaa',
            marginTop: 10,
            textShadow: '0 0 5px #ff00de, 0 0 10px #ff00de',
          }}
        >
          Portale per trovare e collaborare con imprese edili in Puglia.
        </p>

        <div
          style={{
            marginTop: 30,
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <a
            href="/trova-impresa"
            style={{
              padding: '12px 22px',
              borderRadius: 12,
              background: '#111',
              color: '#39ff14',
              border: '2px solid #39ff14',
              textDecoration: 'none',
              fontWeight: 'bold',
              textShadow: '0 0 5px #39ff14, 0 0 10px #39ff14',
              boxShadow: '0 0 10px #39ff14, inset 0 0 5px #39ff14',
            }}
          >
            Trova Impresa
          </a>

          <a
            href="/admin"
            style={{
              padding: '12px 22px',
              borderRadius: 12,
              background: '#111',
              color: '#ff00de',
              border: '2px solid #ff00de',
              textDecoration: 'none',
              fontWeight: 'bold',
              textShadow: '0 0 5px #ff00de, 0 0 10px #ff00de',
              boxShadow: '0 0 10px #ff00de, inset 0 0 5px #ff00de',
            }}
          >
            Area Admin (protetta)
          </a>
        </div>
      </section>

      {/* Sezione form: inserimento aziende */}
      <section
        style={{
          width: '100%',
          maxWidth: 1100,
          marginTop: 24,
          marginBottom: 60,
          background: '#0f0f10',
          border: '1px solid #1f1f22',
          borderRadius: 16,
          boxShadow:
            '0 0 20px rgba(57,255,20,0.08), inset 0 0 10px rgba(255,0,222,0.05)',
          padding: 16,
        }}
      >
        <h2
          style={{
            margin: '8px 0 14px',
            color: '#39ff14',
            textShadow: '0 0 8px #39ff14',
            fontSize: '1.5rem',
            textAlign: 'center',
          }}
        >
          Inserisci la tua azienda
        </h2>

        {/* Il form client-side già pronto */}
        <CompanyForm />
      </section>
    </main>
  )
}
