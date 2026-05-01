import { Link, useParams } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { useRecipeProfile } from '../services/recipe'

const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x800/222/fff?text=Recipe'

export default function RecipePage() {
  const { id } = useParams()
  const { data: recipe, isLoading, isError } = useRecipeProfile(id)

  const image = recipe?.image?.url || recipe?.image || PLACEHOLDER_IMAGE
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : []

  return (
    <PageWrapper background="#faf8f5">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; }
        .recipe-view-shell { max-width: 1120px; margin: 0 auto; padding: 48px 20px 84px; }
        .recipe-view-card { background: #fff; border: 1px solid rgba(126, 88, 49, 0.14); border-radius: 18px; overflow: hidden; box-shadow: 0 18px 48px rgba(55, 34, 20, 0.1); }
        .recipe-view-image { width: 100%; height: min(56vw, 520px); object-fit: cover; display: block; }
        .recipe-view-body { padding: 34px; }
        .recipe-view-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; margin-top: 28px; }
        .recipe-view-panel { background: #fff8f1; border: 1px solid #efd9c7; border-radius: 14px; padding: 22px; }
        .recipe-link { color: #E8490F; text-decoration: none; font: 700 0.95rem 'Lato', sans-serif; }
        @media (max-width: 780px) {
          .recipe-view-grid { grid-template-columns: 1fr; }
          .recipe-view-body { padding: 24px; }
        }
      `}</style>

      <main className="recipe-view-shell">
        <Link to="/recipe" className="recipe-link">
          Back to recipes
        </Link>

        {isLoading ? (
          <section className="recipe-view-card" style={{ marginTop: 24, padding: 28, textAlign: 'center', color: '#6c5644', font: "700 1rem 'Lato', sans-serif" }}>
            Loading recipe...
          </section>
        ) : isError || !recipe ? (
          <section className="recipe-view-card" style={{ marginTop: 24, padding: 28, textAlign: 'center' }}>
            <h1 style={{ margin: 0, color: '#2b2118', font: "600 2.4rem 'Cormorant Garamond', serif" }}>
              Recipe not found
            </h1>
            <p style={{ margin: '10px 0 0', color: '#6c5644', font: "400 1rem/1.7 'Lato', sans-serif" }}>
              This recipe may have been removed or the link may be outdated.
            </p>
          </section>
        ) : (
          <article className="recipe-view-card" style={{ marginTop: 24 }}>
            <img
              className="recipe-view-image"
              src={image}
              alt={recipe.title}
              onError={(event) => { event.currentTarget.src = PLACEHOLDER_IMAGE }}
            />
            <div className="recipe-view-body">
              <div style={{ color: '#E8490F', font: "700 0.82rem 'Lato', sans-serif", letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Recipe #{recipe.recipeId || recipe._id}
              </div>
              <h1 style={{ margin: '8px 0 12px', color: '#21170f', font: "600 clamp(2.6rem, 6vw, 4.8rem) 'Cormorant Garamond', serif", lineHeight: 0.95 }}>
                {recipe.title}
              </h1>
              <p style={{ margin: 0, color: '#5c493b', font: "400 1.08rem/1.8 'Lato', sans-serif" }}>
                {recipe.description || 'No description added yet.'}
              </p>

              <div className="recipe-view-grid">
                <aside className="recipe-view-panel">
                  <h2 style={{ margin: '0 0 14px', color: '#2b2118', font: "600 2rem 'Cormorant Garamond', serif" }}>
                    Ingredients
                  </h2>
                  {ingredients.length ? (
                    <ul style={{ margin: 0, paddingLeft: 20, color: '#5c493b', font: "400 1rem/1.8 'Lato', sans-serif" }}>
                      {ingredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, color: '#6c5644', font: "400 1rem/1.7 'Lato', sans-serif" }}>
                      No ingredients listed.
                    </p>
                  )}
                </aside>

                <section>
                  <h2 style={{ margin: '0 0 14px', color: '#2b2118', font: "600 2rem 'Cormorant Garamond', serif" }}>
                    Instructions
                  </h2>
                  <p style={{ whiteSpace: 'pre-line', margin: 0, color: '#5c493b', font: "400 1rem/1.85 'Lato', sans-serif" }}>
                    {recipe.instructions || 'No instructions added yet.'}
                  </p>
                </section>
              </div>
            </div>
          </article>
        )}
      </main>
    </PageWrapper>
  )
}
