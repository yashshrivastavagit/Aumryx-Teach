import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { CheckCircle, XCircle, Users, Clock, Mail, BookOpen, AlertCircle } from 'lucide-react';

const AdminPanel = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, [activeTab]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (activeTab === 'pending') {
        const data = await adminService.getPendingTeachers();
        setPendingTeachers(data);
      } else {
        const data = await adminService.getAllTeachers();
        setAllTeachers(data);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (teacherId) => {
    try {
      await adminService.verifyTeacher(teacherId);
      setSuccessMessage('Teacher verified successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchTeachers();
    } catch (err) {
      console.error('Error verifying teacher:', err);
      setError('Failed to verify teacher.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUnverify = async (teacherId) => {
    try {
      await adminService.unverifyTeacher(teacherId);
      setSuccessMessage('Teacher unverified successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchTeachers();
    } catch (err) {
      console.error('Error unverifying teacher:', err);
      setError('Failed to unverify teacher.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const teachersToDisplay = activeTab === 'pending' ? pendingTeachers : allTeachers;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-2">Admin Panel</h1>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
            Manage teacher verifications and platform users
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-lg" style={{ background: '#D1FAE5', color: '#065F46' }}>
            <CheckCircle className="w-5 h-5" />
            <span className="body-medium">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-lg" style={{ background: '#FEE2E2', color: '#991B1B' }}>
            <AlertCircle className="w-5 h-5" />
            <span className="body-medium">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Pending ({pendingTeachers.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'all' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            All Teachers ({allTeachers.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
                 style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}></div>
            <p className="body-medium">Loading teachers...</p>
          </div>
        )}

        {/* Teachers List */}
        {!loading && (
          <div className="space-y-4">
            {teachersToDisplay.length === 0 ? (
              <div className="text-center py-20 product-card">
                <Users className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                  {activeTab === 'pending' ? 'No pending teachers' : 'No teachers found'}
                </p>
              </div>
            ) : (
              teachersToDisplay.map(teacher => (
                <div key={teacher._id} className="product-card">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Teacher Image */}
                    <img
                      src={teacher.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                      alt={teacher.name}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />

                    {/* Teacher Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="heading-3 mb-1">{teacher.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            <span className="body-small">{teacher.email}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full body-small ${
                          teacher.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {teacher.verified ? 'Verified' : 'Pending Review'}
                        </span>
                      </div>

                      {/* Subjects */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(teacher.subjects || []).map((subject, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full body-small"
                            style={{ background: 'var(--accent-wash)', color: 'var(--accent-text)' }}
                          >
                            <BookOpen className="w-3 h-3 inline mr-1" />
                            {subject}
                          </span>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="caption mb-1">Experience</p>
                          <p className="body-small font-semibold">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {teacher.experience || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="caption mb-1">Qualification</p>
                          <p className="body-small font-semibold">{teacher.qualification || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="caption mb-1">Hourly Rate</p>
                          <p className="body-small font-semibold">₹{teacher.hourly_rate || 0}/hr</p>
                        </div>
                      </div>

                      {/* Bio */}
                      {teacher.bio && (
                        <p className="body-small mb-4" style={{ color: 'var(--text-secondary)' }}>
                          {teacher.bio}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        {!teacher.verified ? (
                          <button
                            onClick={() => handleVerify(teacher._id)}
                            className="btn-primary flex items-center gap-2"
                            style={{ padding: '8px 20px', minHeight: 'auto' }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Verify Teacher
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnverify(teacher._id)}
                            className="btn-secondary flex items-center gap-2"
                            style={{ padding: '8px 20px', minHeight: 'auto' }}
                          >
                            <XCircle className="w-4 h-4" />
                            Unverify
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
