import React from 'react';
import { useAuth } from '../context/AuthContext';
import { mockTeachers, mockClasses, mockEnrollments, getTeacherClasses, getTeacherEnrollments } from '../mockData';
import { Users, BookOpen, DollarSign, Video, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  
  // Get teacher data
  const teacherData = mockTeachers.find(t => t.id === user?.id) || mockTeachers[0];
  const classes = getTeacherClasses(teacherData.id);
  const enrollments = getTeacherEnrollments(teacherData.id);
  
  // Calculate stats
  const totalStudents = enrollments.length;
  const totalEarnings = enrollments.filter(e => e.paymentStatus === 'paid').length * teacherData.hourlyRate;
  const activeClasses = classes.length;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-2">Welcome back, {teacherData.name}!</h1>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
            Here's an overview of your teaching activity
          </p>
        </div>

        {/* Verification Status */}
        {!teacherData.verified && (
          <div className="product-card mb-8" style={{ background: '#FEF3C7', borderColor: '#F59E0B' }}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6" style={{ color: '#D97706' }} />
              <div>
                <h3 className="heading-3 mb-1" style={{ color: '#92400E' }}>Profile Under Review</h3>
                <p className="body-small" style={{ color: '#92400E' }}>
                  Your profile is being verified. This usually takes 24 hours. You'll be notified once approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="product-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Total Students</p>
                <p className="heading-2">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Active Classes</p>
                <p className="heading-2">{activeClasses}</p>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <DollarSign className="w-5 h-5" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Total Earnings</p>
                <p className="heading-2">₹{totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Rating</p>
                <p className="heading-2">{teacherData.rating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Classes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">My Classes</h2>
              <button className="btn-primary" style={{ padding: '8px 20px', minHeight: 'auto' }}>
                Add New Class
              </button>
            </div>

            <div className="space-y-4">
              {classes.length > 0 ? (
                classes.map(cls => (
                  <div key={cls.id} className="product-card">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="heading-3 mb-1">{cls.title}</h3>
                        <p className="caption" style={{ color: 'var(--text-secondary)' }}>{cls.subject}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full body-small" style={{ background: 'var(--accent-wash)', color: 'var(--accent-text)' }}>
                        {cls.enrolledStudents}/{cls.maxStudents} enrolled
                      </span>
                    </div>
                    <p className="body-small mb-3">{cls.description}</p>
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
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                      <span className="heading-3" style={{ color: 'var(--accent-text)' }}>₹{cls.price}</span>
                      <div className="flex gap-2">
                        <button className="btn-secondary" style={{ padding: '6px 16px', minHeight: 'auto' }}>
                          Edit
                        </button>
                        <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '6px 16px', minHeight: 'auto' }}>
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="product-card text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                  <p className="body-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                    You haven't created any classes yet
                  </p>
                  <button className="btn-primary">Create Your First Class</button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div>
            <h2 className="heading-3 mb-6">Recent Enrollments</h2>
            <div className="space-y-4">
              {enrollments.length > 0 ? (
                enrollments.slice(0, 5).map(enrollment => {
                  const cls = classes.find(c => c.id === enrollment.classId);
                  return (
                    <div key={enrollment.id} className="product-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="body-medium font-semibold mb-1">New Student Enrolled</p>
                          <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                            {cls?.title || 'Class'}
                          </p>
                          <p className="caption">Enrolled on {enrollment.enrolledDate}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full caption" style={{ background: '#D1FAE5', color: '#065F46' }}>
                          {enrollment.paymentStatus}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="product-card text-center py-12">
                  <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                  <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                    No enrollments yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 product-card">
          <h2 className="heading-3 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="btn-secondary text-left">
              <BookOpen className="w-5 h-5 mb-2" />
              <p className="body-small font-semibold">Create New Class</p>
            </button>
            <button className="btn-secondary text-left">
              <Calendar className="w-5 h-5 mb-2" />
              <p className="body-small font-semibold">Update Schedule</p>
            </button>
            <button className="btn-secondary text-left">
              <Users className="w-5 h-5 mb-2" />
              <p className="body-small font-semibold">View All Students</p>
            </button>
            <button className="btn-secondary text-left">
              <DollarSign className="w-5 h-5 mb-2" />
              <p className="body-small font-semibold">Earnings Report</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;