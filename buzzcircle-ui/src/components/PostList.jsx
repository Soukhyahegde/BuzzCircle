import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PostList({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/posts/${userId}`)
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch posts");
        setLoading(false);
      });
  }, [userId]);

  const handleUpvote = async (postId) => {
    try {
      await axios.post(`http://localhost:8080/api/posts/${postId}/upvote?userId=${userId}`);
      setPosts(posts => posts.map(post =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      ));
    } catch (e) {
      alert("You have already upvoted this post");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-2 mt-4">
      {posts.map(post => (
        <div key={post.id} className="p-4 border rounded shadow">
          <p>{post.content}</p>
          <small>Upvotes: {post.upvotes}</small>
          <button className="ml-2 px-2 py-1 bg-green-500 text-white rounded" onClick={() => handleUpvote(post.id)}>Upvote</button>
        </div>
      ))}
    </div>
  );
}