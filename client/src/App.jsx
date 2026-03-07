import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage.jsx'
import AuthPage from './Pages/AuthPage.jsx';
import UserPage from './Pages/UserPage.jsx';
import CreateBlog from './Pages/CreateBlog.jsx';
import BlogPost from './Pages/BlogPost.jsx';

import './App.css'
const App = () => {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/login' element={<AuthPage mode={true} />} />
          <Route path='/signup' element={<AuthPage mode={false} />} />
          <Route path="/reader/:username" element={<UserPage role="reader" />} />
          <Route path="/author/:username" element={<UserPage role="author" />} />
          <Route path="/admin" element={<UserPage role="admin" />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
