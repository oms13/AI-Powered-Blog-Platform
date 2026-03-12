import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage.jsx';
import AuthPage from './Pages/AuthPage.jsx';
import UserPage from './Pages/UserPage.jsx';
import CreateBlog from './Pages/CreateBlog.jsx';
import BlogPost from './Pages/BlogPost.jsx';
import FeedPage from './Pages/FeedPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import './App.css';

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode={true} />} />
          <Route path="/signup" element={<AuthPage mode={false} />} />

          <Route
            path="/reader/:username"
            element={<ProtectedRoute><UserPage role="reader" /></ProtectedRoute>}
          />
          <Route
            path="/author/:username"
            element={<ProtectedRoute><UserPage role="author" /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute><UserPage role="admin" /></ProtectedRoute>}
          />
          <Route
            path="/create-blog"
            element={<ProtectedRoute><CreateBlog /></ProtectedRoute>}
          />
          <Route
            path="/blog"
            element={<ProtectedRoute><FeedPage /></ProtectedRoute>}
          />
          <Route
            path="/blog/:slug"
            element={<ProtectedRoute><BlogPost /></ProtectedRoute>}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;