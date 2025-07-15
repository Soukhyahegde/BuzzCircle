import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/posts/1")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-2 mt-4">
      {posts.map(post => (
        <div key={post.id} className="p-4 border rounded shadow">
          <p>{post.content}</p>
          <small>Upvotes: {post.upvotes}</small>
        </div>
      ))}
    </div>
  );
}