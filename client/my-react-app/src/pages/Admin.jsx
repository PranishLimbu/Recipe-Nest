import { useEffect, useMemo, useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import { useChefsList } from '../services/chefs'
import { useUsersList } from '../services/users'
import { useRecipeDetails } from '../services/recipe'
import { useBlogList } from '../services/blogs'
import { httpClient } from '../lib/axios'
import { TokenService } from '../utils/tokenServices'

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
const EditIcon   = () => <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
const TrashIcon  = () => <Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
const SearchIcon = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
const CloseIcon  = () => <Icon d="M18 6L6 18M6 6l12 12" size={18} />
const CheckIcon  = () => <Icon d="M20 6L9 17l-5-5" size={18} />
const EMPTY_DATA = {
  users: [],
  chefs: [],
  recipes: [],
  blogs: [],
}

const getId = (item, fallback) => item?.id ?? item?._id ?? fallback

const getName = (item) => item?.name || item?.fullName || item?.username || item?.title || 'Untitled'

const formatDate = (value) => {
  if (!value) return 'N/A'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const normalizeUser = (user, index) => ({
  id: getId(user, `user-${index}`),
  name: getName(user),
  email: user?.email || 'N/A',
  joined: formatDate(user?.joined || user?.createdAt || user?.created_at),
  status: user?.status || (user?.isActive === false ? 'Inactive' : 'Active'),
})

const normalizeChef = (chef, index) => ({
  id: getId(chef, `chef-${index}`),
  name: getName(chef),
  specialty: chef?.specialty || chef?.expertise || chef?.category || 'N/A',
  rating: chef?.rating ?? chef?.averageRating ?? 0,
  recipes: chef?.recipesCount ?? chef?.recipeCount ?? chef?.recipes?.length ?? 0,
})

const normalizeRecipe = (recipe, index) => ({
  id: getId(recipe, `recipe-${index}`),
  apiId: recipe?.recipeId || recipe?._id || recipe?.id,
  title: recipe?.title || recipe?.name || 'Untitled',
  description: recipe?.description || 'N/A',
  ingredients: Array.isArray(recipe?.ingredients) ? recipe.ingredients.join(', ') : recipe?.ingredients || '',
  instructions: recipe?.instructions || '',
  created: formatDate(recipe?.createdAt || recipe?.created_at),
  raw: recipe,
})

const normalizeBlog = (blog, index) => ({
  id: getId(blog, `blog-${index}`),
  apiId: blog?.blogId || blog?._id || blog?.id,
  title: blog?.title || blog?.name || 'Untitled',
  summary: blog?.summary || 'N/A',
  status: blog?.status || 'published',
  tags: Array.isArray(blog?.tags) ? blog.tags.join(', ') : blog?.tags || '',
  created: formatDate(blog?.date || blog?.createdAt || blog?.created_at),
  content: blog?.content || '',
  raw: blog,
})

const TABS = [
    { key: 'users',   label: 'Users',   emoji: '👥' },
    { key: 'chefs',   label: 'Chefs',   emoji: '👨‍🍳' },
    { key: 'recipes', label: 'Recipes', emoji: '🍽️' },
    { key: 'blogs',   label: 'Blogs',   emoji: '📝' },
]


function ConfirmModal({ item, onConfirm, onCancel }) {
    return (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'2rem 2.5rem', maxWidth:380, width:'90%', boxShadow:'0 20px 60px rgba(0,0,0,0.2)', fontFamily:"'Lato',sans-serif", textAlign:'center' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🗑️</div>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.6rem', fontWeight:600, color:'#1a1a1a', marginBottom:'0.5rem' }}>Delete item?</h3>
        <p style={{ fontSize:'0.9rem', color:'#666', marginBottom:'1.8rem', lineHeight:1.6 }}>
          This will permanently remove <strong style={{ color:'#f05a1a' }}>{item}</strong>. This action cannot be undone.
        </p>
        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center' }}>
          <button onClick={onCancel} style={{ padding:'0.65rem 1.5rem', borderRadius:8, border:'1.5px solid #e0d0c8', background:'#fff', color:'#555', fontSize:'0.9rem', fontWeight:600, cursor:'pointer', fontFamily:"'Lato',sans-serif" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding:'0.65rem 1.5rem', borderRadius:8, border:'none', background:'#e53e3e', color:'#fff', fontSize:'0.9rem', fontWeight:600, cursor:'pointer', fontFamily:"'Lato',sans-serif" }}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}


function EditModal({ item, fields, onSave, onCancel }) {
  const [form, setForm] = useState({ ...item })
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'2rem 2.5rem', maxWidth:420, width:'90%', boxShadow:'0 20px 60px rgba(0,0,0,0.2)', fontFamily:"'Lato',sans-serif" }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.7rem', fontWeight:600, color:'#1a1a1a' }}>Edit Details</h3>
          <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'#888' }}><CloseIcon /></button>
        </div>
        {fields.map(f => (
          <div key={f} style={{ marginBottom:'1rem' }}>
            <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, color:'#555', marginBottom:'0.35rem', textTransform:'uppercase', letterSpacing:'0.04em' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </label>
            <input
              value={form[f] ?? ''}
              onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
              style={{ width:'100%', padding:'0.65rem 0.9rem', border:'1.5px solid #e8d5c8', borderRadius:8, background:'#fff8f4', fontSize:'0.92rem', fontFamily:"'Lato',sans-serif", color:'#1a1a1a', outline:'none' }}
            />
          </div>
        ))}
        <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem', justifyContent:'flex-end' }}>
          <button onClick={onCancel} style={{ padding:'0.65rem 1.4rem', borderRadius:8, border:'1.5px solid #e0d0c8', background:'#fff', color:'#555', fontSize:'0.88rem', fontWeight:600, cursor:'pointer', fontFamily:"'Lato',sans-serif" }}>
            Cancel
          </button>
          <button onClick={() => onSave(form)} style={{ padding:'0.65rem 1.4rem', borderRadius:8, border:'none', background:'#f05a1a', color:'#fff', fontSize:'0.88rem', fontWeight:600, cursor:'pointer', fontFamily:"'Lato',sans-serif" }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}


const COLUMNS = {
  users:   { cols: ['name','email','joined','status'], editFields: ['name','email','status'] },
  chefs:   { cols: ['name','specialty','rating','recipes'], editFields: ['name','specialty','rating'] },
  recipes: { cols: ['title','description','ingredients','created'], editFields: ['title','description','ingredients','instructions'] },
  blogs:   { cols: ['title','summary','status','created'],  editFields: ['title','summary','content','tags','status'] },
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const tokenDetails = TokenService.getTokenDetails()
  const isAdmin = tokenDetails?.role === 'admin'
  const [tab, setTab]       = useState('users')
  const [data, setData]     = useState(EMPTY_DATA)
  const [search, setSearch] = useState('')
  const [delTarget, setDelTarget] = useState(null)   
  const [editTarget, setEditTarget] = useState(null) 
  const [feedback, setFeedback] = useState({ error: '', success: '', saving: false })

  const { cols, editFields } = COLUMNS[tab]
  const usersQuery = useUsersList()
  const chefsQuery = useChefsList()
  const recipesQuery = useRecipeDetails()
  const blogsQuery = useBlogList()

  const fetchedData = useMemo(() => ({
    users: (usersQuery.data ?? []).map(normalizeUser),
    chefs: (chefsQuery.data ?? []).map(normalizeChef),
    recipes: (recipesQuery.data ?? []).map(normalizeRecipe),
    blogs: (blogsQuery.data ?? []).map(normalizeBlog),
  }), [usersQuery.data, chefsQuery.data, recipesQuery.data, blogsQuery.data])

  useEffect(() => {
    setData(fetchedData)
  }, [fetchedData])

  const queries = [usersQuery, chefsQuery, recipesQuery, blogsQuery]
  const isLoading = queries.some(query => query.isLoading)
  const isError = queries.some(query => query.isError)


  const rows = data[tab].filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )

  const refetchContent = async () => {
    await Promise.all([recipesQuery.refetch(), blogsQuery.refetch()])
  }

  const handleDelete = async (id) => {
    if (!['recipes', 'blogs'].includes(tab)) return

    try {
      setFeedback({ error: '', success: '', saving: true })
      await httpClient.delete(`/api/${tab}/${id}`)
      await refetchContent()
      setFeedback({ error: '', success: `${tab === 'recipes' ? 'Recipe' : 'Blog'} deleted successfully.`, saving: false })
      setDelTarget(null)
    } catch (error) {
      setFeedback({ error: error.response?.data?.error || error.response?.data?.message || 'Delete failed.', success: '', saving: false })
    }
  }

  const handleSave = async (updated) => {
    if (!['recipes', 'blogs'].includes(tab)) return

    const payload = tab === 'recipes'
      ? {
          title: updated.title,
          description: updated.description,
          ingredients: updated.ingredients,
          instructions: updated.instructions,
        }
      : {
          title: updated.title,
          summary: updated.summary,
          content: updated.content,
          tags: updated.tags,
          status: updated.status,
        }

    try {
      setFeedback({ error: '', success: '', saving: true })
      await httpClient.put(`/api/${tab}/${updated.apiId}`, payload)
      await refetchContent()
      setFeedback({ error: '', success: `${tab === 'recipes' ? 'Recipe' : 'Blog'} updated successfully.`, saving: false })
      setEditTarget(null)
    } catch (error) {
      setFeedback({ error: error.response?.data?.error || error.response?.data?.message || 'Update failed.', success: '', saving: false })
    }
  }

  const displayName = (r) => r.name || r.title || '—'

  // Stats
  const stats = TABS.map(t => ({ ...t, count: data[t.key].length }))

  if (!isAdmin) {
    return (
      <PageWrapper background="#fce8dc">
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center', fontFamily: "'Lato',sans-serif" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.6rem', fontWeight: 600, color: '#1a1a1a' }}>
            Admin access required
          </h1>
          <p style={{ marginTop: '0.75rem', color: '#666', lineHeight: 1.7 }}>
            Sign in with an admin account to edit or delete recipes and blogs.
          </p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper background="#fce8dc">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .admin-table { width:100%; border-collapse:collapse; font-family:'Lato',sans-serif; }
        .admin-table th { text-align:left; font-size:0.75rem; font-weight:700; color:#a07060; text-transform:uppercase; letter-spacing:0.06em; padding:0.75rem 1rem; border-bottom:2px solid #f0d8cc; }
        .admin-table td { padding:0.85rem 1rem; font-size:0.9rem; color:#2a2a2a; border-bottom:1px solid #f5e8e0; vertical-align:middle; }
        .admin-table tr:hover td { background:rgba(240,90,26,0.04); }
        .admin-table tr:last-child td { border-bottom:none; }
        .tab-btn { padding:0.55rem 1.2rem; border-radius:30px; border:none; font-family:'Lato',sans-serif; font-size:0.88rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .tab-btn.active { background:#f05a1a; color:#fff; box-shadow:0 4px 14px rgba(240,90,26,0.35); }
        .tab-btn.inactive { background:#fff8f4; color:#a07060; }
        .tab-btn.inactive:hover { background:#ffe8dc; }
        .action-btn { width:32px; height:32px; border-radius:8px; border:none; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.15s; }
        .edit-btn { background:#fff3ed; color:#f05a1a; }
        .edit-btn:hover { background:#f05a1a; color:#fff; transform:translateY(-1px); }
        .del-btn { background:#fff0f0; color:#e53e3e; }
        .del-btn:hover { background:#e53e3e; color:#fff; transform:translateY(-1px); }
        .search-input { width:100%; padding:0.65rem 0.9rem 0.65rem 2.4rem; border:1.5px solid #e8d5c8; border-radius:10px; background:#fff8f4; font-size:0.9rem; font-family:'Lato',sans-serif; color:#1a1a1a; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
        .search-input:focus { border-color:#f05a1a; box-shadow:0 0 0 3px rgba(240,90,26,0.12); }
        .badge { display:inline-block; padding:0.2rem 0.65rem; border-radius:20px; font-size:0.75rem; font-weight:700; letter-spacing:0.03em; }
        .badge-active { background:#e8f9ee; color:#22863a; }
        .badge-inactive { background:#f5f5f5; color:#888; }
        @media (max-width: 680px) {
          .admin-table th:nth-child(3), .admin-table td:nth-child(3),
          .admin-table th:nth-child(4), .admin-table td:nth-child(4) { display:none; }
        }
      `}</style>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2.5rem 1.5rem', fontFamily:"'Lato',sans-serif" }}>

        {/* Header */}
        <div style={{ marginBottom:'2.5rem' }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:400, color:'#1a1a1a', lineHeight:1.1 }}>
            Admin <span style={{ color:'#f05a1a', fontStyle:'italic' }}>Dashboard</span>
          </h1>
          <p style={{ fontSize:'0.92rem', color:'#888', marginTop:'0.4rem' }}>Manage users, chefs, recipes and blogs across Recipe Nest.</p>
          {feedback.error ? (
            <p style={{ marginTop:'0.75rem', color:'#a83220', fontWeight:700 }}>{feedback.error}</p>
          ) : null}
          {feedback.success ? (
            <p style={{ marginTop:'0.75rem', color:'#22713d', fontWeight:700 }}>{feedback.success}</p>
          ) : null}
        </div>

        {/* Stat Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'2.5rem' }}>
          {stats.map(s => (
            <div key={s.key} onClick={() => { setTab(s.key); setSearch('') }}
              style={{ background: tab === s.key ? '#f05a1a' : '#fff', borderRadius:14, padding:'1.25rem 1.5rem', cursor:'pointer', transition:'all 0.2s', boxShadow: tab === s.key ? '0 8px 24px rgba(240,90,26,0.3)' : '0 2px 8px rgba(0,0,0,0.07)', border: tab === s.key ? 'none' : '1.5px solid #f0ddd4' }}>
              <div style={{ fontSize:'1.6rem', marginBottom:'0.4rem' }}>{s.emoji}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:600, color: tab === s.key ? '#fff' : '#1a1a1a', lineHeight:1 }}>{s.count}</div>
              <div style={{ fontSize:'0.82rem', fontWeight:600, color: tab === s.key ? 'rgba(255,255,255,0.8)' : '#a07060', marginTop:'0.2rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab + Search bar */}
        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,0.07)', overflow:'hidden', border:'1.5px solid #f0ddd4' }}>

          {/* Top bar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', padding:'1.25rem 1.5rem', borderBottom:'1.5px solid #f5ece6' }}>
            {/* Tabs */}
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {TABS.map(t => (
                <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : 'inactive'}`}
                  onClick={() => { setTab(t.key); setSearch('') }}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position:'relative', minWidth:220 }}>
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#c0a090', pointerEvents:'none' }}>
                <SearchIcon />
              </span>
              <input className="search-input" placeholder={`Search ${tab}…`} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX:'auto' }}>
            {isLoading ? (
              <div style={{ textAlign:'center', padding:'4rem', color:'#c0a090', fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem' }}>
                Loading admin data...
              </div>
            ) : isError ? (
              <div style={{ textAlign:'center', padding:'4rem', color:'#c0a090', fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem' }}>
                Unable to load admin data.
              </div>
            ) : rows.length === 0 ? (
              <div style={{ textAlign:'center', padding:'4rem', color:'#c0a090', fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem' }}>
                No results found 🍂
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width:40 }}>#</th>
                    {cols.map(c => <th key={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</th>)}
                    {['recipes', 'blogs'].includes(tab) ? <th style={{ textAlign:'right' }}>Actions</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.id}>
                      <td style={{ color:'#c0a090', fontSize:'0.82rem', fontWeight:600 }}>{String(i + 1).padStart(2,'0')}</td>
                      {cols.map(c => (
                        <td key={c}>
                          {c === 'status' ? (
                            <span className={`badge ${row[c] === 'Active' ? 'badge-active' : 'badge-inactive'}`}>{row[c]}</span>
                          ) : c === 'rating' ? (
                            <span style={{ color:'#f05a1a', fontWeight:700 }}>⭐ {row[c]}</span>
                          ) : c === 'likes' || c === 'views' ? (
                            <span style={{ color:'#555', fontWeight:600 }}>{Number(row[c]).toLocaleString()}</span>
                          ) : (
                            <span>{row[c]}</span>
                          )}
                        </td>
                      ))}
                      {['recipes', 'blogs'].includes(tab) ? (
                        <td style={{ textAlign:'right' }}>
                          <div style={{ display:'flex', gap:'0.4rem', justifyContent:'flex-end' }}>
                            <button className="action-btn edit-btn" title="Edit" onClick={() => setEditTarget(row)} disabled={feedback.saving}><EditIcon /></button>
                            <button className="action-btn del-btn"  title="Delete" onClick={() => setDelTarget({ id: row.apiId, name: displayName(row) })} disabled={feedback.saving}><TrashIcon /></button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding:'0.9rem 1.5rem', borderTop:'1.5px solid #f5ece6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:'0.82rem', color:'#b09080', fontFamily:"'Lato',sans-serif" }}>
              {rows.length} of {data[tab].length} {tab}
            </span>
            <span style={{ fontSize:'0.78rem', color:'#c8b0a0' }}>Recipe Nest Admin · v1.0</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {delTarget && (
        <ConfirmModal
          item={delTarget.name}
          onConfirm={() => handleDelete(delTarget.id)}
          onCancel={() => setDelTarget(null)}
        />
      )}
      {editTarget && (
        <EditModal
          item={editTarget}
          fields={editFields}
          onSave={handleSave}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </PageWrapper>
  )
}
