import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircleCard from './CircleCard';
import NewPostForm from './NewPostForm';
import PostCard from './PostCard';

const API_URL = 'http://localhost:8080/api';

const MainFeed = () => {
  const [circles, setCircles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  useEffect(() => {
    fetchCirclesAndPosts();
  }, []);

  const fetchCirclesAndPosts = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      // Fetch posts
      const postsResponse = await axios.get(
        `${API_URL}/posts/${userId}`,
        getAuthHeaders()
      );
      setPosts(postsResponse.data || []);
      
      // Fetch circles (mock data for now - add circle endpoint when available)
      setCircles([
        { id: 1, name: 'Full Stack Devs', members: 12, image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 2, name: 'UI/UX Design Hub', members: 8, image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: 3, name: 'Book Lovers', members: 5, image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
      ]);
      
      setError(null);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = async (newPost) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts`,
        newPost,
        getAuthHeaders()
      );
      setPosts([response.data, ...posts]);
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <div className="main-feed">
      <div className="feed-header">
        <h1>Discover Circles</h1>
        <button className="create-circle-btn">+ Create Circle</button>
      </div>

      <div className="circles-section">
        <div className="circles-grid">
          {circles.map(circle => (
            <CircleCard key={circle.id} circle={circle} />
          ))}
        </div>
      </div>

      <div className="feed-section">
        <h2 className="section-title">Your Feed</h2>
        
        <div className="feed-filters">
          <button 
            className={`filter-btn ${filter === 'latest' ? '' : 'inactive'}`}
            onClick={() => setFilter('latest')}
          >
            Latest
          </button>
          <button 
            className={`filter-btn ${filter === 'popular' ? '' : 'inactive'}`}
            onClick={() => setFilter('popular')}
          >
            Popular
          </button>
          <button 
            className={`filter-btn ${filter === 'following' ? '' : 'inactive'}`}
            onClick={() => setFilter('following')}
          >
            Following
          </button>
        </div>

        <NewPostForm onPostCreate={handleNewPost} />

        {error && <p style={{ color: '#d32f2f', marginBottom: '20px' }}>{error}</p>}
        
        {loading && <p style={{ textAlign: 'center', color: '#999' }}>Loading posts...</p>}

        {!loading && posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : !loading && !error ? (
          <p style={{ textAlign: 'center', color: '#999' }}>No posts yet. Be the first to share!</p>
        ) : null}
      </div>
    </div>
  );
};

export default MainFeed;
