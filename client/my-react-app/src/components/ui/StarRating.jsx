export default function StarRating({ count = 5, size = 16 }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i < count ? '#E8622A' : '#ddd'}>
          <path d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.31L10 13.27l-4.78 2.52.91-5.31L2.27 6.62l5.34-.78z" />
        </svg>
      ))}
    </div>
  )
}
