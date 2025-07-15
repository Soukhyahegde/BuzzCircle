
import React, { useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([
    { id: 1, content: "Just captured an amazing sunset at the beach. 🌅", upvotes: 12 },
    { id: 2, content: "Does anyone have recommendations for a solo trip to Japan?", upvotes: 5 },
  ]);

  const handleUpvote = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
    ));
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>BuzzCircle - Explore Interests</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['Photography', 'Travel', 'Cooking'].map((topic, index) => (
          <div key={index} style={{ flex: 1, padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
            <h3>{topic}</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Join the {topic.toLowerCase()} circle and connect with like-minded people.</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem' }}>Top Posts</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map(post => (
          <div key={post.id} style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
            <p>{post.content}</p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              Upvotes: {post.upvotes}
              <button 
                onClick={() => handleUpvote(post.id)}
                style={{ marginLeft: '1rem', padding: '0.3rem 0.6rem', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                👍 Upvote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
