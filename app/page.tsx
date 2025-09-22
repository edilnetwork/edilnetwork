
// app/page.tsx
export default function Home() {
  return (
    <main style={{maxWidth: 900, margin: '40px auto', padding: 16}}>
      <h1>EdilNetwork</h1>
      <p>Portale per trovare e collaborare con imprese edili in Puglia.</p>
      <ul>
        <li><a href="/trova-impresa">Trova Impresa</a></li>
        <li><a href="/admin">Area Admin</a> (protetta)</li>
      </ul>
    </main>
  )
}
