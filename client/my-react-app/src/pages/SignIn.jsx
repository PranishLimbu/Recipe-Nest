
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { useLoginMutation } from '../services/login'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, TokenService } from '../utils/tokenServices'
import { useQueryClient } from '@tanstack/react-query'
import { authTokenKey } from '../services/login'
import { API_ROUTS } from '../services/api'
import { httpClient } from '../lib/axios'

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="22" height="22">
    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.1 29.53 1 24 1 14.82 1 7.02 6.55 3.44 14.34l7.1 5.52C12.3 13.76 17.69 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.52 24.5c0-1.56-.14-3.06-.4-4.5H24v9h12.67c-.55 2.9-2.2 5.36-4.67 7.02l7.19 5.58C43.93 37.27 46.52 31.37 46.52 24.5z"/>
    <path fill="#FBBC05" d="M10.54 28.14A14.5 14.5 0 0 1 9.5 24c0-1.44.2-2.84.54-4.14l-7.1-5.52A23.98 23.98 0 0 0 0 24c0 3.88.93 7.55 2.57 10.8l7.97-6.66z"/>
    <path fill="#34A853" d="M24 47c5.53 0 10.17-1.83 13.56-4.97l-7.19-5.58c-1.88 1.26-4.29 2.05-6.37 2.05-6.31 0-11.7-4.26-13.46-9.96l-7.97 6.66C7.02 41.45 14.82 47 24 47z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 48 48" width="22" height="22">
    <path fill="#1877F2" d="M48 24C48 10.75 37.25 0 24 0S0 10.75 0 24c0 11.98 8.78 21.9 20.25 23.71V30.94h-6.09V24h6.09v-5.28c0-6.01 3.58-9.33 9.06-9.33 2.63 0 5.38.47 5.38.47v5.91h-3.03c-2.99 0-3.92 1.85-3.92 3.75V24h6.67l-1.07 6.94h-5.6v16.77C39.22 45.9 48 35.98 48 24z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 48 48" width="22" height="22">
    <path fill="#010101" d="M38.4 10.2a11.2 11.2 0 0 1-7.8-7.8h-6.3v24.2a5.3 5.3 0 0 1-5.3 5.1 5.3 5.3 0 0 1-5.3-5.3 5.3 5.3 0 0 1 5.3-5.3c.5 0 1 .07 1.4.2V15a11.6 11.6 0 0 0-1.4-.09A11.6 11.6 0 0 0 7.4 26.5a11.6 11.6 0 0 0 11.6 11.6 11.6 11.6 0 0 0 11.6-11.6V16.1a17.3 17.3 0 0 0 10.1 3.2V13a11.3 11.3 0 0 1-2.3-.8z"/>
  </svg>
)

