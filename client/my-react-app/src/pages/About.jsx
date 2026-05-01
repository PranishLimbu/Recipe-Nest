import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { teamMembers } from '../data/chefs'
import TeamCard from '../components/cards/TeamCard'



const stats = [
  { value: '500+',  label: 'Professional Chefs' },
  { value: '12,000+', label: 'Curated Recipes' },
  { value: '80+',   label: 'Cuisines Covered' },
  { value: '2M+',   label: 'Happy Cooks' },
]

const values = [
  { icon: '🌿', title: 'Authenticity First',  desc: 'Every recipe is sourced directly from chefs who have cooked these dishes their entire lives. No shortcuts, no compromises.' },
  { icon: '🤝', title: 'Community Driven',    desc: 'Recipe Nest is built on the contributions of our chef community. Their stories, techniques, and passion fuel everything we do.' },
  { icon: '🎓', title: 'Always Learning',     desc: 'From beginner home cooks to seasoned professionals, we believe great cooking is a lifelong journey worth celebrating.' },
  { icon: '🏔️', title: 'Rooted in Nepal',    desc: 'Born in Kathmandu, we take pride in championing Himalayan flavours and sharing them with kitchens around the world.' },
]

export default function About() {
  return (
    <PageWrapper background="#faf8f5">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeInDown { from { opacity:0; transform:translateY(-18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn     { from { opacity:0; } to { opacity:1; } }
        .cta-btn {
          display: inline-block; background: #fff; color: #E8622A;
          font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 700;
          padding: 12px 32px; border-radius: 30px; text-decoration: none;
          letter-spacing: 0.04em; border: 2px solid #fff;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .cta-btn:hover { background: transparent; color: #fff; transform: translateY(-2px); }
        .cta-btn-outline {
          display: inline-block; background: transparent; color: #fff;
          font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 700;
          padding: 12px 32px; border-radius: 30px; text-decoration: none;
          letter-spacing: 0.04em; border: 2px solid rgba(255,255,255,0.6);
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .cta-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; transform: translateY(-2px); }
        @media (max-width: 768px) {
          .about-team-grid   { grid-template-columns: 1fr !important; }
          .about-values-grid { grid-template-columns: 1fr !important; }
          .about-stats-row   { grid-template-columns: repeat(2,1fr) !important; }
          .about-story-split { flex-direction: column !important; }
          .about-story-img   { max-width: 100% !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .about-team-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .about-values-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #E8622A 0%, #d45520 60%, #c04918 100%)',
        padding: '80px 40px 90px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)', pointerEvents:'none' }} />
        <p style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:'rgba(255,255,255,0.7)', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:16, position:'relative' }}>
          Our Story
        </p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(40px,6vw,64px)', fontWeight:400, color:'#fff', lineHeight:1.1, marginBottom:20, position:'relative', animation:'fadeInDown 0.7s ease both' }}>
          Born in the Heart of<br />the Himalayas
        </h1>
        <p style={{ fontFamily:"'Lato',sans-serif", fontSize:16, color:'rgba(255,255,255,0.88)', lineHeight:1.8, maxWidth:560, margin:'0 auto 36px', position:'relative', animation:'fadeInDown 0.7s 0.2s ease both' }}>
          Recipe Nest was founded in Kathmandu with a single belief — that the world deserves to taste the depth, warmth, and heritage of Himalayan cooking.
        </p>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', position:'relative', animation:'fadeInDown 0.7s 0.28s ease both' }}>
          <Link to="/Recipe" className="cta-btn">Explore Recipes</Link>
          <Link to="/Chefs" className="cta-btn-outline">Meet the Chefs</Link>
        </div>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ position:'absolute', bottom:-1, left:0, width:'100%', display:'block' }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#faf8f5" />
        </svg>
      </section>

      {/* Stats */}
      <section style={{ background:'#fff', padding:'60px 40px' }}>
        <div className="about-stats-row" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, maxWidth:960, margin:'0 auto' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign:'center', padding:'28px 16px', borderRadius:12, background:'#faf8f5', animation:'fadeIn 0.6s ease both', animationDelay:`${i*0.1}s` }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:44, fontWeight:600, color:'#E8622A', margin:'0 0 6px', lineHeight:1 }}>{s.value}</p>
              <p style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:'#888', letterSpacing:'0.05em', textTransform:'uppercase', margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section style={{ padding:'80px 60px', maxWidth:1200, margin:'0 auto' }}>
        <div className="about-story-split" style={{ display:'flex', gap:60, alignItems:'center' }}>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:'#E8622A', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:12, fontWeight:700 }}>Who We Are</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,4vw,46px)', fontWeight:400, color:'#1a1a1a', lineHeight:1.2, marginBottom:24 }}>
              A platform built by chefs, for everyone
            </h2>
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:15, color:'#555', lineHeight:1.85, marginBottom:20 }}>
              What started as a small community of Nepali chefs sharing recipes online has grown into a global platform connecting over 500 professional cooks with millions of home kitchens.
            </p>
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:15, color:'#555', lineHeight:1.85, marginBottom:32 }}>
              We believe that food is the most honest expression of culture. Our mission is to make sure those expressions — from the humble dhido of a mountain village to the elaborate momos of a Kathmandu restaurant — are preserved, celebrated, and shared.
            </p>
            <Link to="/Chefs" style={{ display:'inline-block', background:'#E8622A', color:'#fff', fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, padding:'12px 32px', borderRadius:30, textDecoration:'none', letterSpacing:'0.04em' }}>
              Meet Our Chefs
            </Link>
          </div>
          <div className="about-story-img" style={{ flex:'0 0 440px', maxWidth:440 }}>
            <div style={{ borderRadius:16, overflow:'hidden', position:'relative' }}>
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" alt="Chefs cooking" style={{ width:'100%', height:420, objectFit:'cover', display:'block' }} onError={(e) => { e.target.src='https://placehold.co/440x420/333/fff?text=Kitchen' }} />
              <div style={{ position:'absolute', bottom:24, left:24, background:'rgba(26,22,18,0.88)', borderRadius:10, padding:'14px 20px' }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:'#fff', margin:'0 0 2px', fontStyle:'italic' }}>"Food is memory. Food is love."</p>
                <p style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:'#d4c5b0', margin:0 }}>— Pranish Limbu, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background:'#fff', padding:'80px 60px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <p style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:'#E8622A', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:12, fontWeight:700 }}>What We Stand For</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(30px,4vw,44px)', fontWeight:400, color:'#1a1a1a' }}>Our Values</h2>
          </div>
          <div className="about-values-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:28 }}>
            {values.map((v, i) => (
              <div key={i} style={{ padding:'32px 24px', borderRadius:12, background:'#faf8f5', borderTop:'3px solid #E8622A', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                <span style={{ fontSize:32, display:'block', marginBottom:16 }}>{v.icon}</span>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:'#1a1a1a', margin:'0 0 10px' }}>{v.title}</h3>
                <p style={{ fontFamily:"'Lato',sans-serif", fontSize:13, color:'#666', lineHeight:1.75, margin:0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding:'80px 60px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:'#E8622A', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:12, fontWeight:700 }}>The People Behind the Platform</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(30px,4vw,44px)', fontWeight:400, color:'#1a1a1a' }}>Meet the Team</h2>
        </div>
        <div className="about-team-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32 }}>
          {teamMembers.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background:'linear-gradient(135deg,#1a1612 0%,#2e2520 100%)', padding:'80px 40px', textAlign:'center' }}>
        <p style={{ fontFamily:"'Lato',sans-serif", fontSize:12, color:'#E8622A', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:16, fontWeight:700 }}>Join the Community</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,5vw,52px)', fontWeight:400, color:'#fff', lineHeight:1.15, marginBottom:20 }}>
          Ready to cook something <span style={{ color:'#E8622A', fontStyle:'italic' }}>extraordinary?</span>
        </h2>
        <p style={{ fontFamily:"'Lato',sans-serif", fontSize:15, color:'#a09585', lineHeight:1.8, maxWidth:500, margin:'0 auto 36px' }}>
          Sign up for free and get instant access to thousands of recipes from our community of world-class chefs.
        </p>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/SignIn" style={{ display:'inline-block', background:'#E8622A', color:'#fff', fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, padding:'13px 36px', borderRadius:30, textDecoration:'none', border:'2px solid #E8622A' }}>
            Get Started Free
          </Link>
          <Link to="/Recipe" style={{ display:'inline-block', background:'transparent', color:'#d4c5b0', fontFamily:"'Lato',sans-serif", fontSize:14, fontWeight:700, padding:'13px 36px', borderRadius:30, textDecoration:'none', border:'2px solid #4a433a' }}>
            Browse Recipes
          </Link>
        </div>
      </section>
    </PageWrapper>
  )
}
