import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BrainCircuit, Heart, Calendar, ArrowRight, Eye,
  Sparkles, MessageCircle, Share2, Send, Loader2, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const getTimeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "Just now";
};

const FeedPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [expandedComments, setExpandedComments] = useState({});

  const [fetchedComments, setFetchedComments] = useState({});
  const [isLoadingComments, setIsLoadingComments] = useState({});

  const [commentInputs, setCommentInputs] = useState({});
  const [isSubmittingComment, setIsSubmittingComment] = useState({});

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
        await delay(1000);
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const getExcerpt = (content) => {
    if (!Array.isArray(content)) return "Read more to explore this article...";
    const paragraph = content.find(block => block.type === "paragraph");
    if (!paragraph || !paragraph.content) return "Read more to explore this article...";
    return paragraph.content.split(" ").slice(0, 25).join(" ") + "...";
  };

  const toggleComments = async (blogId) => {
    const isCurrentlyOpen = expandedComments[blogId];

    setExpandedComments(prev => ({
      ...prev,
      [blogId]: !isCurrentlyOpen
    }));

    if (!isCurrentlyOpen && !fetchedComments[blogId]) {
      setIsLoadingComments(prev => ({ ...prev, [blogId]: true }));

      try {
        const res = await axios.get(`http://localhost:5001/api/blog/comments/${blogId}`);
        if (res.data.success) {
          setFetchedComments(prev => ({
            ...prev,
            [blogId]: res.data.comments
          }));
        }
      } catch (error) {
        console.error("Failed to fetch comments for blog:", error);
      } finally {
        setIsLoadingComments(prev => ({ ...prev, [blogId]: false }));
      }
    }
  };

  const handleCommentChange = (blogId, text) => {
    setCommentInputs(prev => ({ ...prev, [blogId]: text }));
  };

  const submitComment = async (blogId) => {
    const content = commentInputs[blogId];
    if (!content || !content.trim()) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to comment.");
      return;
    }

    setIsSubmittingComment(prev => ({ ...prev, [blogId]: true }));

    try {
      const res = await axios.post(
        "http://localhost:5001/api/blog/comment",
        { userID: user._id, blogId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const newComment = res.data.comment || {
          _id: Date.now().toString(),
          user_id: {
            _id: user._id,
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture
          },
          content: content.trim(),
          likes: [],
          createdAt: new Date().toISOString()
        };

        setFetchedComments(prev => ({
          ...prev,
          [blogId]: [...(prev[blogId] || []), newComment]
        }));

        setBlogs(prevBlogs => prevBlogs.map(blog => {
          if (blog._id === blogId) {
            return { ...blog, comments: [...(blog.comments || []), newComment._id] };
          }
          return blog;
        }));

        setCommentInputs(prev => ({ ...prev, [blogId]: '' }));
      } else {
        alert(res.data.message || "Failed to post comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Something went wrong while posting your comment.");
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [blogId]: false }));
    }
  };

  const handleDeleteComment = async (blogId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;


    try {
      const res = await axios.post(
        `http://localhost:5001/api/blog/comment/${blogId}/${commentId}`,
        { userID: user._id }
      );

      if (res.data.success) {
        setFetchedComments(prev => ({
          ...prev,
          [blogId]: prev[blogId].filter(c => c._id !== commentId)
        }));

        setBlogs(prevBlogs => prevBlogs.map(blog => {
          if (blog._id === blogId) {
            return {
              ...blog,
              comments: blog.comments.filter(c => {
                const cId = typeof c === 'string' ? c : c._id;
                return cId !== commentId;
              })
            };
          }
          return blog;
        }));
      } else {
        alert(res.data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Something went wrong while deleting the comment.");
    }
  };


  const handleCommentKeyDown = (e, blogId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitComment(blogId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center pt-32 px-4 transition-colors duration-300">
        <div className="w-full max-w-3xl space-y-8">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
              </div>
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-24 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">

      <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 transition-all">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <BrainCircuit className="h-7 w-7 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              BlogSpire
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            <div className="relative">
              <div
                className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Author" className="w-8 h-8 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-8 h-8 bg-gray-900 dark:bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user.name[0]}
                  </div>
                )}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] py-2 border border-gray-100 dark:border-gray-800 z-50">
                  <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 mb-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                  </div>
                  <Link
                    to={`/${user.role}/${user.username}`}
                    className="block px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 md:pt-16">

        <div className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Community Feed
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              Discover insights and stories from top authors.
            </p>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">It's quiet here...</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">No blogs have been published yet. Be the first to share your thoughts!</p>
            {user.role === 'author' && (
              <Link to="/create-blog" className="font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-6 py-3 rounded-full transition-colors shadow-sm">
                Start Writing
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:gap-12">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden group p-6 sm:p-8"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <Link to={`/author/${blog.author?.username}`} className="shrink-0 hover:opacity-80 transition-opacity">
                      {blog.author?.profilePicture ? (
                        <img src={blog.author.profilePicture} alt="Author" className="w-11 h-11 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-700" />
                      ) : (
                        <div className="w-11 h-11 bg-gray-900 dark:bg-gray-700 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                          {blog.author?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-col">
                      <Link to={`/author/${blog.author?.username}`} className="text-[15px] font-bold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {blog.author?.name || 'Unknown Author'}
                      </Link>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {getTimeAgo(blog.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5 shrink-0 mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <Link to={`/blog/${blog.slug}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight tracking-tight">
                    {blog.title}
                  </h2>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-[1.7] text-[16px] line-clamp-3 font-serif">
                  {getExcerpt(blog.content)}
                </p>

                {blog.coverImage && (
                  <div className="w-full mb-6 rounded-2xl overflow-hidden aspect-[16/9] border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    <Link to={`/blog/${blog.slug}`} className="block w-full h-full">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4 sm:gap-6 text-gray-500 dark:text-gray-400 font-medium text-sm">
                    <button className="flex items-center gap-1.5 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                      <Heart className="w-5 h-5" /> {blog.likes || 0}
                    </button>
                    <button
                      onClick={() => toggleComments(blog._id)}
                      className="flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" /> {blog.comments?.length || 0}
                    </button>
                    <span className="flex items-center gap-1.5 cursor-default">
                      <Eye className="w-5 h-5" /> {blog.views || 0}
                    </span>
                    <button className="hidden sm:flex items-center gap-1.5 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shrink-0"
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {expandedComments[blog._id] && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300 fade-in">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Discussion
                    </h4>

                    <div className="flex gap-3 mb-8">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="You" className="w-9 h-9 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {user.name ? user.name[0] : 'U'}
                        </div>
                      )}
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={commentInputs[blog._id] || ''}
                          onChange={(e) => handleCommentChange(blog._id, e.target.value)}
                          onKeyDown={(e) => handleCommentKeyDown(e, blog._id)}
                          placeholder="Add to the discussion..."
                          disabled={isSubmittingComment[blog._id] || isLoadingComments[blog._id]}
                          className="w-full bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors disabled:opacity-60"
                        />
                        <button
                          onClick={() => submitComment(blog._id)}
                          disabled={isSubmittingComment[blog._id] || !commentInputs[blog._id]?.trim()}
                          className="absolute right-2 top-1.5 p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                          {isSubmittingComment[blog._id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {isLoadingComments[blog._id] ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                        </div>
                      ) : fetchedComments[blog._id] && fetchedComments[blog._id].length > 0 ? (
                        [...fetchedComments[blog._id]].reverse().map((comment, index) => (
                          <div key={comment._id || index} className="flex gap-3 group/comment">
                            <Link to={`/${comment.user_id?.role || 'reader'}/${comment.user_id?.username}`} className="shrink-0">
                              {comment.user_id?.profilePicture ? (
                                <img src={comment.user_id.profilePicture} alt={comment.user_id.name} className="w-8 h-8 rounded-full object-cover border border-gray-100 dark:border-gray-700" />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
                                  {comment.user_id?.name?.charAt(0) || 'U'}
                                </div>
                              )}
                            </Link>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3.5 flex-1 border border-transparent dark:border-gray-800">
                              <div className="flex justify-between items-center mb-1">
                                <Link to={`/${comment.user_id?.role || 'reader'}/${comment.user_id?.username}`} className="text-sm font-bold text-gray-900 dark:text-gray-100 hover:underline">
                                  {comment.user_id?.name || 'Unknown User'}
                                </Link>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {getTimeAgo(comment.createdAt)}
                                  </span>
                                  {user && comment.user_id?._id === user._id && (
                                    <button
                                      onClick={() => handleDeleteComment(blog._id, comment._id)}
                                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover/comment:opacity-100 focus:opacity-100"
                                      title="Delete Comment"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {comment.content}
                              </p>
                              <div className="mt-2.5 flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                <button className="flex items-center gap-1.5 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                  <Heart className="w-3.5 h-3.5" /> {comment.likes?.length || 0}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                          No comments yet. Be the first to share your thoughts!
                        </div>
                      )}
                    </div>
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