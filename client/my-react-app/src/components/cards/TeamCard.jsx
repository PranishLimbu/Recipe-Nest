import { useState } from 'react'

export default function TeamCard({ member }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.13)' : '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      <div style={{ overflow: 'hidden', height: 260 }}>
        <img
          src={member.img}
          alt={member.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
          onError={(e) => { e.target.src = 'https://placehold.co/400x260/222/fff?text=Chef' }}
        />
      </div>
      <div style={{ padding: '20px 20px 24px' }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, fontWeight: 600, color: '#1a1a1a', margin: '0 0 4px',
        }}>
          {member.name}
        </h3>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 13, color: '#E8622A', fontWeight: 700,
          letterSpacing: '0.04em', margin: '0 0 12px', textTransform: 'uppercase',
        }}>
          {member.role}
        </p>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 13, color: '#666', lineHeight: 1.7, margin: 0,
        }}>
          {member.bio}
        </p>
      </div>
    </div>
  )
}
