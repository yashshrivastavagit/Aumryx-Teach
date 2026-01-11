import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Mail, Lock, User, GraduationCap, BookOpen, AlertCircle } from 'lucide-react';

const SignupPage = () => {
  const [userType, setUserType] = useState('teacher');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    subjects: '',
    experience: '',
    qualification: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (userType === 'teacher' && (!formData.subjects || !formData.experience)) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Prepare signup data
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        user_type: userType,
      };

      // Add teacher-specific fields
      if (userType === 'teacher') {
        signupData.subjects = formData.subjects.split(',').map(s => s.trim());
        signupData.experience = formData.experience;
        signupData.qualification = formData.qualification || null;
        signupData.hourly_rate = 500; // Default rate
      }

      // Call real API
      const response = await authService.signup(signupData);

      // Update auth context
      login(response);
      
      // Navigate based on user type
      if (userType === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4" style={{ background: 'var(--bg-section)' }}>
      <div className="w-full max-w-2xl">
        <div className="product-card">
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-2">Join Aumryx Teach</h1>
            <p className="body-small">Create your account and start your journey</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-2 mb-6 p-1 rounded-full" style={{ background: 'var(--bg-section)' }}>
            <button
              onClick={() => setUserType('teacher')}
              className={`flex-1 py-2 px-4 rounded-full transition-all ${
                userType === 'teacher' ? 'btn-primary' : 'bg-transparent'
              }`}
              style={userType !== 'teacher' ? { color: 'var(--text-secondary)' } : {}}
              disabled={loading}
            >
              I'm a Teacher
            </button>
            <button
              onClick={() => setUserType('student')}
              className={`flex-1 py-2 px-4 rounded-full transition-all ${
                userType === 'student' ? 'btn-primary' : 'bg-transparent'
              }`}
              style={userType !== 'student' ? { color: 'var(--text-secondary)' } : {}}
              disabled={loading}
            >
              I'm a Student
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <AlertCircle className="w-5 h-5" />
              <span className="body-small">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="body-small font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-full border transition-all"
                    style={{ borderColor: 'var(--border-light)' }}
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="body-small font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-full border transition-all"
                    style={{ borderColor: 'var(--border-light)' }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="body-small font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-full border transition-all"
                  style={{ borderColor: 'var(--border-light)' }}
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            {/* Teacher-specific fields */}
            {userType === 'teacher' && (
              <>
                <div>
                  <label className="body-small font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                    Subjects You Teach *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      name="subjects"
                      value={formData.subjects}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-full border transition-all"
                      style={{ borderColor: 'var(--border-light)' }}
                      placeholder="e.g. Mathematics, Physics (comma separated)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="body-small font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                      Teaching Experience *
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-full border transition-all"
                        style={{ borderColor: 'var(--border-light)' }}
                        placeholder="e.g. 5 years"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="body-small font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-full border transition-all"
                      style={{ borderColor: 'var(--border-light)' }}
                      placeholder="e.g. M.Sc. Mathematics"
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn-primary w-full">
              Create {userType === 'teacher' ? 'Teacher' : 'Student'} Account
            </button>
          </form>

          {userType === 'teacher' && (
            <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--accent-wash)' }}>
              <p className="body-small" style={{ color: 'var(--accent-text)' }}>
                Your profile will be reviewed and verified within 24 hours.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="body-small">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: 'var(--accent-text)' }}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;