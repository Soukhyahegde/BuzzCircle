import React from "react";

const Home = () => {
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
          <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
            <p>Just captured an <strong>amazing</strong> sunset at the beach. 🌅</p>
            <p className="text-sm text-gray-500 mt-1">Upvotes: 12</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p>Does anyone have recommendations for a solo trip to Japan?</p>
            <p className="text-sm text-gray-500 mt-1">Upvotes: 5</p>
          </div>
        </div>

        {/* New Post Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">New Post</h3>
          <form className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="What's on your mind?"
              className="border p-2 rounded"
            />
            <textarea
              rows="3"
              placeholder="Write your post..."
              className="border p-2 rounded"
            ></textarea>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
