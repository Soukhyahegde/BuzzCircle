# BuzzCircle UI - New Design

A modern, interest-based social networking UI built with React that matches the mockup design.

## Features

- **Sidebar Navigation**: Quick access to Profile, Explore, Messages, Notifications, Bookmarks, and Settings
- **Discover Circles**: Browse and join interest-based communities
- **Your Feed**: View posts with filters (Latest, Popular, Following)
- **New Post Form**: Create and share posts with your circle
- **Contacts & Groups**: Right sidebar to see online contacts and your groups
- **Post Engagement**: Like, comment, and share posts

## Getting Started

### Install Dependencies
```bash
cd C:\buzzcircle\new_ui
npm install
```

### Run the Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Components

- **Sidebar**: Navigation menu on the left
- **MainFeed**: Central feed with circles discovery and posts
- **CircleCard**: Reusable circle community card
- **NewPostForm**: Post creation form
- **PostCard**: Individual post display with engagement metrics
- **RightSidebar**: Contacts and groups sidebar

## Styling

Uses `App.css` for all styling with a clean, modern design matching the mockups.

## To Integrate with Backend

Update these files to connect with your Spring Boot API:

1. **MainFeed.js**: Replace mock circles and posts with API calls
2. **PostCard.js**: Update like/engagement endpoints
3. **CircleCard.js**: Add API call for joining circles
4. **NewPostForm.js**: Connect to POST /api/posts endpoint

Example:
```javascript
import axios from 'axios';

const fetchPosts = async () => {
  const response = await axios.get('http://localhost:8080/api/posts/1');
  setPosts(response.data);
};
```
