import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage.jsx';
import AuthPage from './Pages/AuthPage.jsx';
import UserPage from './Pages/UserPage.jsx';
import CreateBlog from './Pages/CreateBlog.jsx';
import BlogPost from './Pages/BlogPost.jsx';
import FeedPage from './Pages/FeedPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';

import './App.css';
import AboutPage from './Pages/AboutPage.jsx';

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage/>}/>
          <Route
            path="/login"
            element={<PublicRoute><AuthPage mode={true} /></PublicRoute>}
          />
          <Route
            path="/signup"
            element={<PublicRoute><AuthPage mode={false} /></PublicRoute>}
          />

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