export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ display: 'flex', gap: '12px', maxWidth: '700px' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          flex: 1,
          padding: '14px 20px',
          borderRadius: '30px',
          border: '1.5px solid #e0e0e0',
          fontSize: '15px',
          fontFamily: "'Lato', sans-serif",
          outline: 'none',
          backgroundColor: '#f9f9f9',
          color: '#333',
        }}
      />
      <button style={{
        padding: '14px 32px',
        backgroundColor: '#E8490F',
        color: '#fff',
        border: 'none',
        borderRadius: '30px',
        fontSize: '15px',
        cursor: 'pointer',
        fontFamily: "'Lato', sans-serif",
        fontWeight: '500',
      }}>
        Search
      </button>
    </div>
  )
}
