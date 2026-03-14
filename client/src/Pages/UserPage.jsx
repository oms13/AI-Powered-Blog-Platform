import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BrainCircuit, FileText, PlusCircle, ArrowLeft,
  Settings, LogOut, User as UserIcon, Mail, UserPlus, Check
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserPage = ({ role }) => {
  const { user, logout } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();

  const [isUser, setIsUser] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isClickFollow, setIsClickFollow] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      setUserInfo(null); 
      
      try {
        const userRes = await axios.post("http://localhost:5001/api/blog/user-profile",
          { username, currentUserID: user._id, role: role }
        );
        
        await delay(1000);
        if (userRes.data.success) {
          const reqUser = userRes.data.user;
          const blogs = userRes.data.blogs;
          
          setUserInfo({
            name: reqUser.name,
            bio: reqUser.bio || "This writer hasn't added a bio yet.",
            profilePicture: reqUser.profilePicture,
            coverPicture: reqUser.coverPicture,
          });
          
          setFollowersCount(reqUser.followers.length);
          setFollowingCount(reqUser.following.length);
          setIsFollowing(reqUser.isFollowed);
          setUserBlogs(blogs);
          
          setIsUser(username === user.username);
          
        } else {
          alert(userRes.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchData();
  }, [username, user._id, user.username, role]); 

  const getExcerpt = (content) => {
    if (!Array.isArray(content)) return "";
    const paragraph = content.find(block => block.type === "paragraph");
    if (!paragraph) return "";
    return paragraph.content.split(" ").slice(0, 25).join(" ") + "...";
  };

  const handleCreateClick = () => {
    navigate('/create-blog');
  };

  const handleFollowToggle = async () => {
    if (isClickFollow) return;
    setIsClickFollow(true);

    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    setFollowersCount(prev => newIsFollowing ? prev + 1 : prev - 1);

    try {
      const res = await axios.post("http://localhost:5001/api/blog/toggle-follow",
        { profileUser: username, currentUserID: user._id }
      );
      if (res.data.success) {
        console.log("Done");
      }
    } catch (error) {
      console.error("Failed to toggle Follow", error);
      setIsFollowing(!newIsFollowing);
      setFollowersCount(prev => !newIsFollowing ? prev + 1 : prev - 1);
      alert("Something went wrong while Following the post.");
    } finally {
      setIsClickFollow(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse">
          <div className="h-32 bg-gray-100 rounded-2xl mb-12"></div>
          <div className="flex gap-6 items-end -mt-20 px-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white"></div>
            <div className="flex-1 space-y-3 pb-2">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-100 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">

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
                  onClick={() => { setIsDropdownOpen(false) }}
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">

        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-6 bg-white border border-gray-200 hover:border-indigo-200 shadow-sm px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12 relative">
          <div className="h-32 sm:h-48  w-full bg-gradient-to-r from-indigo-100 via-purple-50 to-indigo-50 relative overflow-hidden">
            {userInfo.coverPicture ? (
              <img
                src={userInfo.coverPicture}
                alt="Cover Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
            )}
          </div>

          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">

              <div className="flex items-end gap-5">
                {userInfo.profilePicture ? (
                  <img
                    src={userInfo.profilePicture}
                    alt="Profile"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-900 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md">
                    {userInfo.name[0]}
                  </div>
                )}

                <div className="pb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{userInfo.name}</h1>
                  <p className="text-gray-500 font-medium">@{username}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pb-2">
                {isUser ? (
                  <>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-5 rounded-full transition-all shadow-sm">
                      <Settings className="w-4 h-4" /> Edit Profile
                    </button>
                    {user.role === 'author' && (
                      <button
                        onClick={handleCreateClick}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-full transition-all shadow-sm"
                      >
                        <PlusCircle className="w-4 h-4" /> Write
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-full transition-all shadow-sm">
                      <Mail className="w-4 h-4" /> Message
                    </button>
                    {isFollowing ? (
                      <button
                        onClick={handleFollowToggle}
                        disabled={isClickFollow}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-800 font-semibold py-2 px-6 rounded-full transition-all shadow-sm group">
                        <Check className="w-4 h-4 group-hover:hidden" />
                        <span className="group-hover:hidden">Following</span>
                        <span className="hidden group-hover:block">Unfollow</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleFollowToggle}
                        disabled={isClickFollow}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold py-2 px-6 rounded-full transition-all shadow-sm">
                        <UserPlus className="w-4 h-4" /> Follow
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-100 pt-6">
              <p className="text-gray-600 max-w-xl text-[15px] leading-relaxed">
                {userInfo.bio}
              </p>

              <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 shrink-0">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-gray-900">{followersCount}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Followers</span>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-gray-900">{followingCount}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              {isUser ? "Your Publications" : `Articles by ${userInfo.name}`}
            </h2>
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {userBlogs.length} Posts
            </span>
          </div>

          {userBlogs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No articles yet</h3>
              <p className="text-gray-500">
                {isUser ? "You haven't published any blogs. Start writing today!" : "This user hasn't published anything yet."}
              </p>
              {isUser && user.role === 'author' && (
                <button onClick={handleCreateClick} className="mt-6 font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-6 py-2 rounded-full transition-colors">
                  Start your first post
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {userBlogs.map((blog) => (
                <article
                  key={blog._id}
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col sm:flex-row overflow-hidden"
                >
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between order-2 sm:order-1">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-[15px] leading-relaxed mb-6 font-serif line-clamp-2">
                        {getExcerpt(blog.content)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{blog.readTime || '5'} min read</span>
                    </div>
                  </div>

                  {blog.coverImage && (
                    <div className="w-full sm:w-64 h-48 sm:h-auto overflow-hidden order-1 sm:order-2 shrink-0 border-b sm:border-b-0 sm:border-l border-gray-100">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default UserPage;