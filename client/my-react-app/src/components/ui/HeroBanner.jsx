export default function HeroBanner({ title, subtitle }) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #E8622A 0%, #d45520 60%, #c04918 100%)',
      padding: '64px 40px 72px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,0,0,0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(36px, 6vw, 58px)',
        fontWeight: 400,
        color: '#fff',
        marginBottom: 16,
        lineHeight: 1.1,
        position: 'relative',
        animation: 'fadeInDown 0.7s ease both',
      }}>
        {title}
      </h1>

      {subtitle && (
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 14,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.06em',
          fontStyle: 'italic',
          position: 'relative',
          animation: 'fadeInDown 0.7s 0.15s ease both',
          margin: 0,
        }}>
          {subtitle}
        </p>
      )}

      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', display: 'block' }}
      >
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#faf8f5" />
      </svg>
    </section>
  )
}
