import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipe';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/protectedRoute';
import AdminRoute from './components/AdminRoute';
import "bootstrap/dist/css/bootstrap.min.css";
import SavedRecipesPage from './pages/SavedRecipePage';
import MyRecipes from './pages/MyRecipePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDetails from './pages/admin/UserDetails';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
        <Route path="/" element={<HomePage />} />
  <Route path="/home" element={<HomePage />} />
  <Route path="/recipes/:id" element={<RecipeDetailPage />} />
  <Route path="/saved-recipes" element={<SavedRecipesPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/my-recipe" element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
  <Route path="/create-recipe" element={<ProtectedRoute><CreateRecipePage /></ProtectedRoute>} />
  <Route path="/edit-recipe/:id" element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>} />

  {/* Admin routes */}
  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
  <Route path="/admin/user-details/:id" element={<AdminRoute><UserDetails /></AdminRoute>} />
      
      
  
          </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
