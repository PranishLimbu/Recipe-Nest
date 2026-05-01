import { useState } from 'react'
import { Link } from 'react-router-dom'
import StarRating from '../ui/StarRating'

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x220/222/fff?text=Chef'

export default function ChefCard({ chef, showButton = false }) {
  const [hovered, setHovered] = useState(false)
  const name = chef?.name || chef?.fullName || chef?.username || 'Chef'
  const speciality = Array.isArray(chef?.speciality) ? chef.speciality.join(', ') : chef?.speciality
  const cuisineType = Array.isArray(chef?.cuisineType) ? chef.cuisineType.join(', ') : chef?.cuisineType
  const cuisine = chef?.cuisine || cuisineType || speciality || chef?.specialty || chef?.role || 'RecipeNest Chef'
  const rating = Number(chef?.rating) || 0
  const bio = chef?.bio || chef?.description || chef?.about || 'This chef has not added a description yet.'
  const image = chef?.profilePhoto?.url || chef?.image || chef?.img || chef?.profileImage || chef?.avatar || PLACEHOLDER_IMAGE
  const profileId = chef?._id || chef?.id
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: hovered ? '0 8px 30px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      <img
        src={image}
        alt={name}
        style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
        onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
      />
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '17px', fontWeight: '600', margin: '0 0 2px',
          color: '#111', fontFamily: "'Lato', sans-serif",
        }}>
          {name}
        </h3>
        <p style={{ fontSize: '13px', color: '#E8490F', margin: 0, fontFamily: "'Lato', sans-serif" }}>
          {cuisine}
        </p>
        <StarRating count={rating} />
        <p style={{
          fontSize: '13px', color: '#555', lineHeight: '1.5',
          margin: '6px 0 16px', fontFamily: "'Lato', sans-serif",
        }}>
          {bio}
        </p>
        {showButton && profileId ? (
          <Link
            to={`/chefs/${profileId}`}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              backgroundColor: hovered ? '#d03d08' : '#E8490F',
              color: '#fff',
              textAlign: 'center',
              textDecoration: 'none',
              borderRadius: '30px',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: "'Lato', sans-serif",
              transition: 'background-color 0.2s ease',
            }}
          >
            View Profile
          </Link>
        ) : null}
      </div>
    </div>
  )
}
