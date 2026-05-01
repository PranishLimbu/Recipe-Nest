import Navbar from './Navbar'
import Footer from './Footer'

export default function PageWrapper({ children, background = '#faf8f5' }) {
  return (
    <div className="min-h-screen font-sans" style={{ background }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
