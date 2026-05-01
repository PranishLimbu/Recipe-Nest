import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import { httpClient } from "../lib/axios";
import { TokenService } from "../utils/tokenServices";

const initialRecipeForm = {
  title: "",
  description: "",
  ingredients: "",
  instructions: "",
  image: null,
};

const initialBlogForm = {
  title: "",
  summary: "",
  content: "",
  tags: "",
  status: "published",
  coverImage: null,
};

const initialChefForm = {
  name: "",
  bio: "",
  speciality: "",
  cuisineType: "",
  instagram: "",
  youtube: "",
  twitter: "",
  website: "",
  profilePhoto: null,
};

const createFormData = (entries) => {
  const formData = new FormData();

  Object.entries(entries).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  return formData;
};

const extractList = (data, key) => data?.[key] ?? data ?? [];

const joinValues = (value) => (Array.isArray(value) ? value.join(", ") : value || "");

const chefProfileToForm = (chef) => ({
  name: chef?.name || "",
  bio: chef?.bio || "",
  speciality: joinValues(chef?.speciality),
  cuisineType: joinValues(chef?.cuisineType),
  instagram: chef?.socialLinks?.instagram || "",
  youtube: chef?.socialLinks?.youtube || "",
  twitter: chef?.socialLinks?.twitter || "",
  website: chef?.socialLinks?.website || "",
  profilePhoto: null,
});

