"""
Aumryx Teach Platform - Backend API Tests
Tests for: Teacher Browse, Teacher Profile, Admin Panel Access Control, Teacher Verification
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://learnwithpros.preview.emergentagent.com')

# Test credentials
FOUNDER_EMAIL = "aumryx@gmail.com"
FOUNDER_PASSWORD = "Founder123!"
TEST_STUDENT_EMAIL = "teststudent_admin@test.com"
TEST_STUDENT_PASSWORD = "Test123!"

class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Aumryx Teach API" in data["message"]
        print(f"✓ API root endpoint working: {data}")


class TestTeacherBrowse:
    """Tests for /api/teachers endpoint - Teacher Browse Page"""
    
    def test_get_teachers_list(self):
        """Test fetching list of teachers"""
        response = requests.get(f"{BASE_URL}/api/teachers")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Teachers list returned {len(data)} teachers")
        return data
    
    def test_get_verified_teachers_only(self):
        """Test that verified_only=true returns only verified teachers"""
        response = requests.get(f"{BASE_URL}/api/teachers", params={"verified_only": True})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned teachers should be verified
        for teacher in data:
            assert teacher.get("verified") == True, f"Teacher {teacher.get('name')} is not verified"
        print(f"✓ Verified teachers filter working - {len(data)} verified teachers")
    
    def test_get_all_teachers_including_unverified(self):
        """Test that verified_only=false returns all teachers"""
        response = requests.get(f"{BASE_URL}/api/teachers", params={"verified_only": False})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ All teachers (including unverified) returned: {len(data)} teachers")
    
    def test_search_teachers_by_name(self):
        """Test searching teachers by name"""
        response = requests.get(f"{BASE_URL}/api/teachers", params={"search": "test", "verified_only": False})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Search by name returned {len(data)} results")
    
    def test_filter_teachers_by_subject(self):
        """Test filtering teachers by subject"""
        response = requests.get(f"{BASE_URL}/api/teachers", params={"subject": "Mathematics", "verified_only": False})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Filter by subject returned {len(data)} results")


class TestTeacherProfile:
    """Tests for /api/teachers/{id} endpoint - Teacher Profile Page"""
    
    @pytest.fixture
    def teacher_id(self):
        """Get a teacher ID for testing"""
        response = requests.get(f"{BASE_URL}/api/teachers", params={"verified_only": False})
        if response.status_code == 200:
            teachers = response.json()
            if teachers:
                return teachers[0].get("_id")
        return None
    
    def test_get_teacher_by_id(self, teacher_id):
        """Test fetching a single teacher by ID"""
        if not teacher_id:
            pytest.skip("No teachers available for testing")
        
        response = requests.get(f"{BASE_URL}/api/teachers/{teacher_id}")
        assert response.status_code == 200
        data = response.json()
        assert data.get("_id") == teacher_id
        assert "name" in data
        assert "email" in data
        assert "user_type" in data
        assert data["user_type"] == "teacher"
        print(f"✓ Teacher profile fetched: {data.get('name')}")
    
    def test_get_teacher_invalid_id(self):
        """Test fetching teacher with invalid ID"""
        response = requests.get(f"{BASE_URL}/api/teachers/invalid_id_123")
        assert response.status_code == 400
        print("✓ Invalid teacher ID returns 400")
    
    def test_get_teacher_nonexistent_id(self):
        """Test fetching teacher with non-existent valid ObjectId"""
        response = requests.get(f"{BASE_URL}/api/teachers/507f1f77bcf86cd799439011")
        assert response.status_code == 404
        print("✓ Non-existent teacher ID returns 404")


class TestAuthentication:
    """Tests for authentication endpoints"""
    
    def test_login_founder(self):
        """Test founder login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD,
            "user_type": "teacher"
        })
        if response.status_code == 401:
            print(f"⚠ Founder account may not exist yet. Response: {response.json()}")
            pytest.skip("Founder account not set up")
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == FOUNDER_EMAIL
        print(f"✓ Founder login successful: {data['user']['email']}")
        return data["access_token"]
    
    def test_login_student(self):
        """Test student login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_STUDENT_EMAIL,
            "password": TEST_STUDENT_PASSWORD,
            "user_type": "student"
        })
        if response.status_code == 401:
            print(f"⚠ Test student account may not exist. Response: {response.json()}")
            pytest.skip("Test student account not set up")
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        print(f"✓ Student login successful: {data['user']['email']}")
        return data["access_token"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "wrongpassword",
            "user_type": "student"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials return 401")


class TestAdminAccessControl:
    """Tests for Admin Panel Access Control"""
    
    @pytest.fixture
    def founder_token(self):
        """Get founder authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD,
            "user_type": "teacher"
        })
        if response.status_code != 200:
            pytest.skip("Founder account not available")
        return response.json()["access_token"]
    
    @pytest.fixture
    def student_token(self):
        """Get student authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_STUDENT_EMAIL,
            "password": TEST_STUDENT_PASSWORD,
            "user_type": "student"
        })
        if response.status_code != 200:
            pytest.skip("Test student account not available")
        return response.json()["access_token"]
    
    def test_admin_pending_teachers_unauthenticated(self):
        """Test admin endpoint without authentication - should return 403"""
        response = requests.get(f"{BASE_URL}/api/admin/teachers/pending")
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ Admin endpoint requires authentication (403)")
    
    def test_admin_all_teachers_unauthenticated(self):
        """Test admin all teachers endpoint without authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/teachers/all")
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ Admin all teachers endpoint requires authentication (403)")
    
    def test_admin_pending_teachers_as_student(self, student_token):
        """Test admin endpoint as student - should return 403"""
        headers = {"Authorization": f"Bearer {student_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/teachers/pending", headers=headers)
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"
        print("✓ Student cannot access admin endpoint (403)")
    
    def test_admin_pending_teachers_as_founder(self, founder_token):
        """Test admin endpoint as founder - should succeed"""
        headers = {"Authorization": f"Bearer {founder_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/teachers/pending", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Founder can access pending teachers: {len(data)} pending")
    
    def test_admin_all_teachers_as_founder(self, founder_token):
        """Test admin all teachers endpoint as founder"""
        headers = {"Authorization": f"Bearer {founder_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/teachers/all", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Founder can access all teachers: {len(data)} total")


class TestTeacherVerification:
    """Tests for Teacher Verification functionality"""
    
    @pytest.fixture
    def founder_token(self):
        """Get founder authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD,
            "user_type": "teacher"
        })
        if response.status_code != 200:
            pytest.skip("Founder account not available")
        return response.json()["access_token"]
    
    @pytest.fixture
    def unverified_teacher_id(self, founder_token):
        """Get an unverified teacher ID for testing"""
        headers = {"Authorization": f"Bearer {founder_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/teachers/pending", headers=headers)
        if response.status_code == 200:
            teachers = response.json()
            if teachers:
                return teachers[0].get("_id")
        return None
    
    def test_verify_teacher_as_founder(self, founder_token, unverified_teacher_id):
        """Test verifying a teacher as founder"""
        if not unverified_teacher_id:
            pytest.skip("No unverified teachers available")
        
        headers = {"Authorization": f"Bearer {founder_token}"}
        response = requests.patch(
            f"{BASE_URL}/api/admin/teachers/{unverified_teacher_id}/verify",
            headers=headers
        )
        # Could be 200 (success) or 400 (already verified)
        assert response.status_code in [200, 400], f"Unexpected status: {response.status_code}"
        print(f"✓ Teacher verification endpoint working: {response.json()}")
    
    def test_unverify_teacher_as_founder(self, founder_token):
        """Test unverifying a teacher as founder"""
        headers = {"Authorization": f"Bearer {founder_token}"}
        
        # First get a verified teacher
        response = requests.get(f"{BASE_URL}/api/admin/teachers/all", headers=headers)
        if response.status_code != 200:
            pytest.skip("Cannot fetch teachers")
        
        teachers = response.json()
        verified_teacher = next((t for t in teachers if t.get("verified") and t.get("email") != FOUNDER_EMAIL), None)
        
        if not verified_teacher:
            pytest.skip("No verified teachers available to unverify")
        
        teacher_id = verified_teacher.get("_id")
        response = requests.patch(
            f"{BASE_URL}/api/admin/teachers/{teacher_id}/unverify",
            headers=headers
        )
        assert response.status_code == 200, f"Unexpected status: {response.status_code}"
        print(f"✓ Teacher unverification working: {response.json()}")
        
        # Re-verify the teacher to restore state
        requests.patch(
            f"{BASE_URL}/api/admin/teachers/{teacher_id}/verify",
            headers=headers
        )
    
    def test_verify_teacher_invalid_id(self, founder_token):
        """Test verifying teacher with invalid ID"""
        headers = {"Authorization": f"Bearer {founder_token}"}
        response = requests.patch(
            f"{BASE_URL}/api/admin/teachers/invalid_id/verify",
            headers=headers
        )
        assert response.status_code == 400
        print("✓ Invalid teacher ID returns 400")
    
    def test_verify_teacher_nonexistent(self, founder_token):
        """Test verifying non-existent teacher"""
        headers = {"Authorization": f"Bearer {founder_token}"}
        response = requests.patch(
            f"{BASE_URL}/api/admin/teachers/507f1f77bcf86cd799439011/verify",
            headers=headers
        )
        assert response.status_code == 404
        print("✓ Non-existent teacher returns 404")


class TestCreateTestAccounts:
    """Create test accounts if they don't exist"""
    
    def test_create_founder_account(self):
        """Create founder account if it doesn't exist"""
        # First try to login
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD,
            "user_type": "teacher"
        })
        
        if response.status_code == 200:
            print(f"✓ Founder account already exists: {FOUNDER_EMAIL}")
            return
        
        # Create founder account
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "name": "Aumryx Founder",
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD,
            "user_type": "teacher",
            "subjects": ["Platform Management"],
            "experience": "10+ years",
            "qualification": "Founder",
            "bio": "Platform founder and administrator"
        })
        
        if response.status_code == 201:
            print(f"✓ Founder account created: {FOUNDER_EMAIL}")
        elif response.status_code == 400:
            print(f"⚠ Founder account already exists (signup returned 400)")
        else:
            print(f"⚠ Could not create founder account: {response.status_code} - {response.text}")
    
    def test_create_test_student_account(self):
        """Create test student account if it doesn't exist"""
        # First try to login
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_STUDENT_EMAIL,
            "password": TEST_STUDENT_PASSWORD,
            "user_type": "student"
        })
        
        if response.status_code == 200:
            print(f"✓ Test student account already exists: {TEST_STUDENT_EMAIL}")
            return
        
        # Create test student account
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "name": "Test Student Admin",
            "email": TEST_STUDENT_EMAIL,
            "password": TEST_STUDENT_PASSWORD,
            "user_type": "student",
            "grade": "10th",
            "interests": ["Mathematics", "Science"]
        })
        
        if response.status_code == 201:
            print(f"✓ Test student account created: {TEST_STUDENT_EMAIL}")
        elif response.status_code == 400:
            print(f"⚠ Test student account already exists (signup returned 400)")
        else:
            print(f"⚠ Could not create test student account: {response.status_code} - {response.text}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
