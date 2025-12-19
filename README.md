# FakeSeek
TechNova 2025 🫶

Team Caffinated Geese proudly presents FakeSeek, a way to spot deepfakes before they spot you.  

<img width="1404" height="758" alt="Screenshot 2025-12-19 at 15 28 52" src="https://github.com/user-attachments/assets/ffb25aba-a727-478b-ae4a-663488cf2754" />

## Inspiration

What if one day you woke up and saw your face in a video or photo that you never made? And what if you had no control over the content or who could see it? This is the reality of the digital era.

The inspiration for FakeSeek comes from recognizing how vulnerable we all are to digital manipulation. Deepfakes overwhelmingly target women, particularly in cases of non-consensual explicit content, with **over 90% of victims being women**. Reports indicate a **900% increase in deepfake content** over the past three years. With the emergence of advanced generative models like Veo 3 and other video generation tools, AI-generated media is becoming nearly indistinguishable from authentic content.

If anyone can impersonate you online, your reputation, safety, and security are at risk. We developed FakeSeek to address this issue: a tool that empowers individuals to actively monitor their online presence and detect when their identity is being misused.

## What it does
FakeSeek is a platform that empowers users to protect their digital identity by scanning the web for manipulated media and impersonation risks. It has two main approaches: Prevent and Detect.

**Prevention:** Educates users about the risks of deepfakes and teaches them about phishing and other cyber threats. Users can take interactive quizzes, practice identifying phishing emails through hands-on drag-and-drop exercises, and upload two images to learn how to identify deepfakes in real time. We include a gamified progress tracker with five achievement levels, from "Novice" to "Privacy Expert", to make the platform interactive for younger teens. There is a latest news section that displays current news articles about deepfakes, phishing and AI scams. Mr. Goose, our chatbot, walks users through the modules.

**Detection:** Scrapes publicly available web content and searches results from Google for potential impersonations and misinformation based on the user’s profile, which includes their full name and two high-quality reference photos. FakeSeek generates a threat report that informs users about their current exposure and potential risks.

## How we built it
Frontend
- TypeScript
- React
- Tailwind CSS
- Framer Motion 
- Auth0 (Google OAuth integration)

Backend
- Node.js
- Google Gemini API
- MongoDB Atlas
- Python
- Beautiful Soup

## How to set it up locally

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd FakeSeek.
```

#### 2. Install Node.js Dependencies

```bash
npm install
```

#### 3. Install Python Dependencies

```bash
# Run the setup script
chmod +x setup_python.sh
./setup_python.sh

# Or manually install
pip3 install -r requirements.txt
```

#### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-auth0-domain.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# MongoDB Configuration
MONGODB_URI='mongodb://localhost:27017/'
# Or for MongoDB Atlas:
# MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/'

# Google Gemini API (for chat widget and image analysis)
GEMINI_API_KEY='your-gemini-api-key'

# News API (optional, for news feature)
NEWS_API_KEY='your-news-api-key'
```

#### 5. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string and add it to `.env.local`

#### 6. Set Up Auth0

1. Create an account at [Auth0](https://auth0.com)
2. Create a new application (Single Page Application)
3. Configure callback URLs:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
4. Copy your credentials to `.env.local`

#### 7. Set Up Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file as `GEMINI_API_KEY`

### Running the Application

```bash
# Start the Next.js development server
npm run dev

# The application will be available at http://localhost:3000
```

#### Auth0 Configuration

In your Auth0 dashboard:
- Application Type: Single Page Application
- Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
- Allowed Logout URLs: `http://localhost:3000`
- Allowed Web Origins: `http://localhost:3000`

#### MongoDB Schema

The application uses the following MongoDB schema for user profiles:

```typescript
{
  userId: string,        // Auth0 user ID
  firstName: string,
  lastName: string,
  profilePictures: string[],  // Array of image URLs
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `GET /api/auth/login` - Initiate login
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/callback` - Auth0 callback
- `GET /api/auth/me` - Get current user

### User Profile
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create/update user profile

### Deepfake Detection
- `POST /api/deepfake-scan` - Scan for deepfakes
  - Body: None (uses authenticated user's profile)
  - Returns: Scan results with confidence scores

### Deepfake Analysis
- `POST /api/analyze-deepfake` - Analyze images for deepfake indicators
  - Body: `{ images: string[] }` (base64 encoded images)
  - Returns: Analysis results with detected artifacts

### Chat
- `POST /api/chat` - Send message to AI assistant (Mr. Goose)
  - Body: `{ message: string }`
  - Returns: AI response

### News
- `GET /api/news` - Get latest news articles
  - Returns: Array of news articles about deepfakes, phishing, and AI scams

## License

This project is licensed under the terms specified in the LICENSE file.

---