export default function SignIn() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const loginMutation = useLoginMutation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    TokenService.logout()
    sessionStorage.removeItem('image')
    queryClient.setQueriesData({ queryKey: [authTokenKey] }, () => false)
  }, [queryClient])

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const auth = getAuth(app)

    try {
      // Step 1 — Firebase Google popup
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()

      // Step 2 — Verify token with our backend
      const googleRes = await httpClient.post('/api/auth/google', { token: idToken })
      const googleData = googleRes.data

      if (!googleData.success) throw new Error('Google verification failed')

      const { email: gEmail,picture, uid } = googleData
      const googlePassword = uid + '_google'

      let tokenValue = null

      // Step 3 — Try login first (returning user)
      try {
        const loginRes = await httpClient.post(API_ROUTS.LOGIN, {
          email: gEmail,
          password: googlePassword
        })
        tokenValue = loginRes.data.token
         if (picture) sessionStorage.setItem('image', picture)

      } catch {
        // Step 4 — If login fails, register (new user)
        const registerRes = await httpClient.post('/api/auth/register', {
          name: googleData.name,
          email: gEmail,
          password: googlePassword
        })
        tokenValue = registerRes.data.token
      }

      // Step 5 — Save token and redirect (same as useLoginMutation onSuccess)
      TokenService.setToken({ key: ACCESS_TOKEN_KEY, value: tokenValue })
      TokenService.setToken({ key: REFRESH_TOKEN_KEY, value: '' })
      queryClient.setQueriesData({ queryKey: [authTokenKey] }, () => true)
      navigate('/')

    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.message ?? 'Google sign-in failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <PageWrapper background="#fce8dc">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .form-input { width:100%; padding:0.7rem 1rem; border:1.5px solid #e8d5c8; border-radius:8px; background:#fff8f4; font-size:0.95rem; font-family:'Lato',sans-serif; color:#1a1a1a; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
        .form-input:focus { border-color:#f05a1a; box-shadow:0 0 0 3px rgba(240,90,26,0.12); }
        .social-btn { width:44px; height:44px; border-radius:50%; border:none; background:white; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.12); transition:transform 0.15s, box-shadow 0.15s; }
        .social-btn:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.15); }
        .social-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        @media (max-width: 768px) {
          .signin-split { flex-direction:column !important; }
          .signin-left  { flex:none !important; padding:3rem 2rem !important; }
        }
      `}</style>

      <div className="signin-split" style={{ display:'flex', minHeight:'calc(100vh - 108px)' }}>

        {/* Left panel */}
        <div className="signin-left" style={{ background:'#f05a1a', flex:'0 0 48%', display:'flex', alignItems:'center', justifyContent:'center', padding:'4rem 3rem' }}>
          <div style={{ maxWidth:400, textAlign:'center', color:'#fff' }}>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.4rem,4vw,3.2rem)', fontWeight:400, lineHeight:1.15, marginBottom:'1.5rem' }}>
              Find your perfect <span style={{ color:'#fbbf24', fontStyle:'italic' }}>Culinary</span> Match
            </h1>
            <p style={{ fontSize:'0.95rem', fontWeight:300, lineHeight:1.7, opacity:0.92, marginBottom:'2.5rem' }}>
              Sign in to access thousands of curated recipes, connect with world-class chefs, and bring restaurant-quality meals to your kitchen.
            </p>
            <ul style={{ listStyle:'none', textAlign:'left', display:'flex', flexDirection:'column', gap:'0.9rem' }}>
              {[
                ['🍽️', 'Connect with 500+ professional chefs'],
                ['🫙',  'Access 12,000+ curated recipes'],
                ['⭐',  'Save favourites & build your cookbook'],
                ['🎓', 'Learn techniques from Michelin-star chefs'],
              ].map(([icon, text]) => (
                <li key={text} style={{ display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'0.95rem', opacity:0.95 }}>
                  <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{icon}</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex:1, background:'#fce8dc', display:'flex', alignItems:'center', justifyContent:'center', padding:'4rem 3rem' }}>
          <div style={{ width:'100%', maxWidth:400 }}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2.6rem', fontWeight:400, color:'#1a1a1a', marginBottom:'0.5rem' }}>Sign in</h2>
            <p style={{ fontSize:'0.9rem', color:'#555', marginBottom:'1.8rem', fontFamily:"'Lato',sans-serif" }}>
              Don't have an account?{' '}
              <Link to="/SignUp" style={{ color:'#e05a10', textDecoration:'none', fontWeight:600 }}>create one for free</Link>
            </p>

            {/* Social buttons */}
            <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem' }}>
              <button
                className="social-btn"
                aria-label="Sign in with Google"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                title={googleLoading ? 'Signing in...' : 'Sign in with Google'}
              >
                {googleLoading
                  ? <span style={{ fontSize: '0.7rem', color: '#999' }}>...</span>
                  : <GoogleIcon />
                }
              </button>
              <button className="social-btn" aria-label="Sign in with Facebook"><FacebookIcon /></button>
              <button className="social-btn" aria-label="Sign in with TikTok"><TikTokIcon /></button>
            </div>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
              <div style={{ flex:1, height:1, background:'#ccc' }} />
              <span style={{ fontSize:'0.82rem', color:'#888', whiteSpace:'nowrap', fontFamily:"'Lato',sans-serif" }}>or continue with email</span>
              <div style={{ flex:1, height:1, background:'#ccc' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:'1.2rem' }}>
                <label style={{ display:'block', fontSize:'0.88rem', fontWeight:600, color:'#333', marginBottom:'0.4rem', fontFamily:"'Lato',sans-serif" }} htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ marginBottom:'1.2rem' }}>
                <label style={{ display:'block', fontSize:'0.88rem', fontWeight:600, color:'#333', marginBottom:'0.4rem', fontFamily:"'Lato',sans-serif" }} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                style={{ width:'100%', marginTop:'1rem', padding:'0.85rem', background:'#f05a1a', color:'#fff', border:'none', borderRadius:8, fontSize:'0.95rem', fontFamily:"'Lato',sans-serif", fontWeight:600, cursor: loginMutation.isPending ? 'not-allowed' : 'pointer', opacity: loginMutation.isPending ? 0.6 : 1 }}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign in to Recipe Nest'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
