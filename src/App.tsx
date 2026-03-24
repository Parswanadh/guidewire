import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LanguageSelectScreen from './screens/LanguageSelectScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import LocationScreen from './screens/LocationScreen';
import HomeScreen from './screens/HomeScreen';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0F1E]">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Public route that redirects if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0F1E]">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Navigate to="/language" replace />} />
              <Route path="/language" element={<LanguageSelectScreen />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginScreen />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <SignupScreen />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/location" 
                element={
                  <ProtectedRoute>
                    <LocationScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute>
                    <HomeScreen />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
