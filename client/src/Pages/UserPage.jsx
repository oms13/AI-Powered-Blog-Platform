import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BrainCircuit, FileText, PlusCircle } from 'lucide-react';
import { useEffect } from 'react';

const UserPage = ({ role }) => {
    const username = useParams();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(role);

    useEffect(() => {
        const fetchData = async() =>{
            
        }

    },[username])


    const userBlogs = [
        {
            id: 1,
            title: "The Future of React Server Components",
            excerpt: "Understanding how server-side rendering is evolving in the modern web ecosystem and what it means for frontend architecture...",
            date: "Oct 24, 2026",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "Why Tailwind CSS Speeds Up Development",
            excerpt: "A deep dive into utility-first CSS, removing the need for context switching, and how it transforms component-based design...",
            date: "Oct 20, 2026",
            readTime: "4 min read"
        }
    ];

    const handleCreateClick = () => {
        navigate('/create-blog');
    };

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
                        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            A
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Alex Developer</h1>
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
                            <article key={blog.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                                    <span>{blog.date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{blog.readTime}</span>
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