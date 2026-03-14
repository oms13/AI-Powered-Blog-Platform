import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    BrainCircuit, Mail, Lock, User, Shield, 
    ArrowRight, ArrowLeft, Loader2, Eye, EyeOff, AlertCircle 
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const AuthPage = ({ mode }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [isLogin, setIsLogin] = useState(mode);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(''); 
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const payload = { ...formData };
        
        try {
            const postPath = isLogin 
                ? 'http://localhost:5001/api/auth/login' 
                : 'http://localhost:5001/api/auth/signup';
                
            const authRes = await axios.post(postPath, payload);
            
            if (authRes.data.success) {
                login(authRes.data.token, authRes.data.user);
                navigate(`/${authRes.data.user.role}/${authRes.data.user.username}`);
            } else {
                setError(authRes.data.message || 'Authentication failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message || 
                "We couldn't connect to the server. Please check your connection and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">

            {/* Top Navigation Bar for Auth Page */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 max-w-7xl mx-auto right-0">
                <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                </Link>
                <ThemeToggle />
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] opacity-50 transition-colors duration-300"></div>
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-purple-200/50 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-blob transition-colors duration-300"></div>
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/50 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-blob animation-delay-2000 transition-colors duration-300"></div>

            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-full max-w-[440px] p-8 sm:p-10 relative z-10 border border-white dark:border-gray-800 transition-colors duration-300">

                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-indigo-100/50 dark:border-indigo-800/50 transition-colors">
                        <BrainCircuit className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-[15px] leading-relaxed">
                        {isLogin
                            ? 'Enter your credentials to access your dashboard.'
                            : 'Join the next-generation AI blogging platform today.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-red-800 dark:text-red-400 leading-tight">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {!isLogin && (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium disabled:opacity-60"
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium disabled:opacity-60"
                        />
                    </div>

                    {!isLogin && (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium disabled:opacity-60"
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium disabled:opacity-60"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none disabled:opacity-60"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {!isLogin && (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <select
                                required
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white appearance-none cursor-pointer font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <option value="" disabled className="dark:bg-gray-900">Select your role...</option>
                                <option value="reader" className="dark:bg-gray-900">Reader (Browse & Interact)</option>
                                <option value="author" className="dark:bg-gray-900">Author (Create AI Blogs)</option>
                            </select>
                        </div>
                    )}

                    {isLogin && (
                        <div className="flex justify-end pt-1">
                            <button type="button" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-[15px] text-gray-600 dark:text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={toggleMode}
                        disabled={isLoading}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors disabled:opacity-60"
                    >
                        {isLogin ? 'Sign up for free' : 'Log in here'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;