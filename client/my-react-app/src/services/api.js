export const API_ROUTS={
    LOGIN:"/api/auth/login",
    REGISTER:"/api/auth/register",
    REGISTER_CHEF:"/api/auth/register-chef",
    REGISTER_ADMIN:"/api/auth/register-admin",
    GET_CHEFS:"/api/chefs",
    GET_CHEF:(id)=>`/api/chefs/${id}`,
    RATE_CHEF:(id)=>`/api/chefs/${id}/rating`,
    GET_RECIPES:"/api/recipes",
    GET_RECIPE:(id)=>`/api/recipes/${id}`,
    GET_BLOGS:"/api/blogs",
    GET_BLOG:(id)=>`/api/blogs/${id}`,
    GET_USERS:"/api/users"
}
