import { Link, Route, Routes } from "react-router-dom"

function ContactPage() {
  return (
    <div>ContactPage</div>
  )
}

function AboutPage() {
  return (
    <div>AboutPage</div>
  )
}

export default function App() {

  return (
    <div>
      <nav>
        <Link to="/contacts">Contacts</Link>
        <Link to="/about">About</Link>
      </nav>
      <div>
        <Routes>
          <Route path="/contacts" element={<ContactPage />}/>
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  )

}
