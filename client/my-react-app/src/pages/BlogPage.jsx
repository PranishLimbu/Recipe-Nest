import { Link, useParams } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { useBlogProfile } from '../services/blogs'

const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x760/222/fff?text=Blog'

export default function BlogPage() {
  const { id } = useParams()
  const { data: blog, isLoading, isError } = useBlogProfile(id)

  const image = blog?.coverImage?.url || blog?.image || PLACEHOLDER_IMAGE
  const tags = Array.isArray(blog?.tags) ? blog.tags : []

  return (
    <PageWrapper background="#faf8f5">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; }
        .blog-view-shell { max-width: 980px; margin: 0 auto; padding: 48px 20px 84px; }
        .blog-view-card { background: #fff; border: 1px solid rgba(126, 88, 49, 0.14); border-radius: 18px; overflow: hidden; box-shadow: 0 18px 48px rgba(55, 34, 20, 0.1); }
        .blog-view-image { width: 100%; height: min(52vw, 480px); object-fit: cover; display: block; }
        .blog-view-body { padding: 36px; }
        .blog-chip-row { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0 0; }
        .blog-chip { background: #f5dfcf; color: #8d3a14; border-radius: 999px; padding: 8px 12px; font: 700 0.82rem 'Lato', sans-serif; }
        .blog-link { color: #E8490F; text-decoration: none; font: 700 0.95rem 'Lato', sans-serif; }
        @media (max-width: 680px) {
          .blog-view-body { padding: 24px; }
        }
      `}</style>

      <main className="blog-view-shell">
        <Link to="/blog" className="blog-link">
          Back to blogs
        </Link>

        {isLoading ? (
          <section className="blog-view-card" style={{ marginTop: 24, padding: 28, textAlign: 'center', color: '#6c5644', font: "700 1rem 'Lato', sans-serif" }}>
            Loading blog...
          </section>
        ) : isError || !blog ? (
          <section className="blog-view-card" style={{ marginTop: 24, padding: 28, textAlign: 'center' }}>
            <h1 style={{ margin: 0, color: '#2b2118', font: "600 2.4rem 'Cormorant Garamond', serif" }}>
              Blog not found
            </h1>
            <p style={{ margin: '10px 0 0', color: '#6c5644', font: "400 1rem/1.7 'Lato', sans-serif" }}>
              This blog may have been removed or the link may be outdated.
            </p>
          </section>
        ) : (
          <article className="blog-view-card" style={{ marginTop: 24 }}>
            <img
              className="blog-view-image"
              src={image}
              alt={blog.title}
              onError={(event) => { event.currentTarget.src = PLACEHOLDER_IMAGE }}
            />
            <div className="blog-view-body">
              <div style={{ color: '#E8490F', font: "700 0.82rem 'Lato', sans-serif", letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {blog.status || 'Published'} {blog.blogId ? `- Blog #${blog.blogId}` : ''}
              </div>
              <h1 style={{ margin: '8px 0 12px', color: '#21170f', font: "600 clamp(2.6rem, 6vw, 4.8rem) 'Cormorant Garamond', serif", lineHeight: 0.95 }}>
                {blog.title}
              </h1>
              {blog.summary ? (
                <p style={{ margin: 0, color: '#5c493b', font: "400 1.15rem/1.8 'Lato', sans-serif" }}>
                  {blog.summary}
                </p>
              ) : null}

              {tags.length ? (
                <div className="blog-chip-row">
                  {tags.map((tag) => (
                    <span key={tag} className="blog-chip">{tag}</span>
                  ))}
                </div>
              ) : null}

              <div style={{ marginTop: 30, color: '#4f3d31', font: "400 1.05rem/1.9 'Lato', sans-serif", whiteSpace: 'pre-line' }}>
                {blog.content || 'No blog content added yet.'}
              </div>
            </div>
          </article>
        )}
      </main>
    </PageWrapper>
  )
}
