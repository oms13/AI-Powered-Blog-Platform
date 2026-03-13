import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BrainCircuit, Heart, Calendar, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FeedPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/blog/feed");
        if (response.data.success) {
          setBlogs(response.data.blogs);
        } else {
          console.error("Failed to load feed");
        }
        await delay(1000); // Slight delay for smooth transition
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const getExcerpt = (content) => {
    // Added safety check in case content isn't properly formatted
    if (!Array.isArray(content)) return "Read more to explore this article...";
    const paragraph = content.find(block => block.type === "paragraph");
    if (!paragraph || !paragraph.content) return "Read more to explore this article...";
    return paragraph.content.split(" ").slice(0, 25).join(" ") + "...";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-32 px-4">
        {/* Professional Skeleton Loader */}
        <div className="w-full max-w-4xl space-y-8">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 animate-pulse">
              <div className="flex-1 space-y-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
              <div className="w-full sm:w-64 h-48 bg-gray-100 rounded-2xl shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 selection:bg-indigo-100 selection:text-indigo-900">

      {/* Top Navigation - Synchronized with UserPage & BlogPost */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <BrainCircuit className="h-7 w-7 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              BlogSpire
            </span>
          </Link>
          
          <div className="relative">
            <div
              className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Author" className="w-8 h-8 rounded-full object-cover shadow-sm" />
              ) : (
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {user.name[0]}
                </div>
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 border border-gray-100 z-50">
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                </div>
                <Link
                  to={`/${user.role}/${user.username}`}
                  className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 md:pt-16">

        {/* Hero Section */}
        <div className="mb-12 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Community Feed
            </h1>
            <p className="text-gray-500 mt-3 text-lg font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Discover insights and stories from top authors.
            </p>
          </div>
        </div>

        {/* Blog Feed */}
        {blogs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
             <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                <BrainCircuit className="w-8 h-8" />
              </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">It's quiet here...</h3>
            <p className="text-gray-500 text-lg mb-6">No blogs have been published yet. Be the first to share your thoughts!</p>
            {user.role === 'author' && (
              <Link to="/create-blog" className="font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full transition-colors shadow-sm">
                Start Writing
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:gap-10">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden group"
              >
                {/* Text Content */}
                <div className="p-8 md:p-10 flex-grow flex flex-col justify-between order-2 sm:order-1">

                  <div>
                    {/* Author & Date Row */}
                    <div className="flex items-center gap-3 mb-5">
                      <Link to={`/author/${blog.author.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        {blog.author?.profilePicture ? (
                          <img src={blog.author.profilePicture} alt="Author" className="w-9 h-9 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                            {blog.author?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <span className="text-sm font-bold text-gray-900">{blog.author?.name || 'Unknown Author'}</span>
                      </Link>
                      <span className="text-gray-300">•</span>
                      <span className="text-[13px] font-medium text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Title & Excerpt */}
                    <Link to={`/blog/${blog.slug}`} className="block group-hover:text-indigo-600 transition-colors">
                      <h2 className="text-2xl md:text-[1.75rem] font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                        {blog.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-8 leading-[1.8] font-serif text-[17px] line-clamp-2">
                      {getExcerpt(blog.content)}
                    </p>
                  </div>

                  {/* Footer Row */}
                  <div className="pt-5 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-gray-500 font-medium text-sm">
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" /> {blog.likes || 0}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-gray-400" /> {blog.views || 0}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full flex items-center gap-2 transition-all"
                    >
                      Read Article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {blog.coverImage && (
                  <div className="w-full sm:w-2/5 lg:w-[45%] h-64 sm:h-auto order-1 sm:order-2 flex-shrink-0 overflow-hidden relative border-b sm:border-b-0 sm:border-l border-gray-100">
                    <Link to={`/blog/${blog.slug}`} className="block w-full h-full">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default FeedPage;