export default function LevelBadge({ level }) {
  return (
    <span style={{
      display: 'inline-block',
      background: '#E8622A',
      color: '#fff',
      fontSize: 12,
      fontFamily: "'Lato', sans-serif",
      fontWeight: 700,
      padding: '4px 14px',
      borderRadius: 20,
      letterSpacing: '0.03em',
    }}>
      {level}
    </span>
  )
}
