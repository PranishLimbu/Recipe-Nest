import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Chefs from './pages/Chefs'
import Recipe from './pages/Recipe'
import Blog from './pages/Blog'
import About from './pages/About'
import StaffDesk from './pages/StaffDesk'
import SignUp from './pages/SignUp'
import Admin from './pages/Admin'
import ChefPage from './pages/chefPage'
import RecipePage from './pages/RecipePage'
import BlogPage from './pages/BlogPage'

const queryClient = new QueryClient()

const routes = [
  { path: '/', element: <Home /> },
  { path: '/signin', element: <SignIn /> },
  { path: '/Chefs', element: <Chefs /> },
  { path: '/chefs', element: <Chefs /> },
  { path: '/Chefs/:id', element: <ChefPage /> },
  { path: '/chefs/:id', element: <ChefPage /> },
  { path: '/Recipe', element: <Recipe /> },
  { path: '/recipe', element: <Recipe /> },
  { path: '/Recipe/:id', element: <RecipePage /> },
  { path: '/recipe/:id', element: <RecipePage /> },
  { path: '/recipes/:id', element: <RecipePage /> },
  { path: '/Blog', element: <Blog /> },
  { path: '/blog', element: <Blog /> },
  { path: '/Blog/:id', element: <BlogPage /> },
  { path: '/blog/:id', element: <BlogPage /> },
  { path: '/blogs/:id', element: <BlogPage /> },
  { path: '/Staff', element: <StaffDesk /> },
  { path: '/staff', element: <StaffDesk /> },
  { path: '/About', element: <About /> },
  { path: '/about', element: <About /> },
  { path: '/SignUp', element: <SignUp /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/Admin', element: <Admin /> },
  { path: '/admin', element: <Admin /> },
]

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