export default function StaffDesk() {
  const tokenDetails = TokenService.getTokenDetails();
  const isStaff = tokenDetails?.role === "chef" || tokenDetails?.role === "admin";
  const isAdmin = tokenDetails?.role === "admin";
  const currentRole = tokenDetails?.role;
  const currentUserId = tokenDetails?.id;

  const [recipeForm, setRecipeForm] = useState(initialRecipeForm);
  const [blogForm, setBlogForm] = useState(initialBlogForm);
  const [chefForm, setChefForm] = useState(initialChefForm);
  const [chefProfile, setChefProfile] = useState(null);
  const [editingRecipeId, setEditingRecipeId] = useState("");
  const [editingBlogId, setEditingBlogId] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    savingRecipe: false,
    savingBlog: false,
    savingChef: false,
    deletingId: "",
    deletingType: "",
    error: "",
    success: "",
  });

  const setFeedback = (partialState) => {
    setStatus((currentState) => ({
      ...currentState,
      ...partialState,
    }));
  };

  const loadContent = useCallback(async () => {
    try {
      setFeedback({ loading: true, error: "" });
      const params = isAdmin || !currentUserId ? {} : { userId: currentUserId };

      const chefProfileRequest = currentRole === "chef"
        ? httpClient.get("/api/chefs/me").catch((error) => {
            if (error.response?.status === 404) return { data: { chef: null } };
            throw error;
          })
        : Promise.resolve({ data: { chef: null } });

      const [recipeResponse, blogResponse, chefResponse] = await Promise.all([
        httpClient.get("/api/recipes", { params }),
        httpClient.get("/api/blogs", { params }),
        chefProfileRequest,
      ]);

      setRecipes(extractList(recipeResponse.data, "recipes"));
      setBlogs(extractList(blogResponse.data, "blogs"));
      const loadedChefProfile = chefResponse.data?.chef ?? null;
      setChefProfile(loadedChefProfile);
      if (loadedChefProfile) {
        setChefForm(chefProfileToForm(loadedChefProfile));
      }
      setFeedback({ loading: false });
    } catch (error) {
      setFeedback({
        loading: false,
        error: error.response?.data?.error || "Unable to load recipes and blogs.",
      });
    }
  }, [currentRole, currentUserId, isAdmin]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadContent();
  }, [loadContent]);

  const handleRecipeChange = (event) => {
    const { name, value, files } = event.target;
    setRecipeForm((currentState) => ({
      ...currentState,
      [name]: files ? files[0] || null : value,
    }));
  };

  const handleBlogChange = (event) => {
    const { name, value, files } = event.target;
    setBlogForm((currentState) => ({
      ...currentState,
      [name]: files ? files[0] || null : value,
    }));
  };

  const handleChefChange = (event) => {
    const { name, value, files } = event.target;
    setChefForm((currentState) => ({
      ...currentState,
      [name]: files ? files[0] || null : value,
    }));
  };

  const handleChefSubmit = async (event) => {
    event.preventDefault();

    try {
      setFeedback({ savingChef: true, error: "", success: "" });

      const chefPayload = {
        name: chefForm.name,
        bio: chefForm.bio,
        speciality: JSON.stringify(
          chefForm.speciality
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        ),
        cuisineType: JSON.stringify(
          chefForm.cuisineType
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        ),
        socialLinks: JSON.stringify({
          instagram: chefForm.instagram,
          youtube: chefForm.youtube,
          twitter: chefForm.twitter,
          website: chefForm.website,
        }),
      };

      if (chefProfile) {
        await httpClient.put("/api/chefs/me", chefPayload);
      } else {
        await httpClient.post("/api/chefs", chefPayload);
      }

      if (chefForm.profilePhoto) {
        const photoPayload = createFormData({
          profilePhoto: chefForm.profilePhoto,
        });
        await httpClient.put("/api/chefs/me/photo", photoPayload);
      }

      await loadContent();
      setFeedback({
        savingChef: false,
        success: chefProfile ? "Chef profile updated successfully." : "Chef profile created successfully.",
      });
    } catch (error) {
      setFeedback({
        savingChef: false,
        error: error.response?.data?.message || error.response?.data?.error || "Chef profile could not be saved.",
      });
    }
  };

  const handleRecipeSubmit = async (event) => {
    event.preventDefault();

    try {
      setFeedback({ savingRecipe: true, error: "", success: "" });

      const recipePayload = createFormData({
        title: recipeForm.title,
        description: recipeForm.description,
        ingredients: recipeForm.ingredients,
        instructions: recipeForm.instructions,
        image: recipeForm.image,
      });

      if (editingRecipeId) {
        await httpClient.put(`/api/recipes/${editingRecipeId}`, recipePayload);
      } else {
        await httpClient.post("/api/recipes", recipePayload);
      }

      setRecipeForm(initialRecipeForm);
      setEditingRecipeId("");
      await loadContent();
      setFeedback({
        savingRecipe: false,
        success: editingRecipeId ? "Recipe updated successfully." : "Recipe created successfully.",
      });
    } catch (error) {
      setFeedback({
        savingRecipe: false,
        error: error.response?.data?.error || "Recipe could not be created.",
      });
    }
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();

    try {
      setFeedback({ savingBlog: true, error: "", success: "" });

      const blogPayload = createFormData({
        title: blogForm.title,
        summary: blogForm.summary,
        content: blogForm.content,
        tags: blogForm.tags,
        status: blogForm.status,
        coverImage: blogForm.coverImage,
      });

      if (editingBlogId) {
        await httpClient.put(`/api/blogs/${editingBlogId}`, blogPayload);
      } else {
        await httpClient.post("/api/blogs", blogPayload);
      }

      setBlogForm(initialBlogForm);
      setEditingBlogId("");
      await loadContent();
      setFeedback({
        savingBlog: false,
        success: editingBlogId ? "Blog updated successfully." : "Blog created successfully.",
      });
    } catch (error) {
      setFeedback({
        savingBlog: false,
        error: error.response?.data?.error || "Blog could not be created.",
      });
    }
  };

  const handleDelete = async (type, id) => {
    try {
      setFeedback({
        deletingId: id,
        deletingType: type,
        error: "",
        success: "",
      });

      await httpClient.delete(`/api/${type}/${id}`);
      await loadContent();

      setFeedback({
        deletingId: "",
        deletingType: "",
        success: `${type === "recipes" ? "Recipe" : "Blog"} deleted successfully.`,
      });
    } catch (error) {
      setFeedback({
        deletingId: "",
        deletingType: "",
        error: error.response?.data?.error || "Delete request failed.",
      });
    }
  };

  const startRecipeEdit = (recipe) => {
    setEditingRecipeId(String(recipe.recipeId || recipe._id));
    setRecipeForm({
      title: recipe.title || "",
      description: recipe.description || "",
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : recipe.ingredients || "",
      instructions: recipe.instructions || "",
      image: null,
    });
    setFeedback({ error: "", success: "" });
  };

  const startBlogEdit = (blog) => {
    setEditingBlogId(String(blog.blogId || blog._id));
    setBlogForm({
      title: blog.title || "",
      summary: blog.summary || "",
      content: blog.content || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      status: blog.status || "published",
      coverImage: null,
    });
    setFeedback({ error: "", success: "" });
  };

  const cancelRecipeEdit = () => {
    setEditingRecipeId("");
    setRecipeForm(initialRecipeForm);
  };

  const cancelBlogEdit = () => {
    setEditingBlogId("");
    setBlogForm(initialBlogForm);
  };

  return (
    <PageWrapper background="#f6efe4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .staff-shell { max-width: 1280px; margin: 0 auto; padding: 40px 20px 90px; }
        .staff-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 24px; }
        .staff-panel {
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,239,226,0.95));
          border: 1px solid rgba(126, 88, 49, 0.16);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(75, 47, 23, 0.08);
        }
        .staff-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .staff-input, .staff-textarea, .staff-select {
          width: 100%;
          border: 1px solid #ddc8ad;
          border-radius: 16px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.82);
          color: #2b2118;
          font: 500 0.95rem 'Manrope', sans-serif;
          outline: none;
        }
        .staff-textarea { min-height: 132px; resize: vertical; }
        .staff-input:focus, .staff-textarea:focus, .staff-select:focus {
          border-color: #d0612a;
          box-shadow: 0 0 0 4px rgba(208, 97, 42, 0.12);
        }
        .staff-button {
          border: none;
          border-radius: 999px;
          padding: 14px 22px;
          font: 700 0.92rem 'Manrope', sans-serif;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .staff-button:hover { transform: translateY(-1px); }
        .staff-button:disabled { cursor: wait; opacity: 0.72; transform: none; }
        .staff-list { display: grid; gap: 14px; }
        .staff-item {
          border: 1px solid rgba(126, 88, 49, 0.16);
          background: rgba(255,255,255,0.78);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
        }
        .hero-band {
          background:
            radial-gradient(circle at top left, rgba(232, 98, 42, 0.25), transparent 38%),
            radial-gradient(circle at bottom right, rgba(107, 68, 31, 0.18), transparent 42%),
            linear-gradient(135deg, #2c2016 0%, #53351f 100%);
          color: #fff6ef;
          border-radius: 36px;
          padding: 34px 32px;
          margin-bottom: 24px;
        }
        @media (max-width: 1024px) {
          .staff-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .staff-form-grid { grid-template-columns: 1fr; }
          .staff-shell { padding-left: 14px; padding-right: 14px; }
          .hero-band { padding: 26px 22px; }
          .staff-item { flex-direction: column; }
        }
      `}</style>

      <div className="staff-shell">
        <section className="hero-band">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "space-between" }}>
            <div style={{ maxWidth: 700 }}>
              <div style={{ font: "700 0.82rem 'Manrope', sans-serif", letterSpacing: "0.16em", textTransform: "uppercase", color: "#f7c59f", marginBottom: 12 }}>
                Staff Publishing Desk
              </div>
              <h1 style={{ margin: 0, font: "600 clamp(2.2rem, 5vw, 4.2rem) 'Cormorant Garamond', serif", lineHeight: 0.95 }}>
                Create and retire recipes and blogs from one place.
              </h1>
              <p style={{ margin: "16px 0 0", maxWidth: 620, color: "rgba(255, 246, 239, 0.8)", font: "500 1rem/1.7 'Manrope', sans-serif" }}>
                This page talks directly to your live recipe and blog APIs. It is intended for chef and admin accounts using the same token you get from sign in.
              </p>
            </div>
            <div style={{ minWidth: 220, alignSelf: "flex-start", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 24, padding: 18, background: "rgba(255,255,255,0.06)" }}>
              <div style={{ font: "700 0.78rem 'Manrope', sans-serif", textTransform: "uppercase", letterSpacing: "0.14em", color: "#f7c59f", marginBottom: 10 }}>
                Session
              </div>
              <div style={{ font: "600 1rem 'Manrope', sans-serif" }}>
                {tokenDetails ? tokenDetails.role : "Not signed in"}
              </div>
              <div style={{ marginTop: 6, color: "rgba(255, 246, 239, 0.75)", font: "500 0.92rem/1.5 'Manrope', sans-serif" }}>
                {tokenDetails?.id || "Sign in to unlock publishing actions."}
              </div>
            </div>
          </div>
        </section>

        {!tokenDetails ? (
          <section className="staff-panel" style={{ textAlign: "center" }}>
            <h2 style={{ margin: 0, font: "600 2.1rem 'Cormorant Garamond', serif", color: "#2f2118" }}>
              Sign in first
            </h2>
            <p style={{ margin: "10px auto 20px", maxWidth: 520, color: "#5f4b3c", font: "500 0.98rem/1.7 'Manrope', sans-serif" }}>
              The publishing tools use your stored access token. Once you sign in, come back here to add or delete recipes and blogs.
            </p>
            <Link
              to="/signin"
              className="staff-button"
              style={{ display: "inline-flex", background: "#d0612a", color: "#fff", textDecoration: "none" }}
            >
              Go to sign in
            </Link>
          </section>
        ) : !isStaff ? (
          <section className="staff-panel" style={{ textAlign: "center" }}>
            <h2 style={{ margin: 0, font: "600 2.1rem 'Cormorant Garamond', serif", color: "#2f2118" }}>
              Staff access recommended
            </h2>
            <p style={{ margin: "10px auto 0", maxWidth: 560, color: "#5f4b3c", font: "500 0.98rem/1.7 'Manrope', sans-serif" }}>
              This desk is designed for `chef` and `admin` accounts. Your current token role is `{tokenDetails.role}`.
            </p>
          </section>
        ) : (
          <div className="staff-grid">
            <section className="staff-panel">
              <div style={{ display: "grid", gap: 24 }}>
                {currentRole === "chef" ? (
                  <div>
                    <div>
                      <h2 style={{ margin: 0, font: "600 2rem 'Cormorant Garamond', serif", color: "#2f2118" }}>
                        {chefProfile ? "Edit Chef Profile" : "Add Chef Profile"}
                      </h2>
                      <p style={{ margin: "6px 0 0", color: "#6c5644", font: "500 0.95rem/1.6 'Manrope', sans-serif" }}>
                        {chefProfile
                          ? "Update the chef details shown on the chefs page. Add a new photo only when you want to replace the current one."
                          : "Create the profile shown on the chefs page. Specialities and cuisines can be comma separated."}
                      </p>
                    </div>

                    {chefProfile ? (
                      <div style={{ display: "flex", gap: 14, alignItems: "center", border: "1px solid rgba(45, 106, 79, 0.22)", borderRadius: 20, padding: 18, background: "#eef9f2", marginTop: 14 }}>
                        {chefProfile.profilePhoto?.url ? (
                          <img
                            src={chefProfile.profilePhoto.url}
                            alt={chefProfile.name}
                            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid #cbe8d4" }}
                          />
                        ) : null}
                        <div>
                          <div style={{ color: "#2d6a4f", font: "700 0.76rem 'Manrope', sans-serif", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                            Live Chef Profile
                          </div>
                          <h3 style={{ margin: "4px 0 6px", font: "600 1.45rem 'Cormorant Garamond', serif", color: "#2f2118" }}>
                            {chefProfile.name}
                          </h3>
                          <p style={{ margin: 0, color: "#315d48", font: "500 0.9rem/1.5 'Manrope', sans-serif" }}>
                            {chefProfile.bio || "Your chef profile is live."}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <form onSubmit={handleChefSubmit} style={{ display: "grid", gap: 14, marginTop: 14 }}>
                      <div className="staff-form-grid">
                        <input className="staff-input" name="name" placeholder="Chef name" value={chefForm.name} onChange={handleChefChange} required />
                        <input className="staff-input" name="speciality" placeholder="Pastry, Italian, grilling" value={chefForm.speciality} onChange={handleChefChange} />
                        <input className="staff-input" name="cuisineType" placeholder="Nepali, French, vegan" value={chefForm.cuisineType} onChange={handleChefChange} />
                        <input className="staff-input" name="instagram" placeholder="Instagram URL" value={chefForm.instagram} onChange={handleChefChange} />
                        <input className="staff-input" name="youtube" placeholder="YouTube URL" value={chefForm.youtube} onChange={handleChefChange} />
                        <input className="staff-input" name="twitter" placeholder="Twitter/X URL" value={chefForm.twitter} onChange={handleChefChange} />
                        <input className="staff-input" name="website" placeholder="Website URL" value={chefForm.website} onChange={handleChefChange} />
                        <input className="staff-input" name="profilePhoto" type="file" accept="image/*" onChange={handleChefChange} />
                      </div>
                      <textarea className="staff-textarea" name="bio" placeholder="Short chef bio..." value={chefForm.bio} onChange={handleChefChange} />
                      <button type="submit" className="staff-button" disabled={status.savingChef} style={{ justifySelf: "start", background: "#7a583a", color: "#fff" }}>
                        {status.savingChef ? "Saving profile..." : chefProfile ? "Update chef profile" : "Create chef profile"}
                      </button>
                    </form>
                  </div>
                ) : null}

                <div>
                  <h2 style={{ margin: 0, font: "600 2rem 'Cormorant Garamond', serif", color: "#2f2118" }}>
                    {editingRecipeId ? "Edit Recipe" : "Add Recipe"}
                  </h2>
                  <p style={{ margin: "6px 0 0", color: "#6c5644", font: "500 0.95rem/1.6 'Manrope', sans-serif" }}>
                    Ingredients can be comma separated or JSON. Image upload is optional.
                  </p>
                </div>

                <form onSubmit={handleRecipeSubmit} style={{ display: "grid", gap: 14 }}>
                  <div className="staff-form-grid">
                    <input className="staff-input" name="title" placeholder="Recipe title" value={recipeForm.title} onChange={handleRecipeChange} required />
                    <input className="staff-input" name="description" placeholder="Short description" value={recipeForm.description} onChange={handleRecipeChange} />
                    <input className="staff-input" name="ingredients" placeholder="rice, tomato, basil" value={recipeForm.ingredients} onChange={handleRecipeChange} required />
                    <input className="staff-input" name="image" type="file" accept="image/*" onChange={handleRecipeChange} />
                  </div>
                  <textarea className="staff-textarea" name="instructions" placeholder="Write the cooking steps..." value={recipeForm.instructions} onChange={handleRecipeChange} required />
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="submit" className="staff-button" disabled={status.savingRecipe} style={{ background: "#d0612a", color: "#fff" }}>
                      {status.savingRecipe ? "Saving recipe..." : editingRecipeId ? "Update recipe" : "Create recipe"}
                    </button>
                    {editingRecipeId ? (
                      <button type="button" className="staff-button" onClick={cancelRecipeEdit} style={{ background: "#efe1cd", color: "#422c1a" }}>
                        Cancel edit
                      </button>
                    ) : null}
                  </div>
                </form>

                <div>
                  <h2 style={{ margin: 0, font: "600 2rem 'Cormorant Garamond', serif", color: "#2f2118" }}>
                    {editingBlogId ? "Edit Blog" : "Add Blog"}
                  </h2>
                  <p style={{ margin: "6px 0 0", color: "#6c5644", font: "500 0.95rem/1.6 'Manrope', sans-serif" }}>
                    Tags can be comma separated or JSON. Cover image upload is optional.
                  </p>
                </div>

                <form onSubmit={handleBlogSubmit} style={{ display: "grid", gap: 14 }}>
                  <div className="staff-form-grid">
                    <input className="staff-input" name="title" placeholder="Blog title" value={blogForm.title} onChange={handleBlogChange} required />
                    <input className="staff-input" name="summary" placeholder="Short summary" value={blogForm.summary} onChange={handleBlogChange} required />
                    <input className="staff-input" name="tags" placeholder="kitchen, story, technique" value={blogForm.tags} onChange={handleBlogChange} />
                    <select className="staff-select" name="status" value={blogForm.status} onChange={handleBlogChange}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    <input className="staff-input" name="coverImage" type="file" accept="image/*" onChange={handleBlogChange} />
                  </div>
                  <textarea className="staff-textarea" name="content" placeholder="Write the full blog post..." value={blogForm.content} onChange={handleBlogChange} required />
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="submit" className="staff-button" disabled={status.savingBlog} style={{ background: "#2d6a4f", color: "#fff" }}>
                      {status.savingBlog ? "Saving blog..." : editingBlogId ? "Update blog" : "Create blog"}
                    </button>
                    {editingBlogId ? (
                      <button type="button" className="staff-button" onClick={cancelBlogEdit} style={{ background: "#efe1cd", color: "#422c1a" }}>
                        Cancel edit
                      </button>
                    ) : null}
                  </div>
                </form>

                {status.error ? (
                  <div style={{ borderRadius: 16, padding: "14px 16px", background: "#fff1ed", border: "1px solid #f0b8a8", color: "#9f3c21", font: "600 0.92rem 'Manrope', sans-serif" }}>
                    {status.error}
                  </div>
                ) : null}

                {status.success ? (
                  <div style={{ borderRadius: 16, padding: "14px 16px", background: "#eef9f2", border: "1px solid #b2ddc1", color: "#226c44", font: "600 0.92rem 'Manrope', sans-serif" }}>
                    {status.success}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="staff-panel">
              <div style={{ display: "grid", gap: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12 }}>
                  <div>
                    <h2 style={{ margin: 0, font: "600 2rem 'Cormorant Garamond', serif", color: "#2f2118" }}>
                      Current Content
                    </h2>
                    <p style={{ margin: "6px 0 0", color: "#6c5644", font: "500 0.95rem/1.6 'Manrope', sans-serif" }}>
                      Refreshes automatically after every create and delete.
                    </p>
                  </div>
                  <button type="button" className="staff-button" onClick={loadContent} disabled={status.loading} style={{ background: "#efe1cd", color: "#422c1a" }}>
                    {status.loading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>

                <div>
                  <h3 style={{ margin: "0 0 12px", font: "700 0.95rem 'Manrope', sans-serif", color: "#7a583a", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Recipes
                  </h3>
                  <div className="staff-list">
                    {recipes.map((recipe) => {
                      const displayId = recipe.recipeId || recipe._id;
                      const isDeleting = status.deletingType === "recipes" && status.deletingId === String(displayId);

                      return (
                        <article key={recipe._id || displayId} className="staff-item">
                          <div>
                            <div style={{ color: "#a06c3d", font: "700 0.76rem 'Manrope', sans-serif", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                              Recipe #{displayId}
                            </div>
                            <h4 style={{ margin: "6px 0 8px", font: "600 1.25rem 'Cormorant Garamond', serif", color: "#281b12" }}>
                              {recipe.title}
                            </h4>
                            <p style={{ margin: 0, color: "#604b3b", font: "500 0.92rem/1.6 'Manrope', sans-serif" }}>
                              {recipe.description || "No description added yet."}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <button type="button" className="staff-button" onClick={() => startRecipeEdit(recipe)} style={{ background: "#efe1cd", color: "#422c1a" }}>
                              Edit
                            </button>
                            {isAdmin || String(recipe.userId) === String(currentUserId) ? (
                              <button type="button" className="staff-button" onClick={() => handleDelete("recipes", displayId)} disabled={isDeleting} style={{ background: "#3b2417", color: "#fff" }}>
                                {isDeleting ? "Deleting..." : "Delete"}
                              </button>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                    {!recipes.length && !status.loading ? (
                      <div style={{ color: "#6c5644", font: "500 0.95rem 'Manrope', sans-serif" }}>No recipes found yet.</div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <h3 style={{ margin: "0 0 12px", font: "700 0.95rem 'Manrope', sans-serif", color: "#7a583a", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Blogs
                  </h3>
                  <div className="staff-list">
                    {blogs.map((blog) => {
                      const displayId = blog.blogId || blog._id;
                      const isDeleting = status.deletingType === "blogs" && status.deletingId === String(displayId);

                      return (
                        <article key={blog._id || displayId} className="staff-item">
                          <div>
                            <div style={{ color: "#a06c3d", font: "700 0.76rem 'Manrope', sans-serif", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                              Blog #{displayId}
                            </div>
                            <h4 style={{ margin: "6px 0 8px", font: "600 1.25rem 'Cormorant Garamond', serif", color: "#281b12" }}>
                              {blog.title}
                            </h4>
                            <p style={{ margin: 0, color: "#604b3b", font: "500 0.92rem/1.6 'Manrope', sans-serif" }}>
                              {blog.summary || "No summary added yet."}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <button type="button" className="staff-button" onClick={() => startBlogEdit(blog)} style={{ background: "#efe1cd", color: "#422c1a" }}>
                              Edit
                            </button>
                            {isAdmin || String(blog.userId) === String(currentUserId) ? (
                              <button type="button" className="staff-button" onClick={() => handleDelete("blogs", displayId)} disabled={isDeleting} style={{ background: "#3b2417", color: "#fff" }}>
                                {isDeleting ? "Deleting..." : "Delete"}
                              </button>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                    {!blogs.length && !status.loading ? (
                      <div style={{ color: "#6c5644", font: "500 0.95rem 'Manrope', sans-serif" }}>No blogs found yet.</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
