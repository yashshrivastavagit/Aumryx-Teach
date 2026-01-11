import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notesService, assignmentsService, communityService, classService } from '../services/api';
import { 
  BookOpen, FileText, ClipboardList, MessageSquare, Plus, 
  Calendar, Users, TrendingUp, AlertCircle, Edit, Trash2,
  Send, CheckCircle
} from 'lucide-react';

const EnhancedTeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Form states
  const [noteForm, setNoteForm] = useState({ title: '', content: '', tags: '' });
  const [assignmentForm, setAssignmentForm] = useState({ 
    title: '', description: '', class_id: '', due_date: '', total_marks: 100 
  });
  const [postForm, setPostForm] = useState({ 
    title: '', content: '', post_type: 'announcement', class_id: '' 
  });

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      // Fetch classes
      const classesData = await classService.getClasses({ teacher_id: user._id });
      setClasses(classesData);

      if (activeTab === 'notes') {
        const notesData = await notesService.getTeacherNotes(user._id);
        setNotes(notesData);
      } else if (activeTab === 'assignments') {
        const assignmentsData = await assignmentsService.getTeacherAssignments(user._id);
        setAssignments(assignmentsData);
      } else if (activeTab === 'community') {
        const postsData = await communityService.getTeacherPosts(user._id);
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      await notesService.createNote({
        title: noteForm.title,
        content: noteForm.content,
        tags: noteForm.tags.split(',').map(t => t.trim()).filter(t => t),
        is_public: true
      });
      setShowCreateModal(false);
      setNoteForm({ title: '', content: '', tags: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await assignmentsService.createAssignment({
        ...assignmentForm,
        total_marks: parseInt(assignmentForm.total_marks),
        due_date: new Date(assignmentForm.due_date).toISOString(),
        status: 'published'
      });
      setShowCreateModal(false);
      setAssignmentForm({ title: '', description: '', class_id: '', due_date: '', total_marks: 100 });
      fetchData();
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await communityService.createPost({
        title: postForm.title,
        content: postForm.content,
        post_type: postForm.post_type,
        class_id: postForm.class_id || null
      });
      setShowCreateModal(false);
      setPostForm({ title: '', content: '', post_type: 'announcement', class_id: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    
    try {
      if (type === 'note') {
        await notesService.deleteNote(id);
      } else if (type === 'assignment') {
        await assignmentsService.deleteAssignment(id);
      } else if (type === 'post') {
        await communityService.deletePost(id);
      }
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const openCreateModal = (type) => {
    setModalType(type);
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-2">Teacher Dashboard</h1>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
            Manage your classes, students, and content
          </p>
        </div>

        {/* Verification Status */}
        {!user?.verified && (
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="product-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <BookOpen className="w-6 h-6" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Total Classes</p>
                <p className="heading-2">{classes.length}</p>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <FileText className="w-6 h-6" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Notes Created</p>
                <p className="heading-2">{notes.length}</p>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <ClipboardList className="w-6 h-6" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Assignments</p>
                <p className="heading-2">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                <MessageSquare className="w-6 h-6" style={{ color: 'var(--accent-text)' }} />
              </div>
              <div>
                <p className="caption">Community Posts</p>
                <p className="heading-2">{posts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['overview', 'notes', 'assignments', 'community'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-semibold transition-all capitalize ${
                activeTab === tab ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="product-card">
                <h3 className="heading-3 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => openCreateModal('note')} className="btn-secondary text-left p-4">
                    <FileText className="w-5 h-5 mb-2" />
                    <p className="body-small font-semibold">Create Note</p>
                  </button>
                  <button onClick={() => openCreateModal('assignment')} className="btn-secondary text-left p-4">
                    <ClipboardList className="w-5 h-5 mb-2" />
                    <p className="body-small font-semibold">New Assignment</p>
                  </button>
                  <button onClick={() => openCreateModal('post')} className="btn-secondary text-left p-4">
                    <MessageSquare className="w-5 h-5 mb-2" />
                    <p className="body-small font-semibold">Create Post</p>
                  </button>
                  <button className="btn-secondary text-left p-4">
                    <Calendar className="w-5 h-5 mb-2" />
                    <p className="body-small font-semibold">Schedule Class</p>
                  </button>
                </div>
              </div>

              <div className="product-card">
                <h3 className="heading-3 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {posts.slice(0, 3).map(post => (
                    <div key={post._id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                      <MessageSquare className="w-5 h-5 mt-1" style={{ color: 'var(--accent-strong)' }} />
                      <div>
                        <p className="body-small font-semibold">{post.title}</p>
                        <p className="caption">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="body-small text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                      No recent activity
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-3">My Notes</h3>
                <button onClick={() => openCreateModal('note')} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Note
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => (
                  <div key={note._id} className="product-card">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="heading-3">{note.title}</h4>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('note', note._id)} className="p-1 hover:bg-red-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="body-small mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {note.content.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {note.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-full caption" style={{ background: 'var(--accent-wash)', color: 'var(--accent-text)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="caption">{new Date(note.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-3">Assignments</h3>
                <button onClick={() => openCreateModal('assignment')} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Assignment
                </button>
              </div>
              <div className="space-y-4">
                {assignments.map(assignment => (
                  <div key={assignment._id} className="product-card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="heading-3 mb-2">{assignment.title}</h4>
                        <p className="body-small mb-3" style={{ color: 'var(--text-secondary)' }}>
                          {assignment.description}
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            <span className="body-small">Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            <span className="body-small">Total Marks: {assignment.total_marks}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full caption ${
                            assignment.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-secondary" style={{ padding: '6px 12px', minHeight: 'auto' }}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('assignment', assignment._id)} className="btn-secondary" style={{ padding: '6px 12px', minHeight: 'auto' }}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-3">Community Posts</h3>
                <button onClick={() => openCreateModal('post')} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Post
                </button>
              </div>
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post._id} className="product-card">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full caption ${
                            post.post_type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                            post.post_type === 'discussion' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {post.post_type}
                          </span>
                        </div>
                        <h4 className="heading-3 mb-2">{post.title}</h4>
                        <p className="body-medium mb-4">{post.content}</p>
                        <div className="flex gap-4">
                          <span className="body-small" style={{ color: 'var(--text-muted)' }}>
                            {post.likes_count} likes
                          </span>
                          <span className="body-small" style={{ color: 'var(--text-muted)' }}>
                            {post.comments_count} comments
                          </span>
                          <span className="caption">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-secondary" style={{ padding: '6px 12px', minHeight: 'auto' }}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('post', post._id)} className="btn-secondary" style={{ padding: '6px 12px', minHeight: 'auto' }}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="product-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="heading-3 mb-6">
              Create {modalType === 'note' ? 'Note' : modalType === 'assignment' ? 'Assignment' : 'Post'}
            </h2>

            {/* Note Form */}
            {modalType === 'note' && (
              <form onSubmit={handleCreateNote} className="space-y-4">
                <div>
                  <label className="body-small font-medium mb-2 block">Title</label>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border"
                    required
                  />
                </div>
                <div>
                  <label className="body-small font-medium mb-2 block">Content</label>
                  <textarea
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border"
                    rows={6}
                    required
                  />
                </div>
                <div>
                  <label className="body-small font-medium mb-2 block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={noteForm.tags}
                    onChange={(e) => setNoteForm({...noteForm, tags: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border"
                    placeholder="e.g. math, algebra, important"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Create Note
                  </button>
                </div>
              </form>
            )}

            {/* Assignment Form */}
            {modalType === 'assignment' && (
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="body-small font-medium mb-2 block">Title</label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border"
                    required
                  />
                </div>
                <div>
                  <label className="body-small font-medium mb-2 block">Description</label>
                  <textarea
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="body-small font-medium mb-2 block">Class</label>
                    <select
                      value={assignmentForm.class_id}
                      onChange={(e) => setAssignmentForm({...assignmentForm, class_id: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border"
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="body-small font-medium mb-2 block">Total Marks</label>
                    <input
                      type="number"
                      value={assignmentForm.total_marks}
                      onChange={(e) => setAssignmentForm({...assignmentForm, total_marks: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="body-small font-medium mb-2 block">Due Date</label>
                  <input
                    type="datetime-local"
                    value={assignmentForm.due_date}
                    onChange={(e) => setAssignmentForm({...assignmentForm, due_date: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Create Assignment
                  </button>
                </div>
              </form>
            )}

            {/* Post Form */}
            {modalType === 'post' && (
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="body-small font-medium mb-2 block">Title</label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border"
                    required
                  />
                </div>
                <div>
                  <label className="body-small font-medium mb-2 block">Content</label>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border"
                    rows={5}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="body-small font-medium mb-2 block">Post Type</label>
                    <select
                      value={postForm.post_type}
                      onChange={(e) => setPostForm({...postForm, post_type: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border"
                    >
                      <option value="announcement">Announcement</option>
                      <option value="discussion">Discussion</option>
                      <option value="resource">Resource</option>
                    </select>
                  </div>
                  <div>
                    <label className="body-small font-medium mb-2 block">Class (Optional)</label>
                    <select
                      value={postForm.class_id}
                      onChange={(e) => setPostForm({...postForm, class_id: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border"
                    >
                      <option value="">All Students</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Publish Post
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTeacherDashboard;
