import { useState } from 'react'
import { Link } from 'react-router-dom'
import StarRating from '../ui/StarRating'
import LevelBadge from '../ui/LevelBadge'

export default function RecipeCard({ recipe }) {
  const [hovered, setHovered] = useState(false)
  const image = recipe?.image?.url || recipe?.image || 'https://placehold.co/600x400/222/fff?text=Recipe'
  const chef = recipe?.chef || recipe?.userId?.name || 'RecipeNest Chef'
  const level = recipe?.level || 'Featured'
  const stars = Number(recipe?.stars) || 0
  const profileId = recipe?._id || recipe?.id || recipe?.recipeId

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      <div style={{ overflow: 'hidden', height: 220 }}>
        <img
          src={image}
          alt={recipe.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            display: 'block',
          }}
        />
      </div>
      <div style={{ padding: '16px 16px 20px' }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontWeight: 600, color: '#1a1a1a', margin: '0 0 6px',
        }}>
          {recipe.title}
        </h3>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 13, color: '#666', lineHeight: 1.55, margin: '0 0 10px',
        }}>
          {recipe.description}
        </p>
        <StarRating count={stars} />
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 13, color: '#1a1a1a', fontWeight: 600, margin: '4px 0 12px',
        }}>
          {chef}
        </p>
        <LevelBadge level={level} />
        {profileId ? (
          <Link
            to={`/recipes/${profileId}`}
            style={{
              display: 'block',
              marginTop: 14,
              padding: '10px',
              backgroundColor: hovered ? '#d03d08' : '#E8490F',
              color: '#fff',
              textAlign: 'center',
              textDecoration: 'none',
              borderRadius: 30,
              fontSize: 14,
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              transition: 'background-color 0.2s ease',
            }}
          >
            View Recipe
          </Link>
        ) : null}
      </div>
    </div>
  )
}
