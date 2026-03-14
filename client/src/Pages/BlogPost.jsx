import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  BrainCircuit, Copy, CheckCircle, ArrowLeft,
  Calendar, Heart, Eye, Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchBlog = async () => {
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
            title: blogContent.title,
            author: blogContent.author,
            createdAt: blogContent.createdAt,
            content: blogContent.content,
          });
          setViewsCount(blogContent.views || 0);
          setLikesCount(blogContent.likes || 0);
          setIsLiked(blogContent.userHasLiked || false);
          await delay(1500);
        } else {
          alert("Unable to load the Blog");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
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

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'heading':
        return <h2 key={index} className="text-3xl font-extrabold text-gray-900 mt-14 mb-6 leading-tight">{block.text}</h2>;
      case 'paragraph':
        return <p key={index} className="text-[20px] text-gray-800 leading-[1.8] tracking-[-0.01em] mb-8 font-serif">{block.text}</p>;
      case 'quote':
        return (
          <blockquote key={index} className="relative my-12 pl-8 py-2">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-full"></div>
            <p className="text-2xl italic text-gray-700 font-serif leading-relaxed">"{block.text}"</p>
          </blockquote>
        );
      case 'image':
        return (
          <figure key={index} className="my-12">
            <img src={block.text} alt={block.alt || 'Blog image'} className="w-full rounded-2xl shadow-lg object-cover bg-gray-50" />
            {block.caption && <figcaption className="text-center text-sm font-medium text-gray-500 mt-4">{block.caption}</figcaption>}
          </figure>
        );
      case 'code':
        return <CodeBlock key={index} code={block.text} language={block.language} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white max-w-3xl mx-auto px-4 pt-24">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-100 rounded-xl w-3/4"></div>
          <div className="flex items-center gap-4 py-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-32"></div>
              <div className="h-3 bg-gray-50 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 selection:bg-indigo-100 selection:text-indigo-900">

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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 md:pt-16">

        <header className="mb-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mb-8 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full">
            <ArrowLeft className="w-4 h-4" /> Back to reading
          </Link>

          <h1 className="text-4xl md:text-[3.5rem] font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
            {blogData.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-gray-100">
            <Link to={`/author/${blogData.author.username}`}>

              <div className="flex items-center gap-4">
                {blogData.author.avatar ? (
                  <img src={blogData.author.avatar} alt={blogData.author.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                    {blogData.author.name[0]}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 text-base">
                    {blogData.author.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 font-medium">
                    <span>{blogData.readTime || '5'} min read</span>
                    <span className="text-gray-300">•</span>
                    <span>
                      {new Date(blogData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Eye className="w-4 h-4" /> {viewsCount}
              </div>
              <button onClick={handleLikeToggle} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? 'text-red-600' : 'hover:text-gray-900'}`}>
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {likesCount}
              </button>
            </div>
          </div>
        </header>

        <article className="prose-container">
          {blogData.content.map((block, index) => renderContentBlock(block, index))}
        </article>

        <div className="mt-20 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleLikeToggle}
              disabled={isLiking}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isLiked
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                }`}
            >
              <Heart className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all">
              <Share2 className="w-5 h-5" /> Share
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default BlogPost;