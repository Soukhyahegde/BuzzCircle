import React, { useState } from "react";
import axios from "axios";

export default function NewPostForm() {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8080/api/posts", {
      content,
      upvotes: 0,
      user: { id: 1 } // change this to your userId
    }).then(() => {
      setContent("");
      window.location.reload(); // simple refresh to show new post
    }).catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full border p-2 rounded"
        rows="3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Post</button>
    </form>
  );
}