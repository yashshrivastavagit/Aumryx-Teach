import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherService } from '../services/api';
import { Search, Star, Users, Clock, CheckCircle } from 'lucide-react';

const TeacherBrowsePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch teachers from API
  useEffect(() => {
    fetchTeachers();
  }, [selectedSubject]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const params = {
        verified_only: true
      };
      
      if (selectedSubject !== 'all') {
        params.subject = selectedSubject;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }

      const data = await teacherService.getTeachers(params);
      setTeachers(data);
      setError('');
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        fetchTeachers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get unique subjects from teachers
  const allSubjects = ['all', ...new Set(teachers.flatMap(t => t.subjects || []))];

  // Filter teachers on frontend for immediate feedback
  const filteredTeachers = teachers.filter(teacher => {
    if (searchTerm) {
      const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (teacher.subjects && teacher.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchesSearch;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-1 mb-4">Find Your Perfect Teacher</h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
            Browse verified educators and start learning today
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="product-card">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by teacher name or subject..."
                  className="w-full pl-10 pr-4 py-3 rounded-full border transition-all"
                  style={{ borderColor: 'var(--border-light)' }}
                />
              </div>

              {/* Subject Filter */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-3 rounded-full border transition-all"
                style={{ borderColor: 'var(--border-light)' }}
              >
                {allSubjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
                 style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}></div>
            <p className="body-medium">Loading teachers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="body-large" style={{ color: '#991B1B' }}>{error}</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="body-medium">
              Found <span className="font-semibold" style={{ color: 'var(--accent-text)' }}>{filteredTeachers.length}</span> teachers
            </p>
          </div>
        )}

        {/* Teacher Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(teacher => (
              <Link key={teacher._id} to={`/teacher/${teacher._id}`} className="product-card block">
                {/* Teacher Image */}
                <div className="mb-4">
                  <img
                    src={teacher.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'}
                    alt={teacher.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Teacher Info */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="heading-3 mb-1">{teacher.name}</h3>
                    {teacher.verified && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" style={{ color: 'var(--accent-strong)' }} />
                        <span className="caption" style={{ color: 'var(--accent-text)' }}>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(teacher.subjects || []).map((subject, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full body-small"
                      style={{ background: 'var(--accent-wash)', color: 'var(--accent-text)' }}
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" style={{ color: 'var(--accent-strong)' }} />
                    <span className="body-small font-semibold">{teacher.rating || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <span className="body-small">{teacher.students_count || 0} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <span className="body-small">{teacher.experience || 'N/A'}</span>
                  </div>
                </div>

                {/* Bio */}
                {teacher.bio && (
                  <p className="body-small mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {teacher.bio.length > 100 ? teacher.bio.substring(0, 100) + '...' : teacher.bio}
                  </p>
                )}

                {/* Pricing */}
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center justify-between">
                    <span className="body-small" style={{ color: 'var(--text-secondary)' }}>Starting from</span>
                    <span className="heading-3" style={{ color: 'var(--accent-text)' }}>₹{teacher.hourly_rate || 0}/hr</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredTeachers.length === 0 && (
          <div className="text-center py-20">
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              No teachers found matching your criteria. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherBrowsePage;
