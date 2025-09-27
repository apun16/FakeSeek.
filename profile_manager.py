#!/usr/bin/env python3
"""
Profile Manager for FakeSeek
This script helps you manage user profiles in MongoDB Atlas
"""

import os
import base64
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ProfileManager:
    def __init__(self):
        """Initialize MongoDB connection"""
        self.mongodb_uri = os.getenv('MONGODB_URI')
        if not self.mongodb_uri:
            raise ValueError("MONGODB_URI not found in environment variables")
        
        self.client = MongoClient(self.mongodb_uri)
        self.db = self.client['fakeseek']
        self.profiles = self.db['userprofiles']
    
    def create_profile(self, user_id, first_name, last_name, image1_path=None, image2_path=None):
        """Create a new user profile"""
        profile_data = {
            "userId": user_id,
            "firstName": first_name,
            "lastName": last_name,
            "profileImage1": "",
            "profileImage2": "",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Convert images to base64 if provided
        if image1_path and os.path.exists(image1_path):
            profile_data["profileImage1"] = self._image_to_base64(image1_path)
        
        if image2_path and os.path.exists(image2_path):
            profile_data["profileImage2"] = self._image_to_base64(image2_path)
        
        # Insert or update profile
        result = self.profiles.update_one(
            {"userId": user_id},
            {"$set": profile_data},
            upsert=True
        )
        
        return result
    
    def get_profile(self, user_id):
        """Get a user profile by user ID"""
        return self.profiles.find_one({"userId": user_id})
    
    def get_all_profiles(self):
        """Get all user profiles"""
        return list(self.profiles.find())
    
    def update_profile(self, user_id, **kwargs):
        """Update a user profile"""
        update_data = {**kwargs, "updatedAt": datetime.utcnow()}
        return self.profiles.update_one(
            {"userId": user_id},
            {"$set": update_data}
        )
    
    def delete_profile(self, user_id):
        """Delete a user profile"""
        return self.profiles.delete_one({"userId": user_id})
    
    def _image_to_base64(self, image_path):
        """Convert image file to base64 string"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    def _base64_to_image(self, base64_string, output_path):
        """Convert base64 string to image file"""
        image_data = base64.b64decode(base64_string)
        with open(output_path, "wb") as image_file:
            image_file.write(image_data)
    
    def export_profile_images(self, user_id, output_dir="exported_images"):
        """Export profile images from base64 to files"""
        profile = self.get_profile(user_id)
        if not profile:
            print(f"Profile not found for user: {user_id}")
            return
        
        os.makedirs(output_dir, exist_ok=True)
        
        if profile.get("profileImage1"):
            self._base64_to_image(
                profile["profileImage1"], 
                f"{output_dir}/{user_id}_image1.jpg"
            )
            print(f"Exported image1 to {output_dir}/{user_id}_image1.jpg")
        
        if profile.get("profileImage2"):
            self._base64_to_image(
                profile["profileImage2"], 
                f"{output_dir}/{user_id}_image2.jpg"
            )
            print(f"Exported image2 to {output_dir}/{user_id}_image2.jpg")
    
    def close(self):
        """Close MongoDB connection"""
        self.client.close()

def main():
    """Example usage of ProfileManager"""
    try:
        # Initialize profile manager
        pm = ProfileManager()
        
        print("🔍 Profile Manager - FakeSeek")
        print("=" * 40)
        
        # List all profiles
        profiles = pm.get_all_profiles()
        print(f"\n📊 Found {len(profiles)} profiles:")
        
        for profile in profiles:
            print(f"  - User: {profile.get('firstName', 'N/A')} {profile.get('lastName', 'N/A')}")
            print(f"    ID: {profile.get('userId', 'N/A')}")
            print(f"    Images: {bool(profile.get('profileImage1'))}, {bool(profile.get('profileImage2'))}")
            print(f"    Created: {profile.get('createdAt', 'N/A')}")
            print()
        
        # Example: Create a test profile
        print("Creating test profile...")
        result = pm.create_profile(
            user_id="test_user_123",
            first_name="Test",
            last_name="User"
        )
        print(f"✅ Test profile created/updated: {result.upserted_id or result.modified_count}")
        
        # Close connection
        pm.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure you have:")
        print("1. Created a .env file with MONGODB_URI")
        print("2. Set up MongoDB Atlas cluster")
        print("3. Installed required packages: pip install pymongo dnspython python-dotenv")

if __name__ == "__main__":
    main()
