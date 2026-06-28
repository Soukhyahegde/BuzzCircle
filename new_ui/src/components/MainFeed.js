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

const getCircleKey = (circleId) => String(circleId);

const MainFeed = () => {
  const [circles, setCircles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createCircleOpen, setCreateCircleOpen] = useState(false);
  const [circleName, setCircleName] = useState('');
  const [circleDescription, setCircleDescription] = useState('');
  const [circleTags, setCircleTags] = useState('');
  const [creatingCircle, setCreatingCircle] = useState(false);
  const visiblePosts = normalizeList(posts);

  const fetchCirclesAndPosts = useCallback(async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');

      const [postsResult, circlesResult, userCirclesResult] = await Promise.allSettled([
        axios.get(`${API_URL}/posts`, getAuthHeaders()),
        axios.get(`${API_URL}/circles`, getAuthHeaders()),
        userId
          ? axios.get(`${API_URL}/user/${userId}/circles`, getAuthHeaders())
          : Promise.resolve({ data: [] }),
      ]);

      if (postsResult.status === 'fulfilled') {
        setPosts(normalizeList(postsResult.value.data));
      } else {
        setPosts([]);
        console.error('Failed to load posts:', postsResult.reason);
      }

      if (circlesResult.status === 'fulfilled') {
        const joinedCircleIds = new Set(
          userCirclesResult.status === 'fulfilled'
            ? normalizeList(userCirclesResult.value.data).map(circle => getCircleKey(circle.id))
            : []
        );

        setCircles(
          normalizeList(circlesResult.value.data).filter(
            circle => !joinedCircleIds.has(getCircleKey(circle.id))
          )
        );
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

  const handleCircleJoined = (circleId) => {
    setCircles(currentCircles =>
      normalizeList(currentCircles).filter(
        circle => getCircleKey(circle.id) !== getCircleKey(circleId)
      )
    );
  };

  const resetCreateCircleForm = () => {
    setCircleName('');
    setCircleDescription('');
    setCircleTags('');
  };

  const handleCloseCreateCircle = () => {
    if (creatingCircle) return;

    setCreateCircleOpen(false);
    resetCreateCircleForm();
  };

  const handleCreateCircle = async (event) => {
    event.preventDefault();

    if (!circleName.trim()) return;

    try {
      setCreatingCircle(true);

      await axios.post(
        `${API_URL}/circles`,
        {
          name: circleName.trim(),
          description: circleDescription.trim(),
          tags: circleTags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean),
        },
        getAuthHeaders()
      );

      resetCreateCircleForm();
      setCreateCircleOpen(false);
      alert('Circle submitted for approval');
    } catch (err) {
      console.error('Failed to create circle:', err);
      alert('Failed to create circle');
    } finally {
      setCreatingCircle(false);
    }
  };

  return (
    <div className="main-feed">
      <div className="feed-header">
        <h1>Discover Circles</h1>
        <button
          className="create-circle-btn"
          onClick={() => setCreateCircleOpen(true)}
        >
          + Create Circle
        </button>
      </div>

      {createCircleOpen && (
        <div className="modal-backdrop" onClick={handleCloseCreateCircle}>
          <form
            className="create-circle-modal"
            onSubmit={handleCreateCircle}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Create Circle</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseCreateCircle}
                disabled={creatingCircle}
                aria-label="Close create circle form"
              >
                x
              </button>
            </div>

            <label className="form-label" htmlFor="circle-name">Name</label>
            <input
              id="circle-name"
              className="form-input"
              type="text"
              value={circleName}
              onChange={(event) => setCircleName(event.target.value)}
              maxLength={80}
              required
            />

            <label className="form-label" htmlFor="circle-description">Description</label>
            <textarea
              id="circle-description"
              className="form-input form-textarea"
              value={circleDescription}
              onChange={(event) => setCircleDescription(event.target.value)}
              maxLength={240}
            />

            <label className="form-label" htmlFor="circle-tags">Tags</label>
            <input
              id="circle-tags"
              className="form-input"
              type="text"
              value={circleTags}
              onChange={(event) => setCircleTags(event.target.value)}
              placeholder="AI, ML, Java"
            />

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCloseCreateCircle}
                disabled={creatingCircle}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="post-submit-btn"
                disabled={creatingCircle || !circleName.trim()}
              >
                {creatingCircle ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="circles-section">
        <div className="circles-grid">
          {normalizeList(circles).map(circle => (
            <CircleCard
              key={circle.id}
              circle={circle}
              onJoined={handleCircleJoined}
            />
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
