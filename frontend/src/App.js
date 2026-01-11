import React from "react";
import "./App.css";
import "./styles/theme.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TeacherBrowsePage from "./pages/TeacherBrowsePage";
import TeacherProfilePage from "./pages/TeacherProfilePage";
import TeacherDashboard from "./pages/TeacherDashboard";
import EnhancedTeacherDashboard from "./pages/EnhancedTeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminPanel from "./pages/AdminPanel";

// Protected Route Component
const ProtectedRoute = ({ children, requiredType }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}></div>
          <p className="body-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredType && user?.userType !== requiredType) {
    return <Navigate to={user?.userType === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/teachers" element={<TeacherBrowsePage />} />
        <Route path="/teacher/:id" element={<TeacherProfilePage />} />

        {/* Protected Routes - Teacher */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requiredType="teacher">
              <EnhancedTeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Student */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredType="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Panel - No auth for MVP */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
