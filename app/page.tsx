
import CompanyForm from './components/company-form'

export default function Page(){
  return (
    <main className="hero">
      <section className="card" style={{marginBottom:20}}>
        <h1>Affida commesse a imprese edili verificate in Puglia</h1>
        <p className="lead">EdilNetwork mette in contatto general contractor e imprese locali con documenti verificati (DURC/RC/SOA). Cerca per provincia, skill e raggio chilometrico.</p>
      </section>
      <CompanyForm />
    </main>
  )
}
