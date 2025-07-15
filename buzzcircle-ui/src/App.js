import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow">
          <h1 className="text-2xl font-bold">BuzzCircle</h1>
          <Link to="/login">
            <button className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100">
              Login
            </button>
          </Link>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
