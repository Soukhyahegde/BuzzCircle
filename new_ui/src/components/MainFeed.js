import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import CircleCard from './CircleCard';
import NewPostForm from './NewPostForm';
import PostCard from './PostCard';

const API_URL = 'http://localhost:8080/api';

const normalizeList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

const MainFeed = () => {
  const [circles, setCircles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const visiblePosts = normalizeList(posts);

  const fetchCirclesAndPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch posts
      const postsResponse = await axios.get(
        `${API_URL}/posts`,
        getAuthHeaders()
      );
      setPosts(normalizeList(postsResponse.data));
      
      // Fetch circles from database
      const circlesResponse = await axios.get(
        `${API_URL}/circles`,
        getAuthHeaders()
      );
      setCircles(normalizeList(circlesResponse.data));
      
      setError(null);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error details:', err);
      setCircles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCirclesAndPosts();
  }, [fetchCirclesAndPosts]);

  const handleNewPost = async (newPost) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts`,
        newPost,
        getAuthHeaders()
      );
      setPosts(currentPosts => [response.data, ...normalizeList(currentPosts)]);
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
          {normalizeList(circles).map(circle => (
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

        {!loading && visiblePosts.length > 0 ? (
          visiblePosts.map(post => (
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
