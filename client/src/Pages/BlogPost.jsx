import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'
import { BrainCircuit, Copy, CheckCircle, ArrowLeft, Calendar, User, Heart } from 'lucide-react';

const CodeBlock = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group my-8 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-800 shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] border-b border-gray-800">
        <span className="text-xs font-mono text-gray-400 uppercase">{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
        >
          {isCopied ? (
            <><CheckCircle className="w-4 h-4 text-green-500" /> Copied!</>
          ) : (
            <><Copy className="w-4 h-4" /> Copy</>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const BlogPost = () => {
  const { slug } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [blogData, setBlogData] = useState(null);

  // --- NEW STATE FOR LIKES ---
  const [viewsCount, setViewsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("You must be logged in to publish a blog.");
          return;
        }
        const blogRes = await axios.post(
          "http://localhost:5001/api/blog/blog-info",
          { slug },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
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
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error("Failed to toggle like", error);
      setIsLiked(!newIsLiked);
      setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
      alert("Something went wrong while liking the post.");
    } finally {
      setIsLiking(false);
    }
  };

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'heading':
        return <h2 key={index} className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-4">{block.text}</h2>;
      case 'paragraph':
        return <p key={index} className="text-lg text-gray-700 leading-relaxed mb-6">{block.text}</p>;
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-indigo-500 bg-indigo-50/50 p-6 my-8 rounded-r-xl">
            <p className="text-xl italic text-gray-800 font-medium">"{block.text}"</p>
          </blockquote>
        );
      case 'image':
        return (
          <figure key={index} className="my-10">
            <img src={block.text} alt={block.alt || 'Blog image'} className="w-full rounded-2xl shadow-md object-cover max-h-[500px]" />
            {block.caption && <figcaption className="text-center text-sm text-gray-500 mt-3">{block.caption}</figcaption>}
          </figure>
        );
      case 'code':
        return <CodeBlock key={index} code={block.text} />;
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Feed
          </Link>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-gray-900">NexusAI</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            {blogData.title}
          </h1>

          <div className="flex items-center gap-4 py-4 border-y border-gray-100">
            {blogData.author.avatar ? (
              <img
                src={blogData.author.avatar}
                alt={blogData.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {blogData.author.name[0]}
              </div>
            )}
            <div>
              <div className="font-bold text-gray-900 flex items-center gap-1">
                <User className="w-4 h-4 text-gray-400" /> {blogData.author.name}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(blogData.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className='text-sm text-gray-500 flex items-center gap-1 mt-0.5'>{viewsCount} views</div>
            </div>
          </div>
        </header>

        <article className="prose prose-lg max-w-none">
          {blogData.content.map((block, index) => renderContentBlock(block, index))}
        </article>

        <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeToggle}
              disabled={isLiking}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-sm ${isLiked
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
            >
              <Heart className={`w-6 h-6 transition-all ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default BlogPost;