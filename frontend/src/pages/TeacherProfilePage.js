import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockTeachers } from '../mockData';
import { useAuth } from '../context/AuthContext';
import { Star, Users, Clock, CheckCircle, Calendar, Video, Mail, ArrowLeft } from 'lucide-react';

const TeacherProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const teacher = mockTeachers.find(t => t.id === id);

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="heading-2 mb-4">Teacher not found</h2>
          <Link to="/teachers" className="btn-primary">
            Browse Teachers
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    if (!isAuthenticated || user?.userType !== 'student') {
      navigate('/login');
      return;
    }
    setShowEnrollModal(true);
  };

  const confirmEnrollment = () => {
    // Mock enrollment
    setShowEnrollModal(false);
    alert('Enrollment successful! You will receive class details via email.');
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Link to="/teachers" className="flex items-center gap-2 mb-6 nav-link inline-flex">
          <ArrowLeft className="w-4 h-4" />
          Back to Teachers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="product-card">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="heading-2 mb-2">{teacher.name}</h1>
                      {teacher.verified && (
                        <div className="flex items-center gap-1 mb-3">
                          <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent-strong)' }} />
                          <span className="body-small font-semibold" style={{ color: 'var(--accent-text)' }}>
                            Verified Teacher
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-current" style={{ color: 'var(--accent-strong)' }} />
                      <span className="body-medium font-semibold">{teacher.rating}</span>
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <span className="body-medium font-semibold">{teacher.studentsCount}</span>
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <span className="body-medium font-semibold">{teacher.experience}</span>
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>experience</span>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full body-small font-medium"
                        style={{ background: 'var(--accent-wash)', color: 'var(--accent-text)' }}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="product-card">
              <h2 className="heading-3 mb-4">About</h2>
              <p className="body-medium mb-4">{teacher.bio}</p>
              <div className="space-y-2">
                <p className="body-small">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Qualification:</span>{' '}
                  {teacher.qualification}
                </p>
                <p className="body-small">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Experience:</span>{' '}
                  {teacher.experience} of teaching
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="product-card">
              <h2 className="heading-3 mb-4">Availability</h2>
              <div className="space-y-2">
                {teacher.availability.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: 'var(--accent-strong)' }} />
                    <span className="body-medium">{slot}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teaching Style */}
            <div className="product-card">
              <h2 className="heading-3 mb-4">Teaching Approach</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent-strong)' }} />
                  <span className="body-medium">Interactive sessions with real-world examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent-strong)' }} />
                  <span className="body-medium">Personalized attention to each student</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent-strong)' }} />
                  <span className="body-medium">Regular assessments and feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent-strong)' }} />
                  <span className="body-medium">Study materials and resources provided</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="product-card sticky top-24">
              <div className="text-center mb-6">
                <p className="body-small mb-2" style={{ color: 'var(--text-secondary)' }}>Hourly Rate</p>
                <div className="heading-1" style={{ color: 'var(--accent-text)' }}>₹{teacher.hourlyRate}</div>
                <p className="body-small" style={{ color: 'var(--text-secondary)' }}>per hour</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                  <Video className="w-5 h-5" style={{ color: 'var(--accent-strong)' }} />
                  <div>
                    <p className="body-small font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Online Classes
                    </p>
                    <p className="caption">Via Zoom/Google Meet</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                  <Calendar className="w-5 h-5" style={{ color: 'var(--accent-strong)' }} />
                  <div>
                    <p className="body-small font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Flexible Schedule
                    </p>
                    <p className="caption">Book sessions easily</p>
                  </div>
                </div>
              </div>

              <button onClick={handleEnroll} className="btn-primary w-full mb-3">
                Enroll Now
              </button>

              <a
                href={`mailto:${teacher.email}`}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact Teacher
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="product-card max-w-md w-full">
            <h2 className="heading-3 mb-4">Confirm Enrollment</h2>
            <p className="body-medium mb-6">
              You are about to enroll with <strong>{teacher.name}</strong> at ₹{teacher.hourlyRate}/hour.
            </p>
            <div className="p-4 rounded-lg mb-6" style={{ background: 'var(--accent-wash)' }}>
              <p className="body-small" style={{ color: 'var(--accent-text)' }}>
                After enrollment, the teacher will contact you to schedule your first class.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEnrollModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={confirmEnrollment} className="btn-primary flex-1">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfilePage;
