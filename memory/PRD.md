# Aumryx Teach - Product Requirements Document

## Original Problem Statement
Build **Aumryx Teach**, a teacher-first online teaching platform where the founder has full autonomy to create the best possible educational marketplace.

## Core Features

### Implemented Features ✅

#### 1. Teacher Features
- ✅ **Teacher Signup** with verification process (profiles reviewed by admin)
- ✅ **Teacher Dashboard** with tabs for Overview, Notes, Assignments, Community
- ✅ **"Profile Under Review"** message for unverified teachers
- ✅ **Teacher Profile Pages** with bio, qualification, experience, subjects
- ✅ Default profile images for all teachers

#### 2. Student Features
- ✅ **Student Signup/Login** 
- ✅ **Browse Teachers Page** with search and filter by subject
- ✅ **View Teacher Profiles** with courses offered
- ✅ **Student Dashboard** (basic structure)

#### 3. Admin Features
- ✅ **Founder-Only Admin Panel** (restricted to aumryx@gmail.com)
- ✅ **View Pending Teachers** awaiting verification
- ✅ **View All Teachers** with verification status
- ✅ **Verify/Unverify Teachers** with success messages
- ✅ Access Denied screen for non-founder users

### 4. Core Functionality
- ✅ **Teacher Profile Click** - navigates to `/teacher/:id` with API data
- ✅ **JWT Authentication** with user type (teacher/student)
- ✅ **Protected Routes** for dashboards

## Technical Architecture

### Frontend (React)
```
/app/frontend/src/
├── pages/
│   ├── LandingPage.js
│   ├── LoginPage.js
│   ├── SignupPage.js
│   ├── TeacherBrowsePage.js
│   ├── TeacherProfilePage.js
│   ├── EnhancedTeacherDashboard.js
│   ├── StudentDashboard.js
│   └── AdminPanel.js
├── services/api.js
└── context/AuthContext.js
```

### Backend (FastAPI + MongoDB)
```
/app/backend/
├── routes/
│   ├── auth.py
│   ├── teachers.py
│   ├── classes.py
│   ├── enrollments.py
│   ├── admin.py (founder-only access)
│   ├── attendance.py
│   ├── notes.py
│   ├── assignments.py
│   └── community.py
├── models/
└── server.py
```

### Database (MongoDB)
- Database: `test_database`
- Collections: users, classes, enrollments, attendance, notes, assignments, community_posts, ratings, analytics

## Test Credentials

### Founder Account
- Email: aumryx@gmail.com
- Password: Founder123!
- Type: teacher

### Test Student
- Email: teststudent_admin@test.com
- Password: Test123!
- Type: student

## Prioritized Backlog

### P0 - Critical (Completed ✅)
- [x] Fix "Not Found" error on teacher profile click
- [x] Secure admin panel for founder only

### P1 - High Priority
- [ ] Student enrollment in multiple courses (UI integration)
- [ ] Teacher course management (create courses with custom prices)
- [ ] Teacher dashboard backend integration (Notes, Assignments, Community)
- [ ] Profile picture upload functionality

### P2 - Medium Priority  
- [ ] Student retention features (ratings & reviews)
- [ ] Stripe payment integration
- [ ] Analytics dashboard for teachers

### P3 - Low Priority
- [ ] Direct messaging between students and teachers
- [ ] Notifications system
- [ ] Email verification for signups

## Session Summary - January 11, 2026

### Completed
1. **Fixed Critical Bug**: Teacher profile page now fetches data from backend API
2. **Secured Admin Panel**: Only founder (aumryx@gmail.com) can access admin features
3. **Cleaned Up Code**: Removed obsolete TeacherDashboard.js file
4. **Backend Security**: Added `verify_founder_access` dependency to all admin routes
5. **Testing**: All 23 backend tests passed (100% success rate)

### Verified Working Flows
- Browse teachers → Click teacher card → View teacher profile ✅
- Admin panel access denied for non-founders ✅
- Admin panel full access for founder ✅
- Teacher verification/unverification ✅

## Environment Variables

### Backend (.env)
- MONGO_URL
- DB_NAME=test_database
- FOUNDER_EMAIL=aumryx@gmail.com

### Frontend (.env)
- REACT_APP_BACKEND_URL
