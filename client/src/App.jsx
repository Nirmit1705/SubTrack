import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Landing page components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';

// Dashboard component
import { Dashboard } from './components/dashboard/Dashboard';

// Landing Page Layout
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

// Auth protection helper
const ProtectedRoute = ({ children }) => {
  // This is a simplified auth check. In a real app, you'd use a more robust solution.
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  // For demo purposes - set a flag to show dashboard directly
  // Remove this in production or replace with proper auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Simulating an authenticated user for demo purposes
    // Remove this in production or replace with proper auth check
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated');
      if (auth === 'true') {
        setIsLoggedIn(true);
      }
    };
    
    checkAuth();
    
    // For demo - uncomment to auto-login
    // localStorage.setItem('isAuthenticated', 'true');
    // setIsLoggedIn(true);
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;