# Aumryx Teach - Backend Integration Contracts

## Current Mock Data Structure

### mockData.js contains:
- **mockTeachers**: Array of teacher profiles with id, name, email, subjects, experience, qualification, bio, hourlyRate, verified, rating, studentsCount, imageUrl, availability
- **mockClasses**: Array of class listings with id, teacherId, teacherName, title, subject, description, price, duration, maxStudents, enrolledStudents, schedule, meetingLink
- **mockEnrollments**: Array of enrollments with id, studentId, classId, teacherId, enrolledDate, status, paymentStatus
- **mockStudents**: Array of student profiles
- **currentUser**: Stored in localStorage for auth state

## Database Models to Create

### 1. User Model (users collection)
```python
{
    "_id": ObjectId,
    "name": str,
    "email": str (unique),
    "password_hash": str,
    "user_type": str (enum: "teacher", "student"),
    "verified": bool (default: False for teachers, True for students),
    "created_at": datetime,
    "updated_at": datetime,
    
    # Teacher-specific fields (conditional)
    "subjects": list[str],
    "experience": str,
    "qualification": str,
    "bio": str,
    "hourly_rate": float,
    "rating": float (default: 0),
    "students_count": int (default: 0),
    "image_url": str (default: placeholder),
    "availability": list[str],
    
    # Student-specific fields (conditional)
    "phone": str,
    "grade": str,
    "interests": list[str]
}
```

### 2. Class Model (classes collection)
```python
{
    "_id": ObjectId,
    "teacher_id": str,
    "title": str,
    "subject": str,
    "description": str,
    "price": float,
    "duration": str,
    "max_students": int,
    "enrolled_students": int (default: 0),
    "schedule": str,
    "meeting_link": str,
    "created_at": datetime,
    "updated_at": datetime,
    "status": str (enum: "active", "inactive")
}
```

### 3. Enrollment Model (enrollments collection)
```python
{
    "_id": ObjectId,
    "student_id": str,
    "class_id": str,
    "teacher_id": str,
    "enrolled_date": datetime,
    "status": str (enum: "active", "completed", "cancelled"),
    "payment_status": str (enum: "pending", "paid", "failed"),
    "payment_intent_id": str (Stripe),
    "amount": float
}
```

## API Endpoints to Implement

### Authentication Endpoints
- **POST /api/auth/signup** - Create new user (teacher/student)
- **POST /api/auth/login** - Login user, return JWT token
- **GET /api/auth/me** - Get current user profile
- **POST /api/auth/logout** - Logout user

### Teacher Endpoints
- **GET /api/teachers** - Get all verified teachers (with search/filter)
- **GET /api/teachers/{teacher_id}** - Get single teacher profile
- **PUT /api/teachers/{teacher_id}** - Update teacher profile (auth required)
- **GET /api/teachers/{teacher_id}/classes** - Get teacher's classes

### Class Endpoints
- **GET /api/classes** - Get all active classes
- **POST /api/classes** - Create new class (teacher auth required)
- **GET /api/classes/{class_id}** - Get single class
- **PUT /api/classes/{class_id}** - Update class (teacher auth required)
- **DELETE /api/classes/{class_id}** - Delete class (teacher auth required)

### Enrollment Endpoints
- **POST /api/enrollments** - Enroll in a class (student auth required)
- **GET /api/enrollments/student/{student_id}** - Get student enrollments
- **GET /api/enrollments/teacher/{teacher_id}** - Get teacher enrollments
- **GET /api/enrollments/{enrollment_id}** - Get single enrollment

### Payment Endpoints
- **POST /api/payments/create-intent** - Create Stripe payment intent
- **POST /api/payments/confirm** - Confirm payment and complete enrollment
- **GET /api/payments/teacher/{teacher_id}/earnings** - Get teacher earnings

### Admin Endpoints
- **GET /api/admin/teachers/pending** - Get unverified teachers
- **PUT /api/admin/teachers/{teacher_id}/verify** - Verify teacher

## Frontend Integration Changes

### Files to Update:
1. **mockData.js** → Create new `/api/services.js` with actual API calls
2. **AuthContext.js** → Update login/logout to call real APIs, store JWT
3. **TeacherBrowsePage.js** → Fetch from `/api/teachers`
4. **TeacherProfilePage.js** → Fetch from `/api/teachers/{id}`
5. **TeacherDashboard.js** → Fetch from `/api/teachers/{id}/classes` and `/api/enrollments/teacher/{id}`
6. **StudentDashboard.js** → Fetch from `/api/enrollments/student/{id}`
7. **LoginPage.js** → Call `/api/auth/login`
8. **SignupPage.js** → Call `/api/auth/signup`

### New API Service File Structure:
```javascript
// /app/frontend/src/services/api.js
- authService: signup, login, logout, getCurrentUser
- teacherService: getTeachers, getTeacherById, updateTeacher
- classService: getClasses, createClass, updateClass, deleteClass
- enrollmentService: enrollInClass, getStudentEnrollments, getTeacherEnrollments
- paymentService: createPaymentIntent, confirmPayment
```

## Authentication Flow
1. User signs up → POST /api/auth/signup → Returns JWT token
2. Store JWT in localStorage
3. All subsequent requests include JWT in Authorization header
4. Backend validates JWT for protected routes
5. JWT contains user_id and user_type for authorization

## Payment Flow (Stripe)
1. Student clicks "Enroll Now" → Frontend calls POST /api/payments/create-intent
2. Backend creates Stripe PaymentIntent, returns client_secret
3. Frontend uses Stripe.js to handle card payment
4. On success, frontend calls POST /api/payments/confirm with payment_intent_id
5. Backend verifies payment with Stripe, creates enrollment record
6. Returns success to frontend

## Testing Strategy
1. Test all auth endpoints with valid/invalid credentials
2. Test teacher CRUD operations
3. Test class management
4. Test enrollment flow
5. Test search and filtering
6. Test protected routes without auth (should fail)
7. Test role-based access (student can't create classes)

## Environment Variables Needed
```
# Backend .env
MONGO_URL=<already exists>
DB_NAME=<already exists>
JWT_SECRET=<generate new>
JWT_ALGORITHM=HS256
STRIPE_SECRET_KEY=<to be provided>
STRIPE_WEBHOOK_SECRET=<to be provided>
```

## Notes
- Teacher verification status checked before displaying in browse
- Students auto-verified, teachers need admin approval
- Image uploads to be handled later (use placeholder URLs for now)
- Stripe test mode for initial development
