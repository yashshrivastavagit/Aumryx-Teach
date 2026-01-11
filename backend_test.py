#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Aumryx Teach Platform
Tests all authentication, teacher, admin, class, and enrollment endpoints
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except:
        pass
    return "https://educator-space-1.preview.emergentagent.com"

BASE_URL = get_backend_url() + "/api"
print(f"Testing backend at: {BASE_URL}")

# Test data
TEACHER_DATA = {
    "name": "Dr. Rajesh Kumar",
    "email": "rajesh.kumar@example.com",
    "password": "SecurePass123!",
    "user_type": "teacher",
    "subjects": ["Mathematics", "Physics"],
    "experience": "15 years",
    "qualification": "PhD in Mathematics",
    "bio": "Experienced mathematics teacher with expertise in advanced calculus and physics",
    "hourly_rate": 1200.0,
    "availability": ["Monday 9-12", "Wednesday 2-5", "Friday 10-1"]
}

STUDENT_DATA = {
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com", 
    "password": "StudentPass456!",
    "user_type": "student",
    "phone": "+91-9876543210",
    "grade": "Class 12",
    "interests": ["Mathematics", "Science", "Engineering"]
}

CLASS_DATA = {
    "title": "Advanced Calculus for Engineering Students",
    "subject": "Mathematics",
    "description": "Comprehensive course covering differential and integral calculus with engineering applications",
    "price": 2500.0,
    "duration": "3 months",
    "max_students": 25,
    "schedule": "Monday, Wednesday, Friday 4-6 PM",
    "meeting_link": "https://meet.google.com/abc-defg-hij"
}

# Global variables to store tokens and IDs
teacher_token = None
student_token = None
teacher_id = None
student_id = None
class_id = None
enrollment_id = None

def print_test_header(test_name):
    print(f"\n{'='*60}")
    print(f"TESTING: {test_name}")
    print(f"{'='*60}")

def print_result(test_name, success, details=""):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"   Details: {details}")

