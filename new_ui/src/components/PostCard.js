import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.upvotes || 0);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  const handleLike = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(
        `${API_URL}/posts/${post.id}/upvote?userId=${userId}`,
        {},
        getAuthHeaders()
      );
      
      if (!liked) {
        setLikeCount(likeCount + 1);
        setLiked(true);
      } else {
        setLikeCount(likeCount - 1);
        setLiked(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        alert('You have already upvoted this post');
      } else {
        console.error('Failed to upvote:', err);
      }
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {post.user?.name?.charAt(0) || 'U'}
        </div>
        <div className="post-meta">
          <div className="post-author">{post.user?.name || 'Unknown'}</div>
          <div className="post-time">@{post.user?.username || 'user'} • {new Date(post.createdAt).toLocaleString()}</div>
        </div>
        <button className="follow-btn">+ Follow</button>
      </div>

      <h3 className="post-title">{post.title || 'Untitled'}</h3>
      
      <p className="post-content">{post.content}</p>

      <div className="post-images">
        <div className="post-image" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
        <div className="post-image" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }} />
      </div>

      <div className="post-engagement">
        <div className="engagement-item" onClick={handleLike}>
          {liked ? '❤️' : '🤍'} {likeCount}
        </div>
        <div className="engagement-item">
          💬 {post.comments || 0}
        </div>
        <div className="engagement-item">
          🔄
        </div>
        <div className="engagement-item">
          ⬆️
        </div>
      </div>
    </div>
  );
};

export default PostCard;
