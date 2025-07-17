import React, { useState } from "react";

const initialPosts = [
  { id: 1, content: "Just captured an amazing sunset at the beach. 🌅", upvotes: 12 },
  { id: 2, content: "Does anyone have recommendations for a solo trip to Japan?", upvotes: 5 },
];

const Home = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newContent, setNewContent] = useState("");

  const handleUpvote = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
    ));
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setPosts([
      { id: Date.now(), content: newContent, upvotes: 0 },
      ...posts,
    ]);
    setNewContent("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interest-based Social Networking</h2>

      <h3 className="text-xl font-semibold mb-2">Home</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Photography", desc: "A circle for photography enthusiasts." },
          { title: "Travel", desc: "Share your travel experiences and tips." },
          { title: "Cooking", desc: "Discuss recipes, cooking techniques, and more." }
        ].map((circle, idx) => (
          <div key={idx} className="border p-4 bg-white rounded-lg shadow-sm">
            <h4 className="font-bold text-lg">{circle.title}</h4>
            <p className="text-sm text-gray-600">{circle.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Posts Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Posts</h3>
          {posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <p>{post.content}</p>
              <div className="text-sm text-gray-500 mt-1 flex items-center">
                Upvotes: {post.upvotes}
                <button
                  className="ml-4 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => handleUpvote(post.id)}
                >
                  👍 Upvote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* New Post Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">New Post</h3>
          <form className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-sm" onSubmit={handleNewPost}>
            <textarea
              rows="3"
              placeholder="Write your post..."
              className="border p-2 rounded"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
            ></textarea>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
