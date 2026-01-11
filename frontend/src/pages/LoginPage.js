import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [userType, setUserType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Mock login validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock user data
    const userData = {
      id: userType === 'teacher' ? 't1' : 's1',
      name: userType === 'teacher' ? 'Dr. Priya Sharma' : 'Riya Gupta',
      email: email,
      userType: userType,
      verified: true
    };

    login(userData);
    
    // Navigate to respective dashboard
    if (userType === 'teacher') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4" style={{ background: 'var(--bg-section)' }}>
      <div className="w-full max-w-md">
        <div className="product-card">
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-2">Welcome Back</h1>
            <p className="body-small">Login to your Aumryx Teach account</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-2 mb-6 p-1 rounded-full" style={{ background: 'var(--bg-section)' }}>
            <button
              onClick={() => setUserType('student')}
              className={`flex-1 py-2 px-4 rounded-full transition-all ${
                userType === 'student' ? 'btn-primary' : 'bg-transparent'
              }`}
              style={userType !== 'student' ? { color: 'var(--text-secondary)' } : {}}
            >
              Student
            </button>
            <button
              onClick={() => setUserType('teacher')}
              className={`flex-1 py-2 px-4 rounded-full transition-all ${
                userType === 'teacher' ? 'btn-primary' : 'bg-transparent'
              }`}
              style={userType !== 'teacher' ? { color: 'var(--text-secondary)' } : {}}
            >
              Teacher
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <AlertCircle className="w-5 h-5" />
              <span className="body-small">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="body-small font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full border transition-all"
                  style={{ borderColor: 'var(--border-light)' }}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="body-small font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full border transition-all"
                  style={{ borderColor: 'var(--border-light)' }}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Login as {userType === 'teacher' ? 'Teacher' : 'Student'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="body-small">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold" style={{ color: 'var(--accent-text)' }}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;