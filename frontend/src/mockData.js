// Mock data for Aumryx Teach platform

export const mockTeachers = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@example.com',
    subjects: ['Mathematics', 'Physics'],
    experience: '12 years',
    qualification: 'Ph.D. in Mathematics, M.Sc. Physics',
    bio: 'Passionate educator specializing in making complex concepts simple. Former CBSE school teacher, now helping students excel in competitive exams.',
    hourlyRate: 800,
    verified: true,
    rating: 4.8,
    studentsCount: 145,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    availability: ['Monday 5-8 PM', 'Wednesday 5-8 PM', 'Saturday 10 AM-2 PM']
  },
  {
    id: '2',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    subjects: ['English', 'Communication Skills'],
    experience: '8 years',
    qualification: 'M.A. English Literature, TESOL Certified',
    bio: 'Helping students master English for academics and professional growth. Specialized in IELTS, TOEFL, and business communication.',
    hourlyRate: 600,
    verified: true,
    rating: 4.9,
    studentsCount: 203,
    imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop',
    availability: ['Tuesday 6-9 PM', 'Thursday 6-9 PM', 'Sunday 9 AM-12 PM']
  },
  {
    id: '3',
    name: 'Anjali Desai',
    email: 'anjali.desai@example.com',
    subjects: ['Chemistry', 'Biology'],
    experience: '10 years',
    qualification: 'M.Sc. Chemistry, B.Ed.',
    bio: 'Making science fun and understandable. Experienced in coaching for NEET, JEE, and board exams with proven results.',
    hourlyRate: 750,
    verified: true,
    rating: 4.7,
    studentsCount: 178,
    imageUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
    availability: ['Monday 4-7 PM', 'Friday 4-7 PM', 'Saturday 2-6 PM']
  },
  {
    id: '4',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    subjects: ['Computer Science', 'Programming'],
    experience: '6 years',
    qualification: 'B.Tech Computer Science, AWS Certified',
    bio: 'Teaching coding and computer science fundamentals. Helping students prepare for tech careers with hands-on projects.',
    hourlyRate: 900,
    verified: true,
    rating: 4.9,
    studentsCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    availability: ['Wednesday 7-10 PM', 'Saturday 10 AM-1 PM', 'Sunday 3-6 PM']
  },
  {
    id: '5',
    name: 'Meera Patel',
    email: 'meera.patel@example.com',
    subjects: ['Social Studies', 'History'],
    experience: '15 years',
    qualification: 'M.A. History, B.Ed.',
    bio: 'Bringing history to life through storytelling. 15 years of teaching experience with focus on board exam preparation.',
    hourlyRate: 550,
    verified: true,
    rating: 4.6,
    studentsCount: 192,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    availability: ['Monday 5-8 PM', 'Thursday 5-8 PM', 'Sunday 11 AM-2 PM']
  },
  {
    id: '6',
    name: 'Arjun Kapoor',
    email: 'arjun.kapoor@example.com',
    subjects: ['Economics', 'Business Studies'],
    experience: '9 years',
    qualification: 'MBA Finance, M.Com',
    bio: 'Practical approach to economics and business. Former corporate professional turned educator with real-world insights.',
    hourlyRate: 700,
    verified: false,
    rating: 4.5,
    studentsCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    availability: ['Tuesday 6-9 PM', 'Friday 6-9 PM', 'Saturday 4-7 PM']
  }
];

export const mockClasses = [
  {
    id: 'c1',
    teacherId: '1',
    teacherName: 'Dr. Priya Sharma',
    title: 'Advanced Mathematics for Class 12',
    subject: 'Mathematics',
    description: 'Comprehensive coverage of Class 12 CBSE Mathematics with focus on calculus, algebra, and problem-solving techniques.',
    price: 800,
    duration: '1 hour',
    maxStudents: 10,
    enrolledStudents: 7,
    schedule: 'Monday & Wednesday, 5-6 PM',
    meetingLink: 'https://zoom.us/j/example123'
  },
  {
    id: 'c2',
    teacherId: '2',
    teacherName: 'Rahul Verma',
    title: 'IELTS Preparation Course',
    subject: 'English',
    description: 'Complete IELTS preparation covering all four modules: Listening, Reading, Writing, and Speaking. Band 7+ guaranteed.',
    price: 600,
    duration: '1.5 hours',
    maxStudents: 8,
    enrolledStudents: 6,
    schedule: 'Tuesday & Thursday, 6-7:30 PM',
    meetingLink: 'https://meet.google.com/example-abc'
  },
  {
    id: 'c3',
    teacherId: '4',
    teacherName: 'Vikram Singh',
    title: 'Python Programming for Beginners',
    subject: 'Programming',
    description: 'Learn Python from scratch with hands-on projects. Perfect for students starting their coding journey.',
    price: 900,
    duration: '1.5 hours',
    maxStudents: 12,
    enrolledStudents: 10,
    schedule: 'Wednesday, 7-8:30 PM & Saturday, 10-11:30 AM',
    meetingLink: 'https://zoom.us/j/example456'
  }
];

export const mockEnrollments = [
  {
    id: 'e1',
    studentId: 's1',
    classId: 'c1',
    teacherId: '1',
    enrolledDate: '2025-01-15',
    status: 'active',
    paymentStatus: 'paid'
  }
];

export const mockStudents = [
  {
    id: 's1',
    name: 'Riya Gupta',
    email: 'riya.gupta@example.com',
    phone: '+91 9876543210',
    grade: 'Class 12',
    interests: ['Mathematics', 'Physics']
  }
];

// Current logged in user state (mock)
export let currentUser = null;

export const setCurrentUser = (user) => {
  currentUser = user;
  if (typeof window !== 'undefined') {
    localStorage.setItem('aumryx_user', JSON.stringify(user));
  }
};

export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('aumryx_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
  }
  return currentUser;
};

export const logout = () => {
  currentUser = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('aumryx_user');
  }
};

// Mock enrollment function
export const enrollInClass = (studentId, classId, teacherId) => {
  const newEnrollment = {
    id: `e${Date.now()}`,
    studentId,
    classId,
    teacherId,
    enrolledDate: new Date().toISOString().split('T')[0],
    status: 'active',
    paymentStatus: 'paid'
  };
  mockEnrollments.push(newEnrollment);
  return newEnrollment;
};

// Get student enrollments
export const getStudentEnrollments = (studentId) => {
  return mockEnrollments.filter(e => e.studentId === studentId);
};

// Get teacher's classes with enrollment info
export const getTeacherClasses = (teacherId) => {
  return mockClasses.filter(c => c.teacherId === teacherId);
};

// Get teacher enrollments (students enrolled in their classes)
export const getTeacherEnrollments = (teacherId) => {
  return mockEnrollments.filter(e => e.teacherId === teacherId);
};