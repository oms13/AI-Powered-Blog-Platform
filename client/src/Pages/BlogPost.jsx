import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  BrainCircuit, Copy, CheckCircle, ArrowLeft,
  Calendar, Heart, Eye, Share2, MessageCircle, Send, Loader2, Trash2
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

const CodeBlock = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group my-10 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-950/50 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
          <span className="ml-2 text-xs font-mono text-gray-400 uppercase tracking-wider">{language || 'text'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-700/50 px-3 py-1.5 rounded-md"
        >
          {isCopied ? (
            <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copied!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy</>
          )}
        </button>
      </div>
      <pre className="p-6 overflow-x-auto text-[15px] font-mono text-gray-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [blogData, setBlogData] = useState(null);

  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("You must be logged in to view a blog.");
          return;
        }

        const blogRes = await axios.post(
          "http://localhost:5001/api/blog/blog-info",
          { slug },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (blogRes.data.success) {
          const blogContent = blogRes.data.blogContent;
          setBlogData({
            _id: blogContent._id, 
            title: blogContent.title,
            author: blogContent.author,
            createdAt: blogContent.createdAt,
            content: blogContent.content,
          });
          setViewsCount(blogContent.views || 0);
          setLikesCount(blogContent.likes || 0);
          setIsLiked(blogContent.userHasLiked || false);

          try {
            const commentsRes = await axios.get(`http://localhost:5001/api/blog/comments/${blogContent._id}`);
            if (commentsRes.data.success) {
              setComments(commentsRes.data.comments);
            }
          } catch (commentErr) {
            console.error("Failed to load comments:", commentErr);
          } finally {
            setIsLoadingComments(false);
          }

          await delay(500); 
        } else {
          alert("Unable to load the Blog");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogAndComments();
  }, [slug]);

  const handleLikeToggle = async () => {
    if (isLiking) return;
    const token = localStorage.getItem("accessToken");
    setIsLiking(true);

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

    try {
      await axios.post("http://localhost:5001/api/blog/toggle-like",
        { slug },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to toggle like", error);
      setIsLiked(!newIsLiked);
      setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLiking(false);
    }
  };

  const submitComment = async () => {
    if (!commentInput.trim() || !user || !blogData) return;

    setIsSubmittingComment(true);
    try {
      const res = await axios.post("http://localhost:5001/api/blog/comment", { 
        userID: user._id, 
        blogId: blogData._id, 
        content: commentInput 
      });

      if (res.data.success) {
        const newComment = res.data.comment || {
          _id: Date.now().toString(),
          user_id: {
            _id: user._id,
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture
          },
          content: commentInput.trim(),
          likes: [],
          createdAt: new Date().toISOString()
        };

        setComments(prev => [...prev, newComment]);
        setCommentInput('');
      } else {
        alert(res.data.message || "Failed to post comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Something went wrong while posting your comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitComment();
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      const res = await axios.post(`http://localhost:5001/api/blog/comment/${blogData._id}/${commentId}`, { 
        userID: user._id 
      });

      if (res.data.success) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      } else {
        alert(res.data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Something went wrong while deleting the comment.");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      alert("You must be logged in to like a comment.");
      return;
    }

    setComments(prev => prev.map(comment => {
      if (comment._id === commentId) {
        const likesArray = Array.isArray(comment.likes) ? comment.likes : [];
        const isLiked = likesArray.some(like => (like._id || like).toString() === user._id.toString());
        const newLikes = isLiked
          ? likesArray.filter(like => (like._id || like).toString() !== user._id.toString())
          : [...likesArray, user._id];
        
        return { ...comment, likes: newLikes };
      }
      return comment;
    }));

    try {
      await axios.post("http://localhost:5001/api/blog/comment/like", { 
        blogId: blogData._id, 
        commentId, 
        userID: user._id 
      });
    } catch (error) {
      console.error("Failed to toggle comment like:", error);
    }
  };


  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'heading':
        return <h2 key={index} className="text-3xl font-extrabold text-gray-900 dark:text-white mt-14 mb-6 leading-tight">{block.text}</h2>;
      case 'paragraph':
        return <p key={index} className="text-[20px] text-gray-800 dark:text-gray-300 leading-[1.8] tracking-[-0.01em] mb-8 font-serif">{block.text}</p>;
      case 'quote':
        return (
          <blockquote key={index} className="relative my-12 pl-8 py-2">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full"></div>
            <p className="text-2xl italic text-gray-700 dark:text-gray-400 font-serif leading-relaxed">"{block.text}"</p>
          </blockquote>
        );
      case 'image':
        return (
          <figure key={index} className="my-12">
            <img src={block.text} alt={block.alt || 'Blog image'} className="w-full rounded-2xl shadow-lg object-cover bg-gray-50 dark:bg-gray-900" />
            {block.caption && <figcaption className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">{block.caption}</figcaption>}
          </figure>
        );
      case 'code':
        return <CodeBlock key={index} code={block.text} language={block.language} />;
      default:
        return null;
    }
  };

  if (isLoading || !blogData) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-gray-950 pt-24 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl w-3/4"></div>
            <div className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32"></div>
                <div className="h-3 bg-gray-50 dark:bg-gray-800/50 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">

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
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Author" className="w-8 h-8 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-8 h-8 bg-gray-900 dark:bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user?.name?.[0] || 'U'}
                  </div>
                )}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] py-2 border border-gray-100 dark:border-gray-800 z-50">
                  <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 mb-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user?.username}</p>
                  </div>
                  <Link
                    to={`/${user?.role}/${user?.username}`}
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

        <header className="mb-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-8 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-2 rounded-full">
            <ArrowLeft className="w-4 h-4" /> Back to reading
          </Link>

          <h1 className="text-4xl md:text-[3.5rem] font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">
            {blogData.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-gray-100 dark:border-gray-800">
            <Link to={`/author/${blogData.author.username}`}>
              <div className="flex items-center gap-4">
                {blogData.author.avatar ? (
                  <img src={blogData.author.avatar} alt={blogData.author.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold text-lg">
                    {blogData.author.name[0]}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-base">
                    {blogData.author.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                    <span>{blogData.readTime || '5'} min read</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span>
                      {new Date(blogData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Eye className="w-4 h-4" /> {viewsCount}
              </div>
              <button onClick={handleLikeToggle} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? 'text-red-600 dark:text-red-500' : 'hover:text-gray-900 dark:hover:text-white'}`}>
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {likesCount}
              </button>
            </div>
          </div>
        </header>

        <article className="prose-container">
          {blogData.content.map((block, index) => renderContentBlock(block, index))}
        </article>

        <div className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleLikeToggle}
              disabled={isLiking}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isLiked
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/40'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                }`}
            >
              <Heart className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all">
              <Share2 className="w-5 h-5" /> Share
            </button>
          </div>
        </div>

        <section className="mt-16 bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-indigo-500" />
              Discussion ({comments.length})
            </h3>
          </div>

          <div className="flex gap-4 mb-10">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="You" className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm" />
            ) : (
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                {user?.name?.[0] || 'U'}
              </div>
            )}
            <div className="flex-1 relative">
              <textarea 
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={handleCommentKeyDown}
                placeholder="What are your thoughts?" 
                disabled={isSubmittingComment || isLoadingComments}
                rows={3}
                className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl py-3 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors disabled:opacity-60 resize-none"
              />
              <button 
                onClick={submitComment}
                disabled={isSubmittingComment || !commentInput.trim()}
                className="absolute right-3 bottom-3 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-sm"
              >
                {isSubmittingComment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {isLoadingComments ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : comments.length > 0 ? (
              [...comments].reverse().map((comment, index) => {
                
                const commentLikesArray = Array.isArray(comment.likes) ? comment.likes : [];
                const isCommentLiked = user 
                  ? commentLikesArray.some(like => (like._id || like).toString() === user._id.toString()) 
                  : false;

                return (
                  <div key={comment._id || index} className="flex gap-4 group/comment animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Link to={`/${comment.user_id?.role || 'reader'}/${comment.user_id?.username}`} className="shrink-0 pt-1">
                      {comment.user_id?.profilePicture ? (
                        <img src={comment.user_id.profilePicture} alt={comment.user_id.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-700" />
                      ) : (
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold shadow-sm">
                          {comment.user_id?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 flex flex-col">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-800 relative">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <Link to={`/${comment.user_id?.role || 'reader'}/${comment.user_id?.username}`} className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                              {comment.user_id?.name || 'Unknown User'}
                            </Link>
                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                              {getTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          
                          {/* Delete Button */}
                          {user && comment.user_id?._id === user._id && (
                            <button 
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 p-1.5 rounded-md transition-colors opacity-0 group-hover/comment:opacity-100 focus:opacity-100 absolute top-3 right-3"
                              title="Delete Comment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>

                      <div className="mt-2 ml-2 flex items-center gap-4">
                        <button 
                          onClick={() => handleLikeComment(comment._id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors px-2 py-1 rounded-md ${
                            isCommentLiked 
                              ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isCommentLiked ? 'fill-current' : ''}`} /> 
                          {commentLikesArray.length || 'Like'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
                <MessageCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No comments yet. Start the conversation!</p>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default BlogPost;