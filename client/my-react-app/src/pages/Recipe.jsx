import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import RecipeCard from '../components/cards/RecipeCard'
import SearchBar from '../components/ui/SearchBar'
import { useRecipeDetails } from '../services/recipe'

export default function Recipe() {
  const [query, setQuery] = useState('')

  const { data: recipes, isLoading, isError } = useRecipeDetails()

  
  const filtered = query
    ? recipes?.filter(recipe =>
        (recipe?.title || '').toLowerCase().includes(query.toLowerCase())
      )
    : recipes

  if (isLoading) return <p style={{ textAlign: 'center', padding: 40 }}>Loading...</p>
  if (isError)   return <p style={{ textAlign: 'center', padding: 40 }}>Something went wrong.</p>

  return (
    <PageWrapper background="#faf8f5">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .recipes-grid { grid-template-columns: repeat(2,1fr) !important; }
          .recipes-header { padding: 32px 24px 24px !important; }
        }
        @media (max-width: 480px) {
          .recipes-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div className="recipes-header" style={{ backgroundColor: '#fff', padding: '40px 60px 30px' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 42, fontWeight: 400, margin: '0 0 24px', color: '#111',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          Curated Recipes <span style={{ fontSize: 32 }}>🍽️</span>
        </h1>
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes by name"
        />
      </div>

      {/* Grid */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '40px 60px' }}>
        {filtered?.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            No recipes found.
          </p>
        ) : (
          <div className="recipes-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24,
          }}>
            {filtered?.map((recipe) => (
              <RecipeCard key={recipe.id || recipe._id || recipe.recipeId} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
