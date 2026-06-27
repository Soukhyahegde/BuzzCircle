import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

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

const getMemberCount = (circle) => {
  if (typeof circle?.memberCount === 'number') {
    return circle.memberCount;
  }

  if (Array.isArray(circle?.members)) {
    return circle.members.length;
  }

  if (typeof circle?.members === 'number') {
    return circle.members;
  }

  return 0;
};

const RightSidebar = () => {
  const [circles, setCircles] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      setCurrentUserId(userId);

      const [circlesResponse, suggestedResponse] = await Promise.all([
        axios.get(`${API_URL}/user/${userId}/circles`, getAuthHeaders()),
        axios.get(`${API_URL}/user/${userId}/suggested`, getAuthHeaders()),
      ]);

      setCircles(normalizeList(circlesResponse.data));
      setSuggestedUsers(normalizeList(suggestedResponse.data));
    } catch (error) {
      console.error('Error fetching data:', error);
      setCircles([]);
      setSuggestedUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFollow = async (userIdToFollow) => {
    try {
      await axios.post(
        `${API_URL}/user/${userIdToFollow}/follow?followerId=${currentUserId}`,
        {},
        getAuthHeaders()
      );

      // Remove from suggested users
      setSuggestedUsers(currentUsers => currentUsers.filter(u => u.id !== userIdToFollow));
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  if (loading) {
    return <div className="right-sidebar">Loading...</div>;
  }

  return (
    <div className="right-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Your Circles</h3>
        {circles.length > 0 ? (
          <ul className="group-list">
            {circles.map(circle => (
              <li key={circle.id} className="group-item">
                <div className="group-avatar">{circle.name?.charAt(0) || 'C'}</div>
                <div className="group-info">
                  <div className="group-name">{circle.name}</div>
                  <div className="contact-status">
                    {getMemberCount(circle)} members
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="sidebar-empty">Join a circle to see it here.</p>
        )}
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Suggested Users</h3>
        {suggestedUsers.length > 0 ? (
          <ul className="contact-list">
            {suggestedUsers.map(user => (
              <li key={user.id} className="contact-item">
                <div className="contact-avatar">{user.username?.charAt(0) || 'U'}</div>
                <div className="contact-info">
                  <div className="contact-name">{user.username}</div>
                </div>
                <button
                  className="follow-btn"
                  onClick={() => handleFollow(user.id)}
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Follow
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="sidebar-empty">No suggested users right now.</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
