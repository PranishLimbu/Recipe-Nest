import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import ChefCard from '../components/cards/ChefCard'
import SearchBar from '../components/ui/SearchBar'
import { useChefsList } from '../services/chefs'

export default function Chefs() {
  const [query, setQuery] = useState('')

  const { data: chefs = [], isLoading, isError } = useChefsList()
  const filtered = chefs.filter((chef) => {
    const name = chef?.name || chef?.fullName || chef?.username || ''
    return name.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <PageWrapper background="#f5f5f5">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .chefs-grid { grid-template-columns: repeat(2,1fr) !important; }
          .chefs-header { padding: 32px 24px 24px !important; }
        }
        @media (max-width: 480px) {
          .chefs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div className="chefs-header" style={{ backgroundColor: '#fff', padding: '40px 60px 30px' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 42, fontWeight: 400, margin: '0 0 24px', color: '#111',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          Meet our Chefs <span style={{ fontSize: 32 }}>👨‍🍳</span>
        </h1>
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chefs by name"
        />
      </div>

      {/* Grid */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '40px 60px' }}>
        {isLoading ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            Loading chefs...
          </p>
        ) : isError ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            Unable to load chefs right now.
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            No chefs found.
          </p>
        ) : (
          <div className="chefs-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24,
          }}>
            {filtered.map((chef) => (
              <ChefCard key={chef.id || chef._id} chef={chef} showButton={true} />
            ))}
          </div>
        )}  
      </div>
    </PageWrapper>
  )
}
