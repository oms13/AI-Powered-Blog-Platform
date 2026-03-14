import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BrainCircuit, Sparkles, Users, Zap, ShieldCheck,
    ArrowRight, Github, Twitter, Heart, Globe, Code
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const heroTl = gsap.timeline();

        heroTl.fromTo('.hero-badge',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 })
            .fromTo('.hero-title',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.4")
            .fromTo('.hero-subtitle',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.6");

        gsap.to('.animate-blob-1', {
            y: "random(-20, 20)", x: "random(-20, 20)", rotation: "random(-10, 10)",
            duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
        gsap.to('.animate-blob-2', {
            y: "random(-30, 30)", x: "random(-30, 30)", rotation: "random(-15, 15)",
            duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1
        });

        // // 3. Mission Section Scroll Animation
        // gsap.fromTo('.mission-image', 
        //     { x: -40, opacity: 0 },
        //     {
        //         scrollTrigger: {
        //             trigger: '.mission-section',
        //             start: 'top 75%',
        //         },
        //         x: 0,
        //         opacity: 1,
        //         duration: 1,
        //         ease: 'power3.out'
        //     }
        // );

        // gsap.fromTo('.mission-content > *', 
        //     { y: 30, opacity: 0 },
        //     {
        //         scrollTrigger: {
        //             trigger: '.mission-section',
        //             start: 'top 75%',
        //         },
        //         y: 0,
        //         opacity: 1,
        //         duration: 0.8,
        //         stagger: 0.15,
        //         ease: 'power3.out'
        //     }
        // );

        // // 4. Pillars Section Scroll Animation
        // gsap.fromTo('.pillar-card', 
        //     { y: 50, opacity: 0 },
        //     {
        //         scrollTrigger: {
        //             trigger: '.pillars-section',
        //             start: 'top 80%',
        //         },
        //         y: 0,
        //         opacity: 1,
        //         duration: 0.8,
        //         stagger: 0.15,
        //         ease: 'power3.out'
        //     }
        // );

        // // 5. CTA Section Scroll Animation
        // gsap.fromTo('.cta-content', 
        //     { scale: 0.95, y: 30, opacity: 0 },
        //     {
        //         scrollTrigger: {
        //             trigger: '.cta-section',
        //             start: 'top 85%',
        //         },
        //         scale: 1,
        //         y: 0,
        //         opacity: 1,
        //         duration: 1,
        //         ease: 'power3.out'
        //     }
        // );

        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300 overflow-x-hidden">

            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-2 group">
                            <BrainCircuit className="h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                BlogSpire
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-10 text-sm font-medium">
                            <Link to="/#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Features</Link>
                            <Link to="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Social Feed</Link>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">About</span>
                        </nav>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <ThemeToggle />

                            {user ? (
                                <button onClick={() => navigate("/blog")} className="text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 sm:px-5 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                    Go to Feed
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => navigate("/login")} className="text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 sm:px-4 py-2 transition-colors">
                                        Sign In
                                    </button>
                                    <button onClick={() => navigate("/signup")} className="text-sm bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-4 sm:px-5 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                        Get Started
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                    <div className="animate-blob-1 absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-purple-300/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px]"></div>
                    <div className="animate-blob-2 absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
                    <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-sm mb-8 shadow-sm">
                        <Heart className="w-4 h-4 fill-current" /> Our Story
                    </div>
                    <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-8 text-gray-900 dark:text-white">
                        Empowering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 animate-gradient-x">Next Generation</span> of Voices.
                    </h1>
                    <p className="hero-subtitle text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
                        We believe that everyone has a unique perspective to share. BlogSpire was built to eliminate writer's block and make audience building effortless through the power of AI.
                    </p>
                </div>
            </section>

            <section className="mission-section py-20 bg-white dark:bg-gray-900 relative z-10 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="mission-image order-2 md:order-1 relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] opacity-20 dark:opacity-10 blur-lg"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                                alt="Team collaborating"
                                className="relative rounded-[2rem] shadow-2xl object-cover w-full h-[500px] border border-gray-100 dark:border-gray-800"
                            />
                        </div>
                        <div className="mission-content order-1 md:order-2 space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Breaking down the barriers to creativity.
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Traditional blogging platforms leave creators isolated, staring at blank pages, and struggling to find their audience.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                We created BlogSpire as a full-stack solution. By integrating cutting-edge AI directly into the editor and wrapping it in a highly engaging, real-time social feed, we are giving authors the ultimate toolkit to write smarter and connect deeper.
                            </p>

                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <h4 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">10x</h4>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faster Drafting</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">Real-Time</h4>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Community Engagement</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pillars-section py-24 relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
                            Our Platform Pillars
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            The core principles that guide every feature we build.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
                                title: "AI-Augmented",
                                desc: "AI shouldn't replace humans; it should empower them. Our AI tools act as your personal co-writer, helping you outline, draft, and refine your unique voice.",
                                color: "bg-indigo-50 dark:bg-indigo-900/30"
                            },
                            {
                                icon: <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
                                title: "Social First",
                                desc: "Publishing into the void is a thing of the past. Our integrated feed, live comments, and robust follow system ensure your work immediately reaches a community.",
                                color: "bg-purple-50 dark:bg-purple-900/30"
                            },
                            {
                                icon: <Code className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
                                title: "Modern Tech Stack",
                                desc: "Built on a lightning-fast MERN stack architecture with seamless integrations, providing a secure, scalable, and beautifully responsive experience.",
                                color: "bg-emerald-50 dark:bg-emerald-900/30"
                            }
                        ].map((pillar, idx) => (
                            <div key={idx} className="pillar-card bg-white dark:bg-gray-800 rounded-[2rem] p-10 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group hover:-translate-y-1">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${pillar.color}`}>
                                    {pillar.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{pillar.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-section py-24 bg-indigo-600 dark:bg-indigo-900 relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="cta-content relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                        Ready to share your story?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-10 font-light max-w-2xl mx-auto">
                        Join our growing community of modern creators, thinkers, and innovators today.
                    </p>
                    <button
                        onClick={() => navigate(user ? "/create-blog" : "/signup")}
                        className="bg-white text-indigo-600 hover:bg-gray-50 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto"
                    >
                        {user ? 'Start Writing' : 'Join BlogSpire Free'} <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0 border-b border-gray-100 dark:border-gray-800 pb-12">
                        <div className="flex flex-col items-center md:items-start">
                            <Link to="/" className="flex items-center gap-2 mb-4 group" >
                                <BrainCircuit className="h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
                                <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">BlogSpire</span>
                            </Link>
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center md:text-left max-w-xs">
                                The intelligent platform for modern writers, thinkers, and creators.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-10 md:gap-16 text-center sm:text-left">
                            <div className="flex flex-col gap-3">
                                <span className="font-bold text-gray-900 dark:text-white">Product</span>
                                <Link to="/#features" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
                                <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Pricing</span>
                                <Link to="/blog" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Feed</Link>
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="font-bold text-gray-900 dark:text-white">Legal</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Privacy Policy</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-gray-400 dark:text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} BlogSpire Inc. All rights reserved.
                        </div>
                        <div className="flex space-x-5">
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;