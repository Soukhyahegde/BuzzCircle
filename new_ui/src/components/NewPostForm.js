import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const NewPostForm = ({ onPostCreate }) => {
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;

    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      const response = await axios.post(
        `${API_URL}/posts`,
        {
          content: postContent,
          user: { id: userId },
          upvotes: 0,
        },
        getAuthHeaders()
      );
      
      setPostContent('');
      if (onPostCreate) {
        onPostCreate(response.data);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-post-form">
      <div className="post-input">
        <div className="post-avatar" style={{ width: '40px', height: '40px' }}>U</div>
        <input
          type="text"
          className="post-input-field"
          placeholder="Share something with your circle..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handlePost();
            }
          }}
        />
      </div>
      <div className="post-actions">
        <button className="post-icon-btn" disabled={loading}>🖼️</button>
        <button className="post-icon-btn" disabled={loading}>😊</button>
        <button className="post-icon-btn" disabled={loading}>📍</button>
        <button className="post-submit-btn" onClick={handlePost} disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default NewPostForm;
