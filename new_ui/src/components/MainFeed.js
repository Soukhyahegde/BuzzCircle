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

      const [postsResult, circlesResult] = await Promise.allSettled([
        axios.get(`${API_URL}/posts`, getAuthHeaders()),
        axios.get(`${API_URL}/circles`, getAuthHeaders()),
      ]);

      if (postsResult.status === 'fulfilled') {
        setPosts(normalizeList(postsResult.value.data));
      } else {
        setPosts([]);
        console.error('Failed to load posts:', postsResult.reason);
      }

      if (circlesResult.status === 'fulfilled') {
        setCircles(normalizeList(circlesResult.value.data));
      } else {
        setCircles([]);
        console.error('Failed to load circles:', circlesResult.reason);
      }

      setError(
        postsResult.status === 'rejected' && circlesResult.status === 'rejected'
          ? 'Failed to load feed'
          : null
      );
    } catch (err) {
      setError('Failed to load feed');
      console.error('Error details:', err);
      setPosts([]);
      setCircles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCirclesAndPosts();
  }, [fetchCirclesAndPosts]);

  const handleNewPost = async (newPost) => {
    setPosts(currentPosts => [newPost, ...normalizeList(currentPosts)]);
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
