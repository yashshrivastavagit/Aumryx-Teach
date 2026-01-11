import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockClasses, mockTeachers, getStudentEnrollments } from '../mockData';
import { BookOpen, Video, Calendar, Clock, Search, ArrowRight } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Get student enrollments
  const enrollments = getStudentEnrollments(user?.id || 's1');
  
  // Get enrolled classes with teacher info
  const enrolledClasses = enrollments.map(enrollment => {
    const cls = mockClasses.find(c => c.id === enrollment.classId);
    const teacher = mockTeachers.find(t => t.id === enrollment.teacherId);
    return { ...cls, teacher, enrollment };
  });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-2">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
            Continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="product-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Enrolled Classes</p>
                <p className="heading-2">{enrolledClasses.length}</p>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <Video className="w-5 h-5" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Live Sessions</p>
                <p className="heading-2">3</p>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Upcoming Classes</p>
                <p className="heading-2">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Classes */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">My Classes</h2>
              <Link to="/teachers" className="btn-secondary flex items-center gap-2" style={{ padding: '8px 20px', minHeight: 'auto' }}>
                <Search className="w-4 h-4" />
                Find More Teachers
              </Link>
            </div>

            {enrolledClasses.length > 0 ? (
              <div className="space-y-6">
                {enrolledClasses.map(({ teacher, enrollment, ...cls }) => (
                  <div key={cls.id} className="product-card">
                    <div className="flex gap-4">
                      <img
                        src={teacher?.imageUrl}
                        alt={teacher?.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="heading-3 mb-1">{cls.title}</h3>
                            <Link to={`/teacher/${teacher?.id}`} className="body-small" style={{ color: 'var(--accent-text)' }}>
                              by {teacher?.name}
                            </Link>
                          </div>
                          <span className="px-3 py-1 rounded-full caption" style={{ background: '#D1FAE5', color: '#065F46' }}>
                            Active
                          </span>
                        </div>
                        <p className="body-small mb-3" style={{ color: 'var(--text-secondary)' }}>
                          {cls.description}
                        </p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            <span className="body-small">{cls.schedule}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            <span className="body-small">{cls.duration}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={cls.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary flex items-center gap-2"
                            style={{ padding: '8px 20px', minHeight: 'auto' }}
                          >
                            <Video className="w-4 h-4" />
                            Join Class
                          </a>
                          <Link
                            to={`/teacher/${teacher?.id}`}
                            className="btn-secondary"
                            style={{ padding: '8px 20px', minHeight: 'auto' }}
                          >
                            View Teacher Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="product-card text-center py-20">
                <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <h3 className="heading-3 mb-2">No Classes Yet</h3>
                <p className="body-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Start your learning journey by enrolling with a teacher
                </p>
                <Link to="/teachers" className="btn-primary inline-flex items-center gap-2">
                  Browse Teachers
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <div className="product-card">
              <h3 className="heading-3 mb-4">Upcoming Sessions</h3>
              <div className="space-y-3">
                {enrolledClasses.slice(0, 3).map((cls) => (
                  <div key={cls.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                    <p className="body-small font-semibold mb-1">{cls.title}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span className="caption">{cls.schedule?.split(',')[0]}</span>
                    </div>
                  </div>
                ))}
                {enrolledClasses.length === 0 && (
                  <p className="body-small text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                    No upcoming sessions
                  </p>
                )}
              </div>
            </div>

            {/* Recommended Teachers */}
            <div className="product-card">
              <h3 className="heading-3 mb-4">Recommended Teachers</h3>
              <div className="space-y-3">
                {mockTeachers.slice(0, 3).map(teacher => (
                  <Link key={teacher.id} to={`/teacher/${teacher.id}`} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <img
                      src={teacher.imageUrl}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="body-small font-semibold">{teacher.name}</p>
                      <p className="caption" style={{ color: 'var(--text-secondary)' }}>
                        {teacher.subjects[0]}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/teachers" className="btn-secondary w-full mt-4">
                View All Teachers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;