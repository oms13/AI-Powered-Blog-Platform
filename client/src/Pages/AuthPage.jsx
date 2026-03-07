import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';
import axios from 'axios';

const AuthPage = ({ mode }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(mode);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: ''
    })

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(isLogin ? "Processing Login..." : "Processing Registration...");

        const payload = { ...formData };
        try {
            const postPath = isLogin ? 'http://localhost:5001/api/auth/login' : 'http://localhost:5001/api/auth/signup';
            const authRes = await axios.post(postPath, payload);
            if (authRes.data.success) {
                alert(authRes.data.message);
                localStorage.setItem('accessToken', authRes.data.token);
                navigate(`/${authRes.data.user.role}/${authRes.data.user.username}`);
            }
        } catch (error) {
            alert("Authorization Error");
            console.error(error);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">

            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-white/50">

                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <BrainCircuit className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="text-gray-500 mt-2 text-center">
                        {isLogin
                            ? 'Enter your credentials to access your NexusAI dashboard.'
                            : 'Join the next-generation AI blogging platform today.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {!isLogin && (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name='name'
                                required
                                placeholder="Full Name"
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="Username"
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                        />
                    </div>

                    {!isLogin && (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name='email'
                                required
                                placeholder="Email address"
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                        />
                    </div>

                    {!isLogin && (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Shield className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                required
                                name='role'
                                defaultValue=""
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-gray-900 appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select your role...</option>
                                <option value="reader">Reader (Browse & Interact)</option>
                                <option value="author">Author (Create AI Blogs)</option>
                            </select>
                        </div>
                    )}

                    {isLogin && (
                        <div className="flex justify-end">
                            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </a>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        {isLogin ? 'Sign up free' : 'Log in here'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;