import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Landing page components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';

// Dashboard component
import { Dashboard } from './components/dashboard/Dashboard';
// Import any auth-related components you have
import { LoginModal } from './components/LoginModal';
import { SignupModal } from './components/SignupModal'; // Changed to lowercase 'u'

// Auth service (create this if you don't have it)
import authService from './services/authService';

// Landing Page Layout with auth props
const LandingPage = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar onLoginClick={onLoginClick} onSignupClick={onSignupClick} />
      <HeroSection onSignupClick={onSignupClick} />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

// Auth protection helper
const ProtectedRoute = ({ children }) => {
  // Use a more reliable auth check
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  // Define all state variables at the top
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Define the auth success handler here
  const handleAuthSuccess = () => {
    console.log('Auth success handler called');
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setShowSignupModal(false);
    
    console.log('Auth state before redirect:', authService.isAuthenticated());
    
    // Force navigation to dashboard
    console.log('Redirecting to dashboard...');
    window.location.href = '/dashboard';
  };
  
  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = authService.isAuthenticated();
    setIsLoggedIn(isAuthenticated);
    console.log('Initial auth state:', isAuthenticated);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              onLoginClick={() => setShowLoginModal(true)}
              onSignupClick={() => setShowSignupModal(true)}
            />
          } 
        />
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
      
      {/* Auth Modals */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleAuthSuccess}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
      )}
      
      {showSignupModal && (
        <SignupModal // Changed to lowercase 'u'
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </Router>
  );
}

export default App;