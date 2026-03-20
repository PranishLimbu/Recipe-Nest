import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;600&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .signin-page {
    font-family: 'Lato', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fce8dc;
  }

  /* NAV */
  .nav {
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-logo {
    font-family: 'Playfair Display', serif;
    color: #f5e6d0;
    font-size: 1.4rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 0.5rem;
    list-style: none;
  }

  .nav-links a {
    color: #c8a882;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    background: transparent;
    transition: background 0.2s;
  }

  .nav-links a.active,
  .nav-links a:hover {
    background: #2e2e2e;
    color: #e0c9af;
  }

  .nav-icon {
    color: #f5e6d0;
    cursor: pointer;
    font-size: 1.3rem;
  }

  /* MAIN SPLIT LAYOUT */
  .main-content {
    display: flex;
    flex: 1;
  }

  /* LEFT PANEL */
  .left-panel {
    background: #f05a1a;
    flex: 0 0 48%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 3rem;
  }

  .left-inner {
    max-width: 400px;
    text-align: center;
    color: #fff;
  }

  .hero-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 4vw, 3.2rem);
    font-weight: 400;
    line-height: 1.15;
    margin-bottom: 1.5rem;
  }

  .hero-heading .highlight {
    color: #fbbf24;
    font-style: italic;
  }

  .hero-subtext {
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.7;
    opacity: 0.92;
    margin-bottom: 2.5rem;
  }

  .feature-list {
    list-style: none;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .feature-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
    font-weight: 400;
    opacity: 0.95;
  }

  .feature-list li .icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  /* RIGHT PANEL */
  .right-panel {
    flex: 1;
    background: #fce8dc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 3rem;
  }

  .signin-card {
    width: 100%;
    max-width: 400px;
  }

  .signin-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    font-weight: 400;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
  }

  .signup-prompt {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 1.8rem;
  }

  .signup-prompt a {
    color: #e05a10;
    text-decoration: none;
    font-weight: 600;
  }

  .signup-prompt a:hover {
    text-decoration: underline;
  }

  /* SOCIAL BUTTONS */
  .social-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .social-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .social-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .social-btn svg {
    width: 22px;
    height: 22px;
  }

  /* DIVIDER */
  .divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: #ccc;
  }

  .divider-text {
    font-size: 0.82rem;
    color: #888;
    white-space: nowrap;
  }

  /* FORM */
  .form-group {
    margin-bottom: 1.2rem;
  }

  .form-label {
    display: block;
    font-size: 0.88rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.4rem;
  }

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
    box-shadow: 0 0 0 3px rgba(240, 90, 26, 0.12);
  }

  /* SUBMIT */
  .submit-btn {
    width: 100%;
    margin-top: 1rem;
    padding: 0.85rem;
    background: #f05a1a;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: 'Lato', sans-serif;
    font-weight: 600;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .submit-btn:hover {
    background: #d44d12;
    transform: translateY(-1px);
  }

  .submit-btn:active {
    transform: translateY(0);
  }

  /* FOOTER */
  .footer {
    background: #2a2a2a;
    color: #888;
    text-align: center;
    font-size: 0.82rem;
    padding: 1.1rem;
  }

  @media (max-width: 768px) {
    .main-content {
      flex-direction: column;
    }
    .left-panel {
      flex: none;
      padding: 3rem 2rem;
    }
    .nav-links { display: none; }
  }
`;

// Social icons inline SVGs
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.1 29.53 1 24 1 14.82 1 7.02 6.55 3.44 14.34l7.1 5.52C12.3 13.76 17.69 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.52 24.5c0-1.56-.14-3.06-.4-4.5H24v9h12.67c-.55 2.9-2.2 5.36-4.67 7.02l7.19 5.58C43.93 37.27 46.52 31.37 46.52 24.5z"/>
    <path fill="#FBBC05" d="M10.54 28.14A14.5 14.5 0 0 1 9.5 24c0-1.44.2-2.84.54-4.14l-7.1-5.52A23.98 23.98 0 0 0 0 24c0 3.88.93 7.55 2.57 10.8l7.97-6.66z"/>
    <path fill="#34A853" d="M24 47c5.53 0 10.17-1.83 13.56-4.97l-7.19-5.58c-1.88 1.26-4.29 2.05-6.37 2.05-6.31 0-11.7-4.26-13.46-9.96l-7.97 6.66C7.02 41.45 14.82 47 24 47z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 48 48">
    <path fill="#1877F2" d="M48 24C48 10.75 37.25 0 24 0S0 10.75 0 24c0 11.98 8.78 21.9 20.25 23.71V30.94h-6.09V24h6.09v-5.28c0-6.01 3.58-9.33 9.06-9.33 2.63 0 5.38.47 5.38.47v5.91h-3.03c-2.99 0-3.92 1.85-3.92 3.75V24h6.67l-1.07 6.94h-5.6v16.77C39.22 45.9 48 35.98 48 24z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 48 48">
    <path d="M38.4 10.2a11.2 11.2 0 0 1-7.8-7.8h-6.3v24.2a5.3 5.3 0 0 1-5.3 5.1 5.3 5.3 0 0 1-5.3-5.3 5.3 5.3 0 0 1 5.3-5.3c.5 0 1 .07 1.4.2V15a11.6 11.6 0 0 0-1.4-.09A11.6 11.6 0 0 0 7.4 26.5a11.6 11.6 0 0 0 11.6 11.6 11.6 11.6 0 0 0 11.6-11.6V16.1a17.3 17.3 0 0 0 10.1 3.2V13a11.3 11.3 0 0 1-2.3-.8z"/>
  </svg>
);

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log("Sign in:", { email, password });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="signin-page">
        {/* Navbar */}
        <nav className="nav">
          <a href="/" className="nav-logo">Recipe Nest</a>
          <ul className="nav-links">
            <li><a href="/home">Home</a></li>
            <li><a href="/chefs" className="active">Chefs</a></li>
            <li><a href="/recipe" className="active">Recipe</a></li>
            <li><a href="/blog" className="active">Blog</a></li>
            <li><a href="/about" className="active">About</a></li>
          </ul>
          <span className="nav-icon">👤</span>
        </nav>

        {/* Main Split */}
        <div className="main-content">
          {/* Left Panel */}
          <div className="left-panel">
            <div className="left-inner">
              <h1 className="hero-heading">
                Find your perfect{" "}
                <span className="highlight">Culinary</span>{" "}
                Match
              </h1>
              <p className="hero-subtext">
                Sign in to access thousands of curated recipes, connect with
                world-class chefs, and bring restaurant-quality meals to your
                kitchen.
              </p>
              <ul className="feature-list">
                <li><span className="icon">🍽️</span> Connect with 500+ professional chefs</li>
                <li><span className="icon">🫙</span> Access 12,000+ curated recipes</li>
                <li><span className="icon">⭐</span> Save favourites &amp; build your cookbook</li>
                <li><span className="icon">🎓</span> Learn techniques from Michelin-star chefs</li>
              </ul>
            </div>
          </div>

          {/* Right Panel */}
          <div className="right-panel">
            <div className="signin-card">
              <h2 className="signin-title">Sign in</h2>
              <p className="signup-prompt">
                Don't have an account?{" "}
                <a href="/signup">create one for free</a>
              </p>

              {/* Social Buttons */}
              <div className="social-buttons">
                <button className="social-btn" aria-label="Sign in with Google">
                  <GoogleIcon />
                </button>
                <button className="social-btn" aria-label="Sign in with Facebook">
                  <FacebookIcon />
                </button>
                <button className="social-btn" aria-label="Sign in with TikTok">
                  <TikTokIcon />
                </button>
              </div>

              {/* Divider */}
              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">or continue with email</span>
                <div className="divider-line" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Sign in to Recipe Nest
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          2026 Recipe Nest. all rights reserved
        </footer>
      </div>
    </>
  );
}