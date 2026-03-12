import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BrainCircuit, Heart, Calendar, ArrowRight, Loader2 } from 'lucide-react';

const FeedPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/blog/feed");
        
        if (response.data.success) {
          setBlogs(response.data.blogs);
        } else {
          console.error("Failed to load feed");
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const getExcerpt = (content) => {
    const paragraph = content.find(block => block.type === "paragraph");

    if (!paragraph) return "";

    return paragraph.content.split(" ").slice(0, 20).join(" ") + "...";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading latest stories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              NexusAI
            </span>
          </div>
          <nav className="flex gap-4">
            <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              My Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        
        <div className="mb-12 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Community Feed</h1>
          <p className="text-gray-500 mt-2 text-lg">Discover AI-generated insights and stories from top authors.</p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
            <p className="text-gray-500 text-lg">No blogs published yet. Be the first!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog._id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row overflow-hidden group"
              >
                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between order-2 sm:order-1">
                  
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {blog.author?.profilePicture ? (
                        <img src={blog.author.profilePicture} alt="Author" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {blog.author?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">{blog.author?.name || 'Unknown Author'}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <Link to={`/blog/${blog.slug}`} className="block group-hover:text-indigo-600 transition-colors">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                        {blog.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {getExcerpt(blog.content)}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
                      <Heart className="w-4 h-4 text-red-400" /> {blog.likes || 0} Likes
                    </div>
                    <Link 
                      to={`/blog/${blog.slug}`}
                      className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read Article <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {blog.coverImage && (
                  <div className="w-full sm:w-1/3 md:w-2/5 h-56 sm:h-auto order-1 sm:order-2 flex-shrink-0 overflow-hidden border-b sm:border-b-0 sm:border-l border-gray-100 relative">
                    <Link to={`/blog/${blog.slug}`} className="block w-full h-full">
                      <img 
                        src={blog.coverImage} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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