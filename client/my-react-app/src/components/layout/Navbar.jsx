import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../../constants/nav";
import { TokenService } from "../../utils/tokenServices";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const tokenDetails = TokenService.getTokenDetails();
  const isStaff = tokenDetails?.role === "chef" || tokenDetails?.role === "admin";
  const visibleLinks = NAV_LINKS.filter((link) => !link.staffOnly || isStaff);

  return (
    <>
      <style>{`
        .nav-link-item {
          color: #d4c5b0;
          text-decoration: none;
          padding: 7px 18px;
          font-size: 14px;
          font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
          border-radius: 40px;
          border: 1px solid transparent;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          letter-spacing: 0.04em;
        }
        .nav-link-item:hover, .nav-link-item.active {
          background: #2e2a24;
          border-color: #4a433a;
          color: #fff;
        }
        @media (max-width: 768px) {
          .nav-desktop  { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      <nav
        style={{
          background: "#1a1612",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily:
              "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
            fontSize: 26,
            color: "#E8622A",
            fontStyle: "italic",
            textDecoration: "none",
            letterSpacing: "-0.01em",
            flexShrink: 0,
          }}
        >
          Recipe Nest
        </Link>

        <div
          className="nav-desktop"
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            borderRadius: "12px",
          }}
        >
          {visibleLinks.map((link) => {
            const label = tokenDetails?.role === "chef" && link.path === "/Staff" ? "Chef Profile" : link.label;

            return (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link-item${location.pathname === link.path ? " active" : ""}`}
            >
              {label}
            </Link>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/SignIn" style={{ display: "flex", color: "#d4c5b0", padding: 6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>

          {sessionStorage.getItem("image") && (
            <img
              src={sessionStorage.getItem("image")}
              alt="User"
              width="32"
              height="32"
              style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #d4c5b0" }}
            />
          )}

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#d4c5b0",
              flexDirection: "column",
              gap: 5,
              padding: 4,
            }}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: "#d4c5b0",
                  borderRadius: 2,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            background: "#1a1612",
            padding: "12px 24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {visibleLinks.map((link) => {
            const label = tokenDetails?.role === "chef" && link.path === "/Staff" ? "Chef Profile" : link.label;

            return (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link-item${location.pathname === link.path ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
              style={{ display: "block" }}
            >
              {label}
            </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
