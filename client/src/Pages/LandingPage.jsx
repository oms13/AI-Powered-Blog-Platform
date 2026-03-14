import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    BrainCircuit, MessageSquareText, PenTool, Users,
    ShieldCheck, Zap, ArrowRight, Github, Twitter, Sparkles
} from 'lucide-react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

import ThemeToggle from '../components/ThemeToggle';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const heroTl = gsap.timeline();

        heroTl.fromTo('.hero-badge',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 })
            .fromTo('.hero-title',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.4")
            .fromTo('.hero-subtitle',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.6")
            .fromTo('.hero-buttons button',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.5)' }, "-=0.6")
            .fromTo('.hero-swiper',
                { x: 40, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.8");

        gsap.to('.blob-1', {
            y: "random(-20, 20)", x: "random(-20, 20)", rotation: "random(-10, 10)",
            duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
        gsap.to('.blob-2', {
            y: "random(-30, 30)", x: "random(-30, 30)", rotation: "random(-15, 15)",
            duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1
        });

        // --- 3. Features Scroll Animation (FIXED with fromTo) ---
        // gsap.fromTo('.feature-card', 
        //     { y: 50, opacity: 0 },
        //     {
        //         scrollTrigger: {
        //             trigger: '.features-section',
        //             start: 'top 80%', // Triggers slightly earlier
        //         },
        //         y: 0,
        //         opacity: 1,
        //         duration: 0.8,
        //         stagger: 0.1,
        //         ease: 'power3.out'
        //     }
        // );

        // --- 4. CTA Scroll Animation (FIXED with fromTo) ---
        // gsap.fromTo('.cta-content', 
        //     { scale: 0.95, y: 30, opacity: 0 },
        //     {
        //         scrollTrigger: {
        //             trigger: '.cta-section',
        //             start: 'top 80%',
        //         },
        //         scale: 1,
        //         y: 0,
        //         opacity: 1,
        //         duration: 1,
        //         ease: 'power3.out'
        //     }
        // );

        // --- 5. Force ScrollTrigger to recalculate after images load ---
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

    }, { scope: containerRef });

    const heroImages = [
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=1200",
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 overflow-x-hidden transition-colors duration-300">

            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <a href="#home" className="flex items-center gap-2 group">
                            <BrainCircuit className="h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                BlogSpire
                            </span>
                        </a>

                        <nav className="hidden md:flex items-center space-x-10 text-sm font-medium">
                            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Features</a>
                            <Link to="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Social Feed</Link>
                            <Link to="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">About</Link>
                        </nav>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <ThemeToggle />

                            <button onClick={() => navigate("/login")} className="text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 sm:px-4 py-2 transition-colors">
                                Sign In
                            </button>
                            <button onClick={() => navigate("/signup")} className="text-sm bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-4 sm:px-5 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <section id='home' className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden flex items-center min-h-[90vh]">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                    <div className="blob-1 absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-purple-300/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px]"></div>
                    <div className="blob-2 absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

                        <div className="flex-1 text-center lg:text-left pt-10 lg:pt-0">
                            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-sm mb-8 shadow-sm">
                                <Sparkles className="w-4 h-4" /> Introducing AI-Powered Drafting
                            </div>

                            <h1 className="hero-title text-5xl md:text-6xl lg:text-[5rem] font-extrabold tracking-tighter leading-[1.05] mb-6 text-gray-900 dark:text-white">
                                Write Smarter. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 animate-gradient-x">
                                    Connect Deeper.
                                </span>
                            </h1>

                            <p className="hero-subtitle mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
                                The next-generation social blogging platform. Generate brilliant drafts with AI, publish to a tailored social feed, and build your community in real-time.
                            </p>

                            <div className="hero-buttons flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <button onClick={() => navigate("/create-blog")} className="group bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-1">
                                    Start Writing Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => navigate("/blog")} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Explore the Feed
                                </button>
                            </div>
                        </div>

                        <div className="hero-swiper flex-1 w-full max-w-lg lg:max-w-none relative aspect-square lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 dark:border-gray-800/50 bg-gray-100 dark:bg-gray-800">
                            <Swiper
                                modules={[EffectFade, Autoplay]}
                                effect="fade"
                                autoplay={{ delay: 3500, disableOnInteraction: false }}
                                loop={true}
                                allowTouchMove={false}
                                className="w-full h-full"
                            >
                                {heroImages.map((src, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="w-full h-full relative">
                                            <div className="absolute inset-0 bg-black/10 z-10"></div>
                                            <img
                                                src={src}
                                                alt={`Blogging workspace inspiration ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                    </div>
                </div>
            </section>

            <section id="features" className="features-section py-32 bg-white dark:bg-gray-900 relative z-10 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                            Everything you need to <span className="text-indigo-600 dark:text-indigo-400">scale your voice.</span>
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-light">
                            We've combined the power of OpenAI with a seamless social experience to give you the ultimate creator toolkit.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <PenTool className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />, title: "AI-Assisted Creation", desc: "Hit writer's block? Use our integrated OpenAI editor to generate outlines, draft paragraphs, and refine your tone.", color: "bg-indigo-50 dark:bg-indigo-900/30" },
                            { icon: <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />, title: "Smart Social Feed", desc: "A custom algorithm prioritizes recency and engagement, ensuring your posts reach the right followers at the right time.", color: "bg-purple-50 dark:bg-purple-900/30" },
                            { icon: <MessageSquareText className="h-6 w-6 text-blue-600 dark:text-blue-400" />, title: "Real-Time Messaging", desc: "Connect instantly with fellow creators via Socket.io powered live chat, complete with online status and typing indicators.", color: "bg-blue-50 dark:bg-blue-900/30" },
                            { icon: <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />, title: "Secure & Protected", desc: "Enterprise-grade security using JWT access and refresh tokens keeps your account, drafts, and messages completely safe.", color: "bg-emerald-50 dark:bg-emerald-900/30" },
                            { icon: <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />, title: "Instant Notifications", desc: "Never miss a beat. Get real-time alerts for likes, comments, and new followers straight to your dashboard.", color: "bg-amber-50 dark:bg-amber-900/30" },
                            { icon: <BrainCircuit className="h-6 w-6 text-rose-600 dark:text-rose-400" />, title: "Smart Categorization", desc: "Organize your thoughts automatically. Our AI system suggests tags and categories based on your content context.", color: "bg-rose-50 dark:bg-rose-900/30" }
                        ].map((feature, idx) => (
                            <div key={idx} className="feature-card p-10 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 group">
                                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[15px]">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-section py-32 bg-gray-900 dark:bg-black relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full filter blur-[120px] translate-x-1/3 -translate-y-1/3"></div>

                <div className="cta-content relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-700 p-12 md:p-20 rounded-[3rem] shadow-2xl">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                        Ready to revolutionize your workflow?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                        Join thousands of creators who are already leveraging AI to build their audience faster than ever before.
                    </p>
                    <button onClick={() => navigate("/signup")} className="bg-white text-gray-900 hover:bg-gray-50 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto">
                        Create Your Free Account <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0 border-b border-gray-100 dark:border-gray-800 pb-12">
                        <div className="flex flex-col items-center md:items-start">
                            <a href="#home" className="flex items-center gap-2 mb-4 group" >
                                <BrainCircuit className="h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
                                <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">BlogSpire</span>
                            </a>
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center md:text-left max-w-xs">
                                The intelligent platform for modern writers, thinkers, and creators.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-10 md:gap-16 text-center sm:text-left">
                            <div className="flex flex-col gap-3">
                                <span className="font-bold text-gray-900 dark:text-white">Product</span>
                                <a href="#features" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
                                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
                                <Link to="/blog" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Feed</Link>
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="font-bold text-gray-900 dark:text-white">Legal</span>
                                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
                                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-gray-400 dark:text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} BlogSpire Inc. All rights reserved.
                        </div>
                        <div className="flex space-x-5">
                            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;