import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, LogOut, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="nav-header">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          <Users className="w-6 h-6" style={{ color: 'var(--accent-strong)' }} />
          <span>Aumryx Teach</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/teachers" className="nav-link">Find Teachers</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to={user?.user_type === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} 
                className="nav-link"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-link flex items-center gap-1">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px', minHeight: 'auto' }}>
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            <Link to="/teachers" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Find Teachers
            </Link>
            <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.user_type === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} 
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="nav-link flex items-center gap-1 w-full justify-start">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;