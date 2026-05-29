# BuzzCircle

To run:
cd C:\buzzcircle
mvn clean spring-boot:run

# URLs
http://localhost:8080/swagger-ui/index.html



Core Features
1. User Authentication & Profiles
Registration and login with JWT token-based authentication
User profiles with:
Name, email, password
Bio (short description)
Profile picture (file upload)
User ID and username
Update profile endpoint: PUT /api/users/{id}

2. Circles (Communities/Groups)
Users can create or join circles based on interests
Each circle has:
Name, description
Members
Posts specific to that circle
Future: Admin approval workflow

3. Posts
Users post content within circles or globally
Each post has:
Content (text)
Creator (user reference)
Upvote count
Endpoints:
POST /api/posts - Create post
GET /api/posts/{userId} - Get user's posts
POST /api/posts/{postId}/upvote - Upvote a post (one per user)

4. Upvoting System
Users can upvote posts (only once per user, tracked via PostUpvote entity)
Upvote count increases in real-time
Prevents duplicate upvotes from the same user

5. Follow System (Design-ready)
Users can follow each other
See followed users' posts in feed
(Implementation ready, UI pending)

6. Admin Features (Future)
Approve new posts/circles
Manage community members
Remove inappropriate content


Architecture Overview
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  (Material UI + Tailwind CSS)                        │
│  - Login, Home, Posts pages                          │
│  - AuthContext for JWT token management             │
└────────────────────┬────────────────────────────────┘
                     │ (HTTP/REST)
┌────────────────────▼────────────────────────────────┐
│              Backend (Spring Boot)                   │
│  - AuthController (JWT login)                        │
│  - PostController (CRUD posts, upvotes)             │
│  - CircleController (manage circles)                │
│  - UserController (update profiles)                 │
│  - SecurityConfig (JWT filter, CORS)                │
└────────────────────┬────────────────────────────────┘
                     │ (JDBC/JPA)
┌────────────────────▼────────────────────────────────┐
│            Database (MySQL)                          │
│  - Users, Posts, Circles, PostUpvotes               │
│  - Relationships and foreign keys                   │
└─────────────────────────────────────────────────────┘


Data Model (Entities) :
    User: id, username, email, password, name, bio, profilePicture
    Post: id, content, upvotes, userId (FK)
    PostUpvote: id, postId (FK), userId (FK) - prevents duplicate upvotes
    Circle: id, name, description, members
    

UI

new_ui/
├── package.json              # Dependencies
├── public/
│   └── index.html            # HTML entry point
├── src/
│   ├── index.js              # React entry point
│   ├── App.js                # Main app component
│   ├── App.css               # All styling (CSS Grid, Flexbox)
│   └── components/
│       ├── Sidebar.js        # Left navigation sidebar
│       ├── MainFeed.js       # Main feed with circles & posts
│       ├── CircleCard.js     # Reusable circle card
│       ├── PostCard.js       # Post with engagement metrics
│       ├── NewPostForm.js    # Post creation form
│       └── RightSidebar.js   # Contacts & groups sidebar
├── .gitignore
└── README.md

Features Implemented
✅ Sidebar: Navigation with Profile, Explore, Messages, Notifications, Bookmarks, Settings
✅ Discover Circles: Cards showing circle name, member count, and "Join Circle" button
✅ Your Feed: Posts with author, title, content, images, and engagement (likes, comments, shares)
✅ New Post Form: Text input with emoji, image, location icons
✅ Right Sidebar: Contacts with online/offline status and Your Groups
✅ Interactive: Like button toggles, post submission, circle joining
✅ Responsive: Mobile-friendly design


cd C:\buzzcircle\new_ui
npm install
npm start
