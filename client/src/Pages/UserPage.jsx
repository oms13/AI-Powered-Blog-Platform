import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BrainCircuit, FileText, PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';

const UserPage = ({ role }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(role);
  const [userInfo, setUserInfo] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userRes = await axios.post("http://localhost:5001/api/blog/user-profile",
          { username, role: userRole },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (userRes.data.success) {

          const user = userRes.data.user;
          const blogs = userRes.data.blogs;
          setUserInfo({
            name: user.name,
            bio: user.bio,
            profilePicture: user.profilePicture
          });
          setUserBlogs(blogs);
          await delay(1500);
        } else {
          alert(userRes.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [username]);

  const getExcerpt = (content) => {
    const paragraph = content.find(block => block.type === "paragraph");

    if (!paragraph) return "";

    return paragraph.content.split(" ").slice(0, 20).join(" ") + "...";
  };

  const handleCreateClick = () => {
    navigate('/create-blog');
  };

  if (!userInfo) {
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
    <div className="min-h-screen bg-gray-50 font-sans pb-12">

      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <BrainCircuit className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              NexusAI
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-10">

        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            A
                        </div> */}
            {userInfo.profilePicture ? (
              <img
                src={userInfo.profilePicture}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {userInfo.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userInfo.name}</h1>
              <span className="text-sm font-medium text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full mt-1 inline-block">
                {userRole} Account
              </span>
            </div>
          </div>

          {userRole === 'author' && (
            <button
              onClick={handleCreateClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Blog
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
            <FileText className="w-5 h-5 text-gray-500" /> Published Blogs
          </h2>

          {userBlogs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
              <p className="text-gray-500">No blogs published yet.</p>
            </div>
          ) : (
            userBlogs.map((blog) => (
              <article
                key={blog._id}
                onClick={()=>{navigate(`/blog/${blog.slug}`)}}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group overflow-hidden"
              >

                {blog.coverImage && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {getExcerpt(blog.content)}
                  </p>

                  <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>

                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>

                    <span>{blog.readTime} min read</span>
                  </div>
                </div>

              </article>
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default UserPage;