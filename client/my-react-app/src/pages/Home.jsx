import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;600&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .home-page {
    font-family: 'Lato', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
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

  /* HERO */
  .hero {
    background: #f05a1a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5rem 5rem 5rem 5rem;
    gap: 3rem;
    min-height: 560px;
  }

  .hero-left {
    flex: 1;
    color: #fff;
    max-width: 500px;
  }

  .hero-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.6rem, 4.5vw, 3.8rem);
    font-weight: 400;
    line-height: 1.12;
    margin-bottom: 1.5rem;
  }

  .hero-heading .highlight {
    color: #fbbf24;
    font-style: italic;
  }

  .hero-subtext {
    font-size: 0.97rem;
    font-weight: 300;
    line-height: 1.7;
    opacity: 0.92;
    margin-bottom: 2.2rem;
    max-width: 420px;
  }

  .search-bar {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    max-width: 420px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    font-family: 'Lato', sans-serif;
    color: #333;
    background: transparent;
  }

  .search-input::placeholder {
    color: #aaa;
  }

  .search-btn {
    background: #f05a1a;
    color: #fff;
    border: none;
    padding: 0.75rem 1.3rem;
    font-size: 0.9rem;
    font-family: 'Lato', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .search-btn:hover {
    background: #d44d12;
  }

  .hero-right {
    flex: 0 0 48%;
    max-width: 560px;
  }

  .hero-image {
    width: 100%;
    height: 340px;
    object-fit: cover;
    border-radius: 4px;
    display: block;
  }

  .hero-image-placeholder {
    width: 100%;
    height: 340px;
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.5);
    font-size: 0.9rem;
    letter-spacing: 0.05em;
  }

  /* CHEFS SECTION */
  .chefs-section {
    padding: 3.5rem 3rem 4rem;
    background: #fff;
  }

  .chefs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .chef-card {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .chef-image {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    border-radius: 4px 4px 0 0;
    display: block;
  }

  .chef-image-placeholder {
    width: 100%;
    aspect-ratio: 4/3;
    background: #e0cfc8;
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    font-size: 0.85rem;
  }

  .chef-info {
    padding: 0.8rem 0 0.2rem;
  }

  .chef-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: #1a1a1a;
    margin-bottom: 0.15rem;
  }

  .chef-cuisine {
    font-size: 0.82rem;
    font-weight: 600;
    color: #f05a1a;
    margin-bottom: 0.35rem;
  }

  .chef-stars {
    color: #f05a1a;
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
    letter-spacing: 1px;
  }

  .chef-bio {
    font-size: 0.82rem;
    color: #555;
    line-height: 1.55;
    font-weight: 300;
  }

  /* FOOTER */
  .footer {
    background: #2a2a2a;
    color: #888;
    text-align: center;
    font-size: 0.82rem;
    padding: 1.1rem;
    margin-top: auto;
  }

  @media (max-width: 1024px) {
    .chefs-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .hero {
      flex-direction: column;
      padding: 3rem 2rem;
      min-height: auto;
    }
    .hero-right {
      flex: none;
      width: 100%;
      max-width: 100%;
    }
    .chefs-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .nav-links { display: none; }
    .chefs-section { padding: 2.5rem 1.5rem; }
  }

  @media (max-width: 480px) {
    .chefs-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const chefs = [
  {
    id: 1,
    name: "Pranish Limbu",
    cuisine: "Nepali Cuisine",
    stars: 5,
    bio: "Award-winning chef with 15 years in Michelin-starred restaurants across Kathmandu and Lalitpur.",
    image: null,
  },
  {
    id: 2,
    name: "Pranish Limbu",
    cuisine: "Nepali Cuisine",
    stars: 4,
    bio: "Award-winning chef with 15 years in Michelin-starred restaurants across Kathmandu and Lalitpur.",
    image: null,
  },
  {
    id: 3,
    name: "Pranish Limbu",
    cuisine: "Nepali Cuisine",
    stars: 4,
    bio: "Award-winning chef with 15 years in Michelin-starred restaurants across Kathmandu and Lalitpur.",
    image: null,
  },
  {
    id: 4,
    name: "Pranish Limbu",
    cuisine: "Nepali Cuisine",
    stars: 5,
    bio: "Award-winning chef with 15 years in Michelin-starred restaurants across Kathmandu and Lalitpur.",
    image: null,
  },
];

function StarRating({ count }) {
  return (
    <div className="chef-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.25 }}>★</span>
      ))}
    </div>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Wire up your search logic here
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="home-page">

        {/* Navbar */}
        <nav className="nav">
          <a href="/" className="nav-logo">Recipe Nest</a>
          <ul className="nav-links">
            <li><a href="/home" className="active">Home</a></li>
            <li><a href="/chefs" className="active">Chefs</a></li>
            <li><a href="/recipe" className="active">Recipe</a></li>
            <li><a href="/blog" className="active">Blog</a></li>
            <li><a href="/about" className="active">About</a></li>
          </ul>
          <span className="nav-icon">👤</span>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-left">
            <h1 className="hero-heading">
              Find your<br />
              perfect <span className="highlight">Culinary</span><br />
              Match
            </h1>
            <p className="hero-subtext">
              Connect with professional chefs from around the world. Explore thousands
              of curated recipes and bring restaurant-quality meals to your kitchen.
            </p>
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search for chefs, recipes or cuisines"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          <div className="hero-right">
            {/* Replace src with your actual chef/kitchen image */}
            <div className="hero-image-placeholder">
              Chef image goes here
            </div>
            {/* Uncomment below and remove placeholder when you have an image:
            <img
              src="/images/hero-chef.jpg"
              alt="Professional chef at work"
              className="hero-image"
            /> */}
          </div>
        </section>

        {/* Chefs Section */}
        <section className="chefs-section">
          <div className="chefs-grid">
            {chefs.map((chef) => (
              <div className="chef-card" key={chef.id}>
                {chef.image ? (
                  <img src={chef.image} alt={chef.name} className="chef-image" />
                ) : (
                  <div className="chef-image-placeholder">Chef photo</div>
                )}
                <div className="chef-info">
                  <div className="chef-name">{chef.name}</div>
                  <div className="chef-cuisine">{chef.cuisine}</div>
                  <StarRating count={chef.stars} />
                  <p className="chef-bio">{chef.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          2026 Recipe Nest. all rights reserved
        </footer>

      </div>
    </>
  );
}