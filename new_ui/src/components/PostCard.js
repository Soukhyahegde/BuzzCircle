import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.upvotes || 0);
  const [comments, setComments] = useState(Array.isArray(post.comments) ? post.comments : []);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    setComments(Array.isArray(post.comments) ? post.comments : []);
  }, [post.comments]);

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
      await axios.post(
        `${API_URL}/posts/${post.id}/upvote?userId=${userId}`,
        {},
        getAuthHeaders()
      );

      setLikeCount((currentLikeCount) => (liked ? currentLikeCount - 1 : currentLikeCount + 1));
      setLiked((currentLiked) => !currentLiked);
    } catch (err) {
      if (err.response?.status === 400) {
        alert('You have already upvoted this post');
      } else {
        console.error('Failed to upvote:', err);
      }
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const trimmedComment = commentInput.trim();

    if (!trimmedComment) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/posts/${post.id}/comments`,
        { content: trimmedComment },
        getAuthHeaders()
      );

      const newComment = response?.data || {
        id: Date.now(),
        content: trimmedComment,
        createdAt: new Date().toISOString(),
        user: {
          username: localStorage.getItem('username') || 'You',
        },
      };

      setComments((currentComments) => [...currentComments, newComment]);
      setCommentInput('');
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment');
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {post.user?.name?.charAt(0) || 'U'}
        </div>
        <div className="post-meta">
          <div className="post-author">{post.user?.username || 'Unknown'}</div>
          <div className="post-time">@{post.user?.username || 'user'} • {new Date(post.createdAt).toLocaleString()}</div>
        </div>
        {/* <button className="follow-btn">+ Follow</button> */}
      </div>

      {post.title && <h3 className="post-title">{post.title}</h3>}

      <p className="post-content">{post.content}</p>

      {post.images && post.images.length > 0 && (
        <div className="post-images">
          {post.images.map((image, index) => (
            <div key={index} className="post-image" style={{ backgroundImage: `url(${image})` }} />
          ))}
        </div>
      )}

      <div className="post-engagement">
        <div className="engagement-item" onClick={handleLike}>
          {liked ? '❤️' : '🤍'} {likeCount}
        </div>
        <div className="engagement-item">
          💬 {comments.length}
        </div>
        <div className="engagement-item">
          🔄
        </div>
        <div className="engagement-item">
          ⬆️
        </div>
      </div>

      <div className="comments-section">
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="comment-text">No comments yet. Be the first to comment.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id || `${comment.content}-${comment.createdAt}`} className="comment-item">
                <div className="comment-avatar">
                  {(comment.user?.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="comment-content-area">
                  <div className="comment-author-info">
                    <span className="comment-author">{comment.user?.username || 'Unknown'}</span>
                    <span className="comment-time">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <input
            className="comment-input"
            type="text"
            value={commentInput}
            onChange={(event) => setCommentInput(event.target.value)}
            placeholder="Write a comment..."
            aria-label="Write a comment"
          />
          <button type="submit" className="comment-submit-btn">Post</button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;
