import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, MessageSquareText, PenTool, Users, ShieldCheck, Zap, ArrowRight, Github, Twitter } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <a href="#home" className="flex items-center gap-2 cursor-pointer">

                                <BrainCircuit className="h-8 w-8 text-indigo-600" />
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                    NexusAI
                                </span>
                            </a>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
                            <a href="#feed" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Social Feed</a>
                            <a href="#about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</a>

                        </nav>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigate("/login")} className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2">
                                Log in
                            </button>
                            <button onClick={() => navigate("/signup")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg">
                                Sign up free
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <section id='home' className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-90"></div>
                    {/* Decorative background blob */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute top-48 -left-24 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Write Smarter. <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Connect Deeper.
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        The next-generation social blogging platform. Generate brilliant drafts with AI, publish to a tailored social feed, and build your community in real-time.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => navigate("/login")} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                            Start Writing Now <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="bg-white border border-gray-300 hover:border-indigo-600 text-gray-700 hover:text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-sm">
                            Explore the Feed
                        </button>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to scale your voice</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            We've combined the power of OpenAI with a seamless social experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow bg-gray-50/50 group">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <PenTool className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Assisted Creation</h3>
                            <p className="text-gray-600">Hit writer's block? Use our integrated OpenAI editor to generate outlines, draft paragraphs, and refine your tone.</p>
                        </div>

                        <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow bg-gray-50/50 group">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Social Feed</h3>
                            <p className="text-gray-600">A custom algorithm prioritizes recency and engagement, ensuring your posts reach the right followers at the right time.</p>
                        </div>

                        <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow bg-gray-50/50 group">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageSquareText className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Messaging</h3>
                            <p className="text-gray-600">Connect instantly with fellow creators via Socket.io powered live chat, complete with online status and typing indicators.</p>
                        </div>

                        <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow bg-gray-50/50 group">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Protected</h3>
                            <p className="text-gray-600">Enterprise-grade security using JWT access and refresh tokens keeps your account, drafts, and messages completely safe.</p>
                        </div>

                        <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow bg-gray-50/50 group">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Notifications</h3>
                            <p className="text-gray-600">Never miss a beat. Get real-time alerts for likes, comments, and new followers straight to your dashboard.</p>
                        </div>

                        <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow bg-gray-50/50 group">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BrainCircuit className="h-6 w-6 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Categorization</h3>
                            <p className="text-gray-600">Organize your thoughts with tags and categories. Our system automatically suggests tags based on your AI-generated content.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-900 py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
                        Ready to revolutionize your writing process?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of creators who are already leveraging AI to build their audience faster than ever before.
                    </p>
                    <button onClick={() => navigate("/signup")} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1">
                        Create Your Free Account
                    </button>
                </div>
            </section>

            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <a href="#home" className="flex items-center gap-2 mb-4 md:mb-0" >
                                <BrainCircuit className="h-6 w-6 text-indigo-600" />
                                <span className="text-lg font-bold text-gray-900">NexusAI</span>

                            </a>
                        </div>
                        <div className="flex space-x-6 mb-4 md:mb-0">
                            <a href="#" className="text-gray-400 hover:text-gray-900">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-gray-900">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-gray-900">Contact</a>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-gray-900">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-900">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} NexusAI Blogging Platform. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;