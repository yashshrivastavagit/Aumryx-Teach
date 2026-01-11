import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { teacherService, classService, enrollmentService, ratingsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Users, Clock, CheckCircle, Calendar, Video, Mail, ArrowLeft, BookOpen, Award } from 'lucide-react';

const TeacherProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchTeacherData();
  }, [id]);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      
      // Fetch teacher profile
      const teacherData = await teacherService.getTeacherById(id);
      setTeacher(teacherData);
      
      // Fetch teacher's classes
      const classesData = await classService.getClasses({ teacher_id: id });
      setClasses(classesData);
      
      // Fetch ratings
      try {
        const ratingsData = await ratingsService.getTeacherRatings(id);
        setRatings(ratingsData);
      } catch (err) {
        console.log('No ratings yet');
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (classItem) => {
    if (!isAuthenticated || user?.user_type !== 'student') {
      navigate('/login');
      return;
    }
    setSelectedClass(classItem);
    setShowEnrollModal(true);
  };

  const confirmEnrollment = async () => {
    if (!selectedClass) return;
    
    setEnrolling(true);
    try {
      await enrollmentService.enrollInClass(selectedClass._id);
      setShowEnrollModal(false);
      alert(`Successfully enrolled in ${selectedClass.title}! Check your dashboard.`);
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.detail || 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}></div>
          <p className="body-medium">Loading teacher profile...</p>
        </div>
      </div>
    );
  }

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
                  src={teacher.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'}
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
                      <span className="body-medium font-semibold">{teacher.rating || 0}</span>
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>({ratings.length} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <span className="body-medium font-semibold">{teacher.students_count || 0}</span>
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <span className="body-medium font-semibold">{teacher.experience || 'N/A'}</span>
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                      <span className="body-medium font-semibold">{classes.length}</span>
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>courses</span>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-2">
                    {(teacher.subjects || []).map((subject, idx) => (
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
              <p className="body-medium mb-4">{teacher.bio || 'No bio available'}</p>
              <div className="space-y-2">
                <p className="body-small">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Qualification:</span>{' '}
                  {teacher.qualification || 'Not specified'}
                </p>
                <p className="body-small">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Experience:</span>{' '}
                  {teacher.experience || 'Not specified'} of teaching
                </p>
              </div>
            </div>

            {/* Courses Offered */}
            <div className="product-card">
              <h2 className="heading-3 mb-4">Courses Offered ({classes.length})</h2>
              {classes.length === 0 ? (
                <p className="body-medium text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                  No courses available yet
                </p>
              ) : (
                <div className="space-y-4">
                  {classes.map(cls => (
                    <div key={cls._id} className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-light)' }}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="heading-3 mb-1">{cls.title}</h3>
                          <p className="body-small mb-2" style={{ color: 'var(--text-secondary)' }}>{cls.subject}</p>
                          <p className="body-medium mb-3">{cls.description}</p>
                          
                          <div className="flex flex-wrap gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                              <span className="body-small">{cls.schedule}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                              <span className="body-small">{cls.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                              <span className="body-small">{cls.enrolled_students}/{cls.max_students} enrolled</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="heading-2 mb-2" style={{ color: 'var(--accent-text)' }}>₹{cls.price}</div>
                          <button 
                            onClick={() => handleEnroll(cls)}
                            disabled={cls.enrolled_students >= cls.max_students}
                            className={`btn-primary ${cls.enrolled_students >= cls.max_students ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{ padding: '8px 20px', minHeight: 'auto' }}
                          >
                            {cls.enrolled_students >= cls.max_students ? 'Class Full' : 'Enroll Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            {ratings.length > 0 && (
              <div className="product-card">
                <h2 className="heading-3 mb-4">Student Reviews</h2>
                <div className="space-y-4">
                  {ratings.slice(0, 5).map(rating => (
                    <div key={rating._id} className="p-4 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < rating.rating ? 'fill-current' : ''}`}
                            style={{ color: 'var(--accent-strong)' }} 
                          />
                        ))}
                        <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.review && (
                        <p className="body-medium">{rating.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            {teacher.availability && teacher.availability.length > 0 && (
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
            )}
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:col-span-1">
            <div className="product-card sticky top-24">
              <div className="text-center mb-6">
                <p className="body-small mb-2" style={{ color: 'var(--text-secondary)' }}>Starting from</p>
                <div className="heading-1" style={{ color: 'var(--accent-text)' }}>₹{teacher.hourly_rate || 0}</div>
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
                  <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-strong)' }} />
                  <div>
                    <p className="body-small font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {classes.length} Courses
                    </p>
                    <p className="caption">Multiple courses available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                  <Award className="w-5 h-5" style={{ color: 'var(--accent-strong)' }} />
                  <div>
                    <p className="body-small font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Verified Profile
                    </p>
                    <p className="caption">Quality assured</p>
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${teacher.email}`}
                className="btn-secondary w-full flex items-center justify-center gap-2 mb-3"
              >
                <Mail className="w-4 h-4" />
                Contact Teacher
              </a>

              <p className="caption text-center" style={{ color: 'var(--text-secondary)' }}>
                Choose a course above to enroll
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="product-card max-w-md w-full">
            <h2 className="heading-3 mb-4">Confirm Enrollment</h2>
            <div className="mb-4">
              <p className="body-medium mb-2">
                <strong>Course:</strong> {selectedClass.title}
              </p>
              <p className="body-medium mb-2">
                <strong>Teacher:</strong> {teacher.name}
              </p>
              <p className="body-medium mb-2">
                <strong>Price:</strong> ₹{selectedClass.price}
              </p>
              <p className="body-medium mb-2">
                <strong>Schedule:</strong> {selectedClass.schedule}
              </p>
            </div>
            <div className="p-4 rounded-lg mb-6" style={{ background: 'var(--accent-wash)' }}>
              <p className="body-small" style={{ color: 'var(--accent-text)' }}>
                After enrollment, you'll get immediate access to the course and the teacher will share the class meeting link.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowEnrollModal(false)} 
                className="btn-secondary flex-1"
                disabled={enrolling}
              >
                Cancel
              </button>
              <button 
                onClick={confirmEnrollment} 
                className="btn-primary flex-1"
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 'Confirm & Enroll'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfilePage;
