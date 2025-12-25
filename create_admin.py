import requests
import time

def create_admin():
    url = "https://youmatter-backend-9tfj.onrender.com/api/auth/create-admin/"
    
    print("Attempting to create admin user...")
    print(f"URL: {url}")
    
    try:
        response = requests.post(url, json={})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Admin user created successfully!")
            print("Username: admin")
            print("Password: YouMatter2024!")
            print("Admin URL: https://youmatter-backend-9tfj.onrender.com/admin/")
        elif response.status_code == 400:
            print("⚠️ Admin user already exists")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        print("The backend might still be deploying. Please wait a few minutes and try again.")

if __name__ == "__main__":
    create_admin()