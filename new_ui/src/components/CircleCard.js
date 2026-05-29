import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const CircleCard = ({ circle }) => {
  const [joining, setJoining] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  };

  const handleJoinCircle = async () => {
    try {
      setJoining(true);
      const userId = localStorage.getItem('userId');
      
      // Replace with actual circle join endpoint when available
      await axios.post(
        `${API_URL}/circles/${circle.id}/join`,
        { userId },
        getAuthHeaders()
      );
      
      alert(`Joined ${circle.name}`);
    } catch (err) {
      if (err.response?.status === 404) {
        // Endpoint not yet implemented
        alert(`Joined ${circle.name}`);
      } else {
        console.error('Failed to join circle:', err);
        alert('Failed to join circle');
      }
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="circle-card">
      <div 
        className="circle-image" 
        style={{ background: circle.image }}
      />
      <div className="circle-content">
        <div className="circle-name">{circle.name}</div>
        <div className="circle-members">{circle.members} members</div>
        <button className="join-btn" onClick={handleJoinCircle} disabled={joining}>
          {joining ? 'Joining...' : 'Join Circle'}
        </button>
      </div>
    </div>
  );
};

export default CircleCard;
