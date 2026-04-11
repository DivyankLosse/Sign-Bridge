import requests
import sys

BASE_URL = "http://localhost:8000"

def test_register():
    print("Testing Registration...")
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json={
            "email": "test@example.com",
            "password": "password123",
            "full_name": "Test User"
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_login():
    print("\nTesting Login...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login", data={
            "username": "test@example.com",
            "password": "password123"
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_register()
    test_login()
