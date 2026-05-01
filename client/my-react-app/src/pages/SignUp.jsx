import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useQueryClient } from '@tanstack/react-query'
import { authTokenKey } from '../services/login'
import { useRegisterMutation } from '../services/register'
import { httpClient } from '../lib/axios'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, TokenService } from '../utils/tokenServices'


const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="20" height="20">
    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.1 29.53 1 24 1 14.82 1 7.02 6.55 3.44 14.34l7.1 5.52C12.3 13.76 17.69 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.52 24.5c0-1.56-.14-3.06-.4-4.5H24v9h12.67c-.55 2.9-2.2 5.36-4.67 7.02l7.19 5.58C43.93 37.27 46.52 31.37 46.52 24.5z"/>
    <path fill="#FBBC05" d="M10.54 28.14A14.5 14.5 0 0 1 9.5 24c0-1.44.2-2.84.54-4.14l-7.1-5.52A23.98 23.98 0 0 0 0 24c0 3.88.93 7.55 2.57 10.8l7.97-6.66z"/>
    <path fill="#34A853" d="M24 47c5.53 0 10.17-1.83 13.56-4.97l-7.19-5.58c-1.88 1.26-4.29 2.05-6.37 2.05-6.31 0-11.7-4.26-13.46-9.96l-7.97 6.66C7.02 41.45 14.82 47 24 47z"/>
  </svg>
)

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['#e8d5c8', '#e05a10', '#f59e0b', '#84cc16', '#22c55e']

  if (!password) return null
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4].map(n => (
          <div
            key={n}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: n <= score ? colors[score] : '#e8d5c8',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: '0.78rem', color: colors[score], fontFamily: "'Lato', sans-serif", fontWeight: 600 }}>
        {labels[score]}
      </span>
    </div>
  )
}