def make_request(method, endpoint, data=None, headers=None, expected_status=None):
    """Make HTTP request and return response"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=10)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers, timeout=10)
        elif method.upper() == "PATCH":
            response = requests.patch(url, json=data, headers=headers, timeout=10)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers, timeout=10)
        else:
            return None, f"Unsupported method: {method}"
            
        if expected_status and response.status_code != expected_status:
            return response, f"Expected status {expected_status}, got {response.status_code}"
            
        return response, None
        
    except requests.exceptions.RequestException as e:
        return None, f"Request failed: {str(e)}"

def test_health_check():
    """Test API health check"""
    print_test_header("API Health Check")
    
    response, error = make_request("GET", "/", expected_status=200)
    if error:
        print_result("Health Check", False, error)
        return False
        
    try:
        data = response.json()
        success = "message" in data and "Aumryx Teach API" in data["message"]
        print_result("Health Check", success, f"Response: {data}")
        return success
    except:
        print_result("Health Check", False, "Invalid JSON response")
        return False

def test_teacher_signup():
    """Test teacher signup"""
    global teacher_token, teacher_id
    print_test_header("Teacher Signup")
    
    response, error = make_request("POST", "/auth/signup", TEACHER_DATA, expected_status=201)
    if error:
        print_result("Teacher Signup", False, error)
        return False
        
    try:
        data = response.json()
        teacher_token = data["access_token"]
        # Handle both id and _id fields
        teacher_id = data["user"].get("id") or data["user"].get("_id")
        
        success = (
            teacher_token is not None and
            teacher_id is not None and
            data["user"]["name"] == TEACHER_DATA["name"] and
            data["user"]["email"] == TEACHER_DATA["email"] and
            data["user"]["user_type"] == "teacher" and
            data["user"]["verified"] == False  # Teachers start unverified
        )
        
        print_result("Teacher Signup", success, f"Teacher ID: {teacher_id}, Verified: {data['user']['verified']}")
        return success
        
    except Exception as e:
        print_result("Teacher Signup", False, f"JSON parsing error: {str(e)}")
        return False

def test_student_signup():
    """Test student signup"""
    global student_token, student_id
    print_test_header("Student Signup")
    
    response, error = make_request("POST", "/auth/signup", STUDENT_DATA, expected_status=201)
    if error:
        print_result("Student Signup", False, error)
        return False
        
    try:
        data = response.json()
        student_token = data["access_token"]
        # Handle both id and _id fields
        student_id = data["user"].get("id") or data["user"].get("_id")
        
        success = (
            student_token is not None and
            student_id is not None and
            data["user"]["name"] == STUDENT_DATA["name"] and
            data["user"]["email"] == STUDENT_DATA["email"] and
            data["user"]["user_type"] == "student" and
            data["user"]["verified"] == True  # Students auto-verified
        )
        
        print_result("Student Signup", success, f"Student ID: {student_id}, Verified: {data['user']['verified']}")
        return success
        
    except Exception as e:
        print_result("Student Signup", False, f"JSON parsing error: {str(e)}")
        return False

def test_login():
    """Test login functionality"""
    print_test_header("Login Tests")
    
    # Test teacher login
    login_data = {
        "email": TEACHER_DATA["email"],
        "password": TEACHER_DATA["password"],
        "user_type": "teacher"
    }
    
    response, error = make_request("POST", "/auth/login", login_data, expected_status=200)
    if error:
        print_result("Teacher Login", False, error)
        return False
        
    try:
        data = response.json()
        success = data["access_token"] is not None and data["user"]["user_type"] == "teacher"
        print_result("Teacher Login", success, "Valid credentials accepted")
    except:
        print_result("Teacher Login", False, "Invalid response format")
        return False
    
    # Test wrong password
    wrong_login = login_data.copy()
    wrong_login["password"] = "wrongpassword"
    
    response, error = make_request("POST", "/auth/login", wrong_login, expected_status=401)
    success = response is not None and response.status_code == 401
    print_result("Wrong Password Rejection", success, "Unauthorized access properly blocked")
    
    # Test wrong user type
    wrong_type = login_data.copy()
    wrong_type["user_type"] = "student"
    
    response, error = make_request("POST", "/auth/login", wrong_type, expected_status=401)
    success = response is not None and response.status_code == 401
    print_result("Wrong User Type Rejection", success, "User type mismatch properly blocked")
    
    return True

def test_protected_endpoints():
    """Test JWT token validation"""
    print_test_header("Protected Endpoint Tests")
    
    # Test without token
    response, error = make_request("GET", "/auth/me", expected_status=401)
    success = response is not None and response.status_code == 401
    print_result("No Token Rejection", success, "Unauthorized access properly blocked")
    
    # Test with valid token
    headers = {"Authorization": f"Bearer {teacher_token}"}
    response, error = make_request("GET", "/auth/me", headers=headers, expected_status=200)
    if error:
        print_result("Valid Token Access", False, error)
        return False
        
    try:
        data = response.json()
        success = data["email"] == TEACHER_DATA["email"]
        print_result("Valid Token Access", success, f"User profile retrieved: {data['name']}")
    except:
        print_result("Valid Token Access", False, "Invalid response format")
        return False
    
    # Test with invalid token
    headers = {"Authorization": "Bearer invalid_token_here"}
    response, error = make_request("GET", "/auth/me", headers=headers, expected_status=401)
    success = response is not None and response.status_code == 401
    print_result("Invalid Token Rejection", success, "Invalid token properly rejected")
    
    return True

def test_teacher_apis():
    """Test teacher-related APIs"""
    print_test_header("Teacher API Tests")
    
    # Test get all teachers (should be empty initially as teacher is unverified)
    response, error = make_request("GET", "/teachers", expected_status=200)
    if error:
        print_result("Get Verified Teachers", False, error)
        return False
        
    try:
        data = response.json()
        # Should be empty since our teacher is not verified yet
        success = isinstance(data, list)
        print_result("Get Verified Teachers", success, f"Found {len(data)} verified teachers")
    except:
        print_result("Get Verified Teachers", False, "Invalid response format")
        return False
    
    # Test search functionality
    response, error = make_request("GET", "/teachers?search=Mathematics", expected_status=200)
    success = response is not None and response.status_code == 200
    print_result("Teacher Search", success, "Search parameter accepted")
    
    # Test subject filter
    response, error = make_request("GET", "/teachers?subject=Physics", expected_status=200)
    success = response is not None and response.status_code == 200
    print_result("Subject Filter", success, "Subject filter accepted")
    
    # Test get teacher by ID
    response, error = make_request("GET", f"/teachers/{teacher_id}", expected_status=200)
    if error:
        print_result("Get Teacher by ID", False, error)
        return False
        
    try:
        data = response.json()
        success = data["id"] == teacher_id and data["name"] == TEACHER_DATA["name"]
        print_result("Get Teacher by ID", success, f"Teacher profile retrieved: {data['name']}")
    except:
        print_result("Get Teacher by ID", False, "Invalid response format")
        return False
    
    # Test update teacher profile (requires authentication)
    headers = {"Authorization": f"Bearer {teacher_token}"}
    update_data = {
        "bio": "Updated bio: Expert in advanced mathematics and physics with 15+ years experience",
        "hourly_rate": 1500.0
    }
    
    response, error = make_request("PUT", f"/teachers/{teacher_id}", update_data, headers, expected_status=200)
    if error:
        print_result("Update Teacher Profile", False, error)
        return False
        
    try:
        data = response.json()
        success = data["bio"] == update_data["bio"] and data["hourly_rate"] == update_data["hourly_rate"]
        print_result("Update Teacher Profile", success, "Profile updated successfully")
    except:
        print_result("Update Teacher Profile", False, "Invalid response format")
        return False
    
    return True

def test_admin_apis():
    """Test admin APIs"""
    print_test_header("Admin API Tests")
    
    # Test get pending teachers
    response, error = make_request("GET", "/admin/teachers/pending", expected_status=200)
    if error:
        print_result("Get Pending Teachers", False, error)
        return False
        
    try:
        data = response.json()
        success = isinstance(data, list) and len(data) >= 1  # Should have our unverified teacher
        found_teacher = any(t["id"] == teacher_id for t in data)
        print_result("Get Pending Teachers", success and found_teacher, f"Found {len(data)} pending teachers")
    except:
        print_result("Get Pending Teachers", False, "Invalid response format")
        return False
    
    # Test get all teachers
    response, error = make_request("GET", "/admin/teachers/all", expected_status=200)
    if error:
        print_result("Get All Teachers", False, error)
        return False
        
    try:
        data = response.json()
        success = isinstance(data, list) and len(data) >= 1
        print_result("Get All Teachers", success, f"Found {len(data)} total teachers")
    except:
        print_result("Get All Teachers", False, "Invalid response format")
        return False
    
    # Test verify teacher
    response, error = make_request("PATCH", f"/admin/teachers/{teacher_id}/verify", expected_status=200)
    if error:
        print_result("Verify Teacher", False, error)
        return False
        
    try:
        data = response.json()
        success = "message" in data and "verified successfully" in data["message"]
        print_result("Verify Teacher", success, "Teacher verification successful")
    except:
        print_result("Verify Teacher", False, "Invalid response format")
        return False
    
    # Verify the teacher is now verified by checking pending list
    response, error = make_request("GET", "/admin/teachers/pending", expected_status=200)
    if response:
        try:
            data = response.json()
            teacher_still_pending = any(t["id"] == teacher_id for t in data)
            success = not teacher_still_pending
            print_result("Teacher Verification Status", success, "Teacher removed from pending list")
        except:
            print_result("Teacher Verification Status", False, "Could not verify status")
    
    return True

def test_class_management():
    """Test class management APIs"""
    global class_id
    print_test_header("Class Management Tests")
    
    # Test create class (requires verified teacher)
    headers = {"Authorization": f"Bearer {teacher_token}"}
    
    response, error = make_request("POST", "/classes", CLASS_DATA, headers, expected_status=201)
    if error:
        print_result("Create Class", False, error)
        return False
        
    try:
        data = response.json()
        # Handle both id and _id fields
        class_id = data.get("id") or data.get("_id")
        success = (
            class_id is not None and
            data["title"] == CLASS_DATA["title"] and
            data["teacher_id"] == teacher_id and
            data["status"] == "active"
        )
        print_result("Create Class", success, f"Class created with ID: {class_id}")
    except Exception as e:
        print_result("Create Class", False, f"JSON parsing error: {str(e)}")
        return False
    
    # Test get all classes
    response, error = make_request("GET", "/classes", expected_status=200)
    if error:
        print_result("Get All Classes", False, error)
        return False
        
    try:
        data = response.json()
        success = isinstance(data, list) and len(data) >= 1
        found_class = any(c["id"] == class_id for c in data)
        print_result("Get All Classes", success and found_class, f"Found {len(data)} classes")
    except:
        print_result("Get All Classes", False, "Invalid response format")
        return False
    
    # Test get class by ID
    response, error = make_request("GET", f"/classes/{class_id}", expected_status=200)
    if error:
        print_result("Get Class by ID", False, error)
        return False
        
    try:
        data = response.json()
        success = data["id"] == class_id and data["title"] == CLASS_DATA["title"]
        print_result("Get Class by ID", success, f"Class retrieved: {data['title']}")
    except:
        print_result("Get Class by ID", False, "Invalid response format")
        return False
    
    # Test update class
    update_data = {
        "description": "Updated: Advanced calculus course with practical engineering applications and problem-solving techniques",
        "price": 3000.0
    }
    
    response, error = make_request("PUT", f"/classes/{class_id}", update_data, headers, expected_status=200)
    if error:
        print_result("Update Class", False, error)
        return False
        
    try:
        data = response.json()
        success = data["description"] == update_data["description"] and data["price"] == update_data["price"]
        print_result("Update Class", success, "Class updated successfully")
    except:
        print_result("Update Class", False, "Invalid response format")
        return False
    
    return True

def test_enrollment_system():
    """Test enrollment system"""
    global enrollment_id
    print_test_header("Enrollment System Tests")
    
    # Test create enrollment (student enrolls in class)
    headers = {"Authorization": f"Bearer {student_token}"}
    enrollment_data = {"class_id": class_id}
    
    response, error = make_request("POST", "/enrollments", enrollment_data, headers, expected_status=201)
    if error:
        print_result("Create Enrollment", False, error)
        return False
        
    try:
        data = response.json()
        enrollment_id = data["id"]
        success = (
            data["student_id"] == student_id and
            data["class_id"] == class_id and
            data["status"] == "active"
        )
        print_result("Create Enrollment", success, f"Enrollment created with ID: {enrollment_id}")
    except Exception as e:
        print_result("Create Enrollment", False, f"JSON parsing error: {str(e)}")
        return False
    
    # Test get student enrollments
    response, error = make_request("GET", f"/enrollments/student/{student_id}", headers=headers, expected_status=200)
    if error:
        print_result("Get Student Enrollments", False, error)
        return False
        
    try:
        data = response.json()
        success = isinstance(data, list) and len(data) >= 1
        found_enrollment = any(e["id"] == enrollment_id for e in data)
        print_result("Get Student Enrollments", success and found_enrollment, f"Found {len(data)} enrollments")
    except:
        print_result("Get Student Enrollments", False, "Invalid response format")
        return False
    
    # Test get teacher enrollments
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}
    response, error = make_request("GET", f"/enrollments/teacher/{teacher_id}", headers=teacher_headers, expected_status=200)
    if error:
        print_result("Get Teacher Enrollments", False, error)
        return False
        
    try:
        data = response.json()
        success = isinstance(data, list) and len(data) >= 1
        print_result("Get Teacher Enrollments", success, f"Found {len(data)} enrollments for teacher")
    except:
        print_result("Get Teacher Enrollments", False, "Invalid response format")
        return False
    
    # Test get enrollment by ID
    response, error = make_request("GET", f"/enrollments/{enrollment_id}", headers=headers, expected_status=200)
    if error:
        print_result("Get Enrollment by ID", False, error)
        return False
        
    try:
        data = response.json()
        success = data["id"] == enrollment_id and data["student_id"] == student_id
        print_result("Get Enrollment by ID", success, "Enrollment details retrieved")
    except:
        print_result("Get Enrollment by ID", False, "Invalid response format")
        return False
    
    return True

def test_authorization():
    """Test authorization and access control"""
    print_test_header("Authorization Tests")
    
    # Test student trying to create class (should fail)
    headers = {"Authorization": f"Bearer {student_token}"}
    
    response, error = make_request("POST", "/classes", CLASS_DATA, headers, expected_status=403)
    success = response is not None and response.status_code == 403
    print_result("Student Create Class Blocked", success, "Students properly blocked from creating classes")
    
    # Test student trying to update teacher profile (should fail)
    update_data = {"bio": "Unauthorized update attempt"}
    response, error = make_request("PUT", f"/teachers/{teacher_id}", update_data, headers, expected_status=403)
    success = response is not None and response.status_code == 403
    print_result("Student Update Teacher Blocked", success, "Students properly blocked from updating teacher profiles")
    
    # Test teacher trying to enroll in class (should fail)
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}
    enrollment_data = {"class_id": class_id}
    response, error = make_request("POST", "/enrollments", enrollment_data, teacher_headers, expected_status=403)
    success = response is not None and response.status_code == 403
    print_result("Teacher Enrollment Blocked", success, "Teachers properly blocked from enrolling in classes")
    
    return True

def run_all_tests():
    """Run all backend tests"""
    print(f"\n🚀 Starting Comprehensive Backend API Tests")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Backend URL: {BASE_URL}")
    
    tests = [
        ("Health Check", test_health_check),
        ("Teacher Signup", test_teacher_signup),
        ("Student Signup", test_student_signup),
        ("Login Tests", test_login),
        ("Protected Endpoints", test_protected_endpoints),
        ("Teacher APIs", test_teacher_apis),
        ("Admin APIs", test_admin_apis),
        ("Class Management", test_class_management),
        ("Enrollment System", test_enrollment_system),
        ("Authorization", test_authorization)
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print_result(test_name, False, f"Test crashed: {str(e)}")
            failed += 1
    
    # Final summary
    print(f"\n{'='*60}")
    print(f"TEST SUMMARY")
    print(f"{'='*60}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📊 Total: {passed + failed}")
    print(f"🎯 Success Rate: {(passed/(passed+failed)*100):.1f}%" if (passed+failed) > 0 else "0%")
    
    if failed == 0:
        print(f"\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        return True
    else:
        print(f"\n⚠️  {failed} test(s) failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)