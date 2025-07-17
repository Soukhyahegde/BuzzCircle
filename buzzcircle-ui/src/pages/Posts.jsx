import React from "react";
import PostList from "../components/PostList";
import NewPostForm from "../components/NewPostForm";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Posts() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      <h1 className="text-xl font-bold">Posts</h1>
      <NewPostForm userId={user.userId} />
      <PostList userId={user.userId} />
    </div>
  );
}
