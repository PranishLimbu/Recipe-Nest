import PageWrapper from '../components/layout/PageWrapper'
import BlogCard from '../components/cards/BlogCard'
import HeroBanner from '../components/ui/HeroBanner'
import { useBlogList } from '../services/blogs'

export default function Blog() {
  const { data: posts = [], isLoading, isError } = useBlogList()

  return (
    <PageWrapper background="#faf8f5">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeInDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInUp   { from { opacity:0; transform:translateY(24px);  } to { opacity:1; transform:translateY(0); } }
        .blog-grid > *:nth-child(1) { animation: fadeInUp 0.5s 0.05s ease both; }
        .blog-grid > *:nth-child(2) { animation: fadeInUp 0.5s 0.12s ease both; }
        .blog-grid > *:nth-child(3) { animation: fadeInUp 0.5s 0.19s ease both; }
        .blog-grid > *:nth-child(4) { animation: fadeInUp 0.5s 0.26s ease both; }
        .blog-grid > *:nth-child(5) { animation: fadeInUp 0.5s 0.33s ease both; }
        .blog-grid > *:nth-child(6) { animation: fadeInUp 0.5s 0.40s ease both; }
        @media (max-width: 768px)  { .blog-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 1024px) and (min-width: 769px) { .blog-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>

      <HeroBanner
        title="From The Kitchen"
        subtitle="Stories, techniques, and inspiration from our community of chefs"
      />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px' }}>
        {isLoading ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            Loading blogs...
          </p>
        ) : isError ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            Unable to load blogs right now.
          </p>
        ) : posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontFamily: 'sans-serif', fontSize: 16 }}>
            No blogs found.
          </p>
        ) : (
          <div className="blog-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32,
          }}>
            {posts.map((post) => (
              <BlogCard key={post.id || post._id || post.blogId} post={post} />
            ))}
          </div>
        )}
      </main>
    </PageWrapper>
  )
}
