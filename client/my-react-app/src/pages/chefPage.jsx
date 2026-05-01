import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import RecipeCard from '../components/cards/RecipeCard'
import StarRating from '../components/ui/StarRating'
import { useChefProfile, useRateChef } from '../services/chefs'
import { useRecipesByUserId } from '../services/recipe'
import { TokenService } from '../utils/tokenServices'

const PLACEHOLDER_IMAGE = 'https://placehold.co/900x900/222/fff?text=Chef'

const joinValues = (value) => (Array.isArray(value) ? value.join(', ') : value || '')

const socialLabels = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'Twitter/X',
  website: 'Website',
}

export default function ChefPage() {
  const { id } = useParams()
  const [selectedRating, setSelectedRating] = useState(0)
  const { data: chef, isLoading, isError } = useChefProfile(id)
  const rateChefMutation = useRateChef(id)
  const tokenDetails = TokenService.getTokenDetails()
  const chefUserId = typeof chef?.userId === 'object' ? chef.userId?._id : chef?.userId
  const {
    data: recipes = [],
    isLoading: recipesLoading,
    isError: recipesError,
  } = useRecipesByUserId(chefUserId)

  const name = chef?.name || 'Chef Profile'
  const image = chef?.profilePhoto?.url || PLACEHOLDER_IMAGE
  const speciality = joinValues(chef?.speciality)
  const cuisineType = joinValues(chef?.cuisineType)
  const socialLinks = Object.entries(chef?.socialLinks || {}).filter(([, url]) => url)
  const userRating = chef?.ratings?.find((rating) => rating.userId === tokenDetails?.id)?.value || 0
  const activeRating = selectedRating || userRating

  const handleRatingSubmit = async () => {
    if (!activeRating) return
    await rateChefMutation.mutateAsync(activeRating)
    setSelectedRating(0)
  }

  return (
    <PageWrapper background="#f5efe7">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; }
        .chef-profile-shell { max-width: 1120px; margin: 0 auto; padding: 48px 20px 80px; }
        .chef-profile-main { display: grid; grid-template-columns: 360px 1fr; gap: 36px; align-items: start; }
        .chef-photo { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 18px; box-shadow: 0 18px 48px rgba(55, 34, 20, 0.16); }
        .chef-panel { background: #fff; border: 1px solid rgba(126, 88, 49, 0.14); border-radius: 18px; padding: 28px; }
        .chef-chip-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
        .chef-chip { background: #f5dfcf; color: #8d3a14; border-radius: 999px; padding: 8px 12px; font: 700 0.82rem 'Lato', sans-serif; }
        .chef-link { color: #E8490F; text-decoration: none; font: 700 0.95rem 'Lato', sans-serif; }
        .chef-recipes-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
        .rating-button {
          width: 38px;
          height: 38px;
          border: 1px solid #f0c9b7;
          border-radius: 999px;
          background: #fff8f1;
          color: #d04a12;
          cursor: pointer;
          font: 700 1rem 'Lato', sans-serif;
        }
        .rating-button.active { background: #E8490F; color: #fff; border-color: #E8490F; }
        .rating-button:disabled { cursor: wait; opacity: 0.65; }
        @media (max-width: 820px) {
          .chef-profile-main { grid-template-columns: 1fr; }
          .chef-photo { max-width: 420px; }
          .chef-recipes-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .chef-recipes-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main className="chef-profile-shell">
        <Link to="/chefs" className="chef-link">
          Back to chefs
        </Link>

        {isLoading ? (
          <section className="chef-panel" style={{ marginTop: 24, textAlign: 'center', color: '#6c5644', font: "700 1rem 'Lato', sans-serif" }}>
            Loading chef profile...
          </section>
        ) : isError || !chef ? (
          <section className="chef-panel" style={{ marginTop: 24, textAlign: 'center' }}>
            <h1 style={{ margin: 0, color: '#2b2118', font: "600 2.4rem 'Cormorant Garamond', serif" }}>
              Chef profile not found
            </h1>
            <p style={{ margin: '10px 0 0', color: '#6c5644', font: "400 1rem/1.7 'Lato', sans-serif" }}>
              This chef may have removed their profile or the link may be outdated.
            </p>
          </section>
        ) : (
          <section className="chef-profile-main" style={{ marginTop: 24 }}>
            <div>
              <img
                className="chef-photo"
                src={image}
                alt={name}
                onError={(event) => { event.currentTarget.src = PLACEHOLDER_IMAGE }}
              />
            </div>

            <div className="chef-panel">
              <div style={{ color: '#E8490F', font: "700 0.82rem 'Lato', sans-serif", letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                RecipeNest Chef
              </div>
              <h1 style={{ margin: '8px 0 12px', color: '#21170f', font: "600 clamp(2.6rem, 6vw, 4.8rem) 'Cormorant Garamond', serif", lineHeight: 0.95 }}>
                {name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                <StarRating count={Math.round(Number(chef.rating) || 0)} size={20} />
                <span style={{ color: '#6c5644', font: "700 0.95rem 'Lato', sans-serif" }}>
                  {(Number(chef.rating) || 0).toFixed(1)} from {chef.ratingCount || 0} {chef.ratingCount === 1 ? 'rating' : 'ratings'}
                </span>
              </div>
              <p style={{ margin: 0, color: '#5c493b', font: "400 1.05rem/1.8 'Lato', sans-serif" }}>
                {chef.bio || 'This chef has not added a bio yet.'}
              </p>

              <div style={{ marginTop: 22, border: '1px solid #efd9c7', borderRadius: 14, padding: 18, background: '#fff8f1' }}>
                <h2 style={{ margin: '0 0 12px', color: '#2b2118', font: "600 1.6rem 'Cormorant Garamond', serif" }}>
                  Rate this chef
                </h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`rating-button${activeRating >= value ? ' active' : ''}`}
                      onClick={() => setSelectedRating(value)}
                      disabled={rateChefMutation.isPending || !tokenDetails}
                      aria-label={`Rate ${value} stars`}
                    >
                      {value}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleRatingSubmit}
                    disabled={!tokenDetails || !activeRating || rateChefMutation.isPending}
                    style={{
                      border: 'none',
                      borderRadius: 999,
                      padding: '11px 16px',
                      background: '#E8490F',
                      color: '#fff',
                      cursor: tokenDetails && activeRating && !rateChefMutation.isPending ? 'pointer' : 'not-allowed',
                      font: "700 0.9rem 'Lato', sans-serif",
                      opacity: tokenDetails && activeRating ? 1 : 0.65,
                    }}
                  >
                    {rateChefMutation.isPending ? 'Saving...' : userRating ? 'Update rating' : 'Submit rating'}
                  </button>
                </div>
                <p style={{ margin: '10px 0 0', color: rateChefMutation.isError ? '#9f3c21' : '#6c5644', font: "400 0.92rem/1.5 'Lato', sans-serif" }}>
                  {!tokenDetails
                    ? 'Sign in to rate this chef.'
                    : rateChefMutation.isError
                      ? rateChefMutation.error?.response?.data?.message || 'Rating could not be saved.'
                      : userRating
                        ? `Your rating: ${userRating} star${userRating === 1 ? '' : 's'}`
                        : 'Choose a rating from 1 to 5.'}
                </p>
              </div>

              {(speciality || cuisineType) ? (
                <div className="chef-chip-row">
                  {speciality ? <span className="chef-chip">{speciality}</span> : null}
                  {cuisineType ? <span className="chef-chip">{cuisineType}</span> : null}
                </div>
              ) : null}

              {Array.isArray(chef.achievements) && chef.achievements.length ? (
                <div style={{ marginTop: 30 }}>
                  <h2 style={{ margin: '0 0 14px', color: '#2b2118', font: "600 2rem 'Cormorant Garamond', serif" }}>
                    Achievements
                  </h2>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {chef.achievements.map((achievement) => (
                      <article key={achievement._id || achievement.title} style={{ borderLeft: '4px solid #E8490F', paddingLeft: 14 }}>
                        <h3 style={{ margin: 0, color: '#2b2118', font: "700 1rem 'Lato', sans-serif" }}>
                          {achievement.title}
                          {achievement.year ? ` (${achievement.year})` : ''}
                        </h3>
                        {achievement.description ? (
                          <p style={{ margin: '4px 0 0', color: '#6c5644', font: "400 0.95rem/1.6 'Lato', sans-serif" }}>
                            {achievement.description}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {socialLinks.length ? (
                <div style={{ marginTop: 30 }}>
                  <h2 style={{ margin: '0 0 12px', color: '#2b2118', font: "600 2rem 'Cormorant Garamond', serif" }}>
                    Connect
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    {socialLinks.map(([key, url]) => (
                      <a key={key} href={url} target="_blank" rel="noreferrer" className="chef-link">
                        {socialLabels[key] || key}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="chef-panel" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'end', flexWrap: 'wrap', marginBottom: 20 }}>
                <div>
                  <div style={{ color: '#E8490F', font: "700 0.78rem 'Lato', sans-serif", letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Recipes
                  </div>
                  <h2 style={{ margin: '4px 0 0', color: '#2b2118', font: "600 2.4rem 'Cormorant Garamond', serif" }}>
                    Recipes by {name}
                  </h2>
                </div>
                <span style={{ color: '#6c5644', font: "700 0.95rem 'Lato', sans-serif" }}>
                  {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                </span>
              </div>

              {recipesLoading ? (
                <p style={{ margin: 0, color: '#6c5644', font: "700 1rem 'Lato', sans-serif" }}>
                  Loading recipes...
                </p>
              ) : recipesError ? (
                <p style={{ margin: 0, color: '#9f3c21', font: "700 1rem 'Lato', sans-serif" }}>
                  Unable to load this chef's recipes right now.
                </p>
              ) : recipes.length ? (
                <div className="chef-recipes-grid">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id || recipe._id || recipe.recipeId}
                      recipe={{ ...recipe, chef: name }}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: '#6c5644', font: "400 1rem/1.7 'Lato', sans-serif" }}>
                  This chef has not published any recipes yet.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </PageWrapper>
  )
}
