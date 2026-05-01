import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import ChefCard from '../components/cards/ChefCard'
import { useChefsList } from '../services/chefs'

export default function Home() {
  const [query, setQuery] = useState('')
  const { data: chefs = [], isLoading, isError } = useChefsList()
  const heroChefs = chefs.slice(0, 4)

  return (
    <PageWrapper background="#fff">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .home-hero { flex-direction: column !important; padding: 40px 24px !important; }
          .home-hero-img { max-width: 100% !important; }
          .home-chef-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* Hero */}
      <section className="home-hero" style={{
        display: 'flex', alignItems: 'center',
        backgroundColor: '#E8490F', padding: '60px 60px',
        minHeight: '520px', gap: '40px',
      }}>
        <div style={{ flex: 1, maxWidth: '480px' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px,5vw,52px)', fontWeight: 400,
            color: '#fff', lineHeight: 1.15, margin: '0 0 20px', fontStyle: 'italic',
          }}>
            Find your<br />perfect{' '}
            <span style={{ color: '#FFB347' }}>Culinary</span><br />Match
          </h1>
          <p style={{ color: '#fff', fontSize: 15, lineHeight: 1.6, margin: '0 0 30px', opacity: 0.9 }}>
            Connect with professional chefs from around the world. Explore thousands
            of curated recipes and bring restaurant-quality meals to your kitchen.
          </p>
          <div style={{ display: 'flex', maxWidth: 400 }}>
            <input
              style={{
                flex: 1, padding: '12px 16px', border: 'none',
                borderRadius: '6px 0 0 6px', fontSize: 14, outline: 'none',
                backgroundColor: '#fff', color: '#333',
              }}
              placeholder="Search for chefs, recipes or cuisines"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button style={{
              padding: '12px 20px', backgroundColor: '#E8490F', color: '#fff',
              border: '2px solid #fff', borderLeft: 'none',
              borderRadius: '0 6px 6px 0', fontSize: 14, cursor: 'pointer', fontWeight: 500,
            }}>
              Search
            </button>
          </div>
        </div>

        <div className="home-hero-img" style={{ flex: 1, maxWidth: '1000px', paddingLeft: '100px' }}>
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
            alt="Chef cooking"
            style={{ width: '750px', height: 340, objectFit: 'cover', borderRadius: 8 }}
            onError={(e) => { e.target.src = 'https://placehold.co/600x340/333/fff?text=Chef' }}
          />
        </div>
      </section>

      {/* Chef Cards */}
      <section style={{ padding: '50px 40px', backgroundColor: '#fff' }}>
        {isLoading ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            Loading chefs...
          </p>
        ) : isError ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            Unable to load chefs right now.
          </p>
        ) : heroChefs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            No chefs found.
          </p>
        ) : (
          <div className="home-chef-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24,
          }}>
            {heroChefs.map((chef) => (
              <ChefCard key={chef._id || chef.id} chef={chef} showButton={false} />
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  )
}