export default function SignUp() {
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [role, setRole]               = useState('user')
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed]           = useState(false)
  const [errors, setErrors]           = useState({})
  const [googleLoading, setGoogleLoading] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const registerMutation = useRegisterMutation()

  useEffect(() => {
    TokenService.logout()
    sessionStorage.removeItem('image')
    queryClient.setQueriesData({ queryKey: [authTokenKey] }, () => false)
  }, [queryClient])

  const handleGoogleSignIn = async () => {
  setGoogleLoading(true)
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  const auth = getAuth(app)

  try {
    const result = await signInWithPopup(auth, provider)
    const idToken = await result.user.getIdToken()

    const { data: googleData } = await httpClient.post('/api/auth/google', { token: idToken })

    if (googleData.success) {
      if (googleData.picture) sessionStorage.setItem('image', googleData.picture)

      let tokenValue = null

      try {
        const registerRoute = role === 'chef'
          ? '/api/auth/register-chef'
          : role === 'admin'
            ? '/api/auth/register-admin'
            : '/api/auth/register'

        const registerRes = await httpClient.post(registerRoute, {
          name: googleData.name,
          email: googleData.email,
          password: googleData.uid + '_google'
        })
        tokenValue = registerRes.data.token
      } catch {
        const loginRes = await httpClient.post('/api/auth/login', {
          email: googleData.email,
          password: googleData.uid + '_google'
        })
        tokenValue = loginRes.data.token
      }

      TokenService.setToken({ key: ACCESS_TOKEN_KEY, value: tokenValue })
      TokenService.setToken({ key: REFRESH_TOKEN_KEY, value: '' })
      queryClient.setQueriesData({ queryKey: [authTokenKey] }, () => true)
      navigate('/')
    }

  } catch (error) {
    console.error(error)
    alert(error?.response?.data?.error ?? error?.response?.data?.message ?? 'Google sign-in failed')
  } finally {
    setGoogleLoading(false)
  }
}

  const validate = () => {
    const e = {}
    if (!name.trim())                  e.name     = 'Full name is required.'
    if (!/\S+@\S+\.\S+/.test(email))   e.email    = 'Enter a valid email address.'
    if (password.length < 8)           e.password = 'Password must be at least 8 characters.'
    if (password !== confirm)          e.confirm  = 'Passwords do not match.'
    if (!agreed)                       e.agreed   = 'Please accept the terms to continue.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      registerMutation.mutate({ name, email, password, role })
    }
  }

  const field = (id, label, value, setter, type = 'text', extra = {}) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label
        htmlFor={id}
        style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333', marginBottom: '0.4rem', fontFamily: "'Lato', sans-serif", letterSpacing: '0.03em' }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="form-input"
        value={value}
        onChange={e => setter(e.target.value)}
        {...extra}
      />
      {errors[id] && (
        <p style={{ margin: '5px 0 0', fontSize: '0.78rem', color: '#e05a10', fontFamily: "'Lato', sans-serif" }}>
          {errors[id]}
        </p>
      )}
    </div>
  )

  const roleSelector = (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333', marginBottom: '0.4rem', fontFamily: "'Lato', sans-serif", letterSpacing: '0.03em' }}>
        Account Type
      </label>
      <div className="role-grid" role="radiogroup" aria-label="Account type">
        {[
          ['user', 'User'],
          ['chef', 'Chef'],
          ['admin', 'Admin'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`role-option${role === value ? ' active' : ''}`}
            onClick={() => setRole(value)}
            role="radio"
            aria-checked={role === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )

  const passwordMatch = confirm && password === confirm

  return (
    <PageWrapper background="#fce8dc">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .form-input {
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1.5px solid #e8d5c8;
          border-radius: 8px;
          background: #fff8f4;
          font-size: 0.95rem;
          font-family: 'Lato', sans-serif;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          border-color: #f05a1a;
          box-shadow: 0 0 0 3px rgba(240,90,26,0.12);
        }
        .form-input.error {
          border-color: #e05a10;
          background: #fff5f0;
        }
        .form-input.valid {
          border-color: #22c55e;
        }

        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0.75rem 1rem;
          background: #fff;
          border: 1.5px solid #e8d5c8;
          border-radius: 8px;
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
          letter-spacing: 0.02em;
        }
        .google-btn:hover {
          background: #fdf4ef;
          border-color: #f05a1a;
          box-shadow: 0 2px 10px rgba(240,90,26,0.1);
        }
        .google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pass-wrapper { position: relative; }
        .pass-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .pass-toggle:hover { color: #f05a1a; }

        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.55rem;
          margin-bottom: 1.25rem;
        }
        .role-option {
          border: 1.5px solid #e8d5c8;
          border-radius: 8px;
          background: #fff8f4;
          color: #333;
          cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          padding: 0.7rem 0.35rem;
          transition: border-color 0.2s, background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .role-option:hover {
          border-color: #f05a1a;
          box-shadow: 0 2px 10px rgba(240,90,26,0.1);
        }
        .role-option.active {
          background: #f05a1a;
          border-color: #f05a1a;
          color: #fff;
        }

        .submit-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.85rem;
          background: #f05a1a;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
        }
        .submit-btn:hover {
          background: #d94f12;
          box-shadow: 0 4px 16px rgba(240,90,26,0.3);
        }
        .submit-btn:active { transform: scale(0.99); }

        .check-box {
          width: 16px;
          height: 16px;
          border: 1.5px solid #e8d5c8;
          border-radius: 4px;
          background: #fff8f4;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
          transition: background 0.15s, border-color 0.15s;
          position: relative;
        }
        .check-box:checked {
          background: #f05a1a;
          border-color: #f05a1a;
        }
        .check-box:checked::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 5px;
          height: 9px;
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(42deg);
        }

        @media (max-width: 768px) {
          .signup-split { flex-direction: column !important; }
          .signup-left  { flex: none !important; padding: 3rem 2rem !important; }
        }
      `}</style>

      <div className="signup-split" style={{ display: 'flex', minHeight: 'calc(100vh - 108px)' }}>

        {/* ── Left panel ── */}
        <div
          className="signup-left"
          style={{ background: '#f05a1a', flex: '0 0 44%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 3rem' }}
        >
          <div style={{ maxWidth: 380, textAlign: 'center', color: '#fff' }}>
            <div style={{ marginBottom: '1.8rem' }}>
              <span style={{ fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", fontSize: 32, color: '#fff', fontStyle: 'italic', letterSpacing: '-0.01em' }}>
                Recipe Nest
              </span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.15, marginBottom: '1.4rem' }}>
              Your culinary journey{' '}
              <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>starts here</span>
            </h1>
            <p style={{ fontSize: '0.92rem', fontWeight: 300, lineHeight: 1.75, opacity: 0.92, marginBottom: '2.5rem' }}>
              Join a community of passionate home cooks and world-class chefs. Discover, save, and share the recipes that define you.
            </p>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center', marginBottom: '2.5rem' }}>
              {[['12,000+', 'Recipes'], ['500+', 'Chefs'], ['4.8★', 'Rated'], ['Free', 'Forever']].map(([num, lbl]) => (
                <div key={lbl} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.9rem 0.5rem' }}>
                  <div style={{ fontSize: '1.35rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, marginBottom: 2 }}>{num}</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.85, fontFamily: "'Lato', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}>{lbl}</div>
                </div>
              ))}
            </div>

            <ul style={{ listStyle: 'none', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                ['🍴', 'Build your personal recipe collection'],
                ['👨‍🍳', 'Follow your favourite chefs'],
                ['📖', 'Post your own recipes & blogs'],
              ].map(([icon, text]) => (
                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.92rem', opacity: 0.95 }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ flex: 1, background: '#fce8dc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>

            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.4rem' }}>
              Create account
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '1.8rem', fontFamily: "'Lato', sans-serif" }}>
              Already have one?{' '}
              <Link to="/SignIn" style={{ color: '#e05a10', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
            </p>

            {roleSelector}

            {/* Google button */}
            <button className="google-btn" onClick={handleGoogleSignIn} disabled={googleLoading}>
              <GoogleIcon />
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.4rem 0' }}>
              <div style={{ flex: 1, height: 1, background: '#d4bfb4' }} />
              <span style={{ fontSize: '0.8rem', color: '#999', whiteSpace: 'nowrap', fontFamily: "'Lato', sans-serif" }}>or sign up with email</span>
              <div style={{ flex: 1, height: 1, background: '#d4bfb4' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Full name */}
              {field('name', 'Full Name', name, setName, 'text', { placeholder: 'e.g. Maria Rossi', className: `form-input${errors.name ? ' error' : ''}` })}

              {/* Email */}
              {field('email', 'Email Address', email, setEmail, 'email', { placeholder: 'chef@example.com', className: `form-input${errors.email ? ' error' : ''}` })}

              {/* Password */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333', marginBottom: '0.4rem', fontFamily: "'Lato', sans-serif", letterSpacing: '0.03em' }}>
                  Password
                </label>
                <div className="pass-wrapper">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    className={`form-input${errors.password ? ' error' : ''}`}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    style={{ paddingRight: '2.4rem' }}
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                <PasswordStrength password={password} />
                {errors.password && (
                  <p style={{ margin: '5px 0 0', fontSize: '0.78rem', color: '#e05a10', fontFamily: "'Lato', sans-serif" }}>{errors.password}</p>
                )}
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="confirm" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333', marginBottom: '0.4rem', fontFamily: "'Lato', sans-serif", letterSpacing: '0.03em' }}>
                  Confirm Password
                </label>
                <div className="pass-wrapper">
                  <input
                    id="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className={`form-input${errors.confirm ? ' error' : passwordMatch ? ' valid' : ''}`}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    style={{ paddingRight: '2.4rem' }}
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {passwordMatch && (
                  <p style={{ margin: '5px 0 0', fontSize: '0.78rem', color: '#22c55e', fontFamily: "'Lato', sans-serif" }}>✓ Passwords match</p>
                )}
                {errors.confirm && (
                  <p style={{ margin: '5px 0 0', fontSize: '0.78rem', color: '#e05a10', fontFamily: "'Lato', sans-serif" }}>{errors.confirm}</p>
                )}
              </div>

              {/* Terms */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    className="check-box"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                  />
                  <span style={{ fontSize: '0.83rem', color: '#555', fontFamily: "'Lato', sans-serif", lineHeight: 1.5 }}>
                    I agree to Recipe Nest's{' '}
                    <Link to="/terms" style={{ color: '#e05a10', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy" style={{ color: '#e05a10', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreed && (
                  <p style={{ margin: '5px 0 0 26px', fontSize: '0.78rem', color: '#e05a10', fontFamily: "'Lato', sans-serif" }}>{errors.agreed}</p>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? 'Creating Account...' : 'Create My Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
