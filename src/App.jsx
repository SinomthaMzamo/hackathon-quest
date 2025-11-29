import React, { useState, useEffect } from "react";
import {
  Mic,
  Briefcase,
  Award,
  Users,
  Zap,
  CheckCircle,
  Globe,
  Smartphone,
  TrendingUp,
  Code,
  Brain,
  Target,
  Github,
  Youtube,
  FileText,
  ChevronRight,
  Star,
  BarChart2,
} from "lucide-react";

export default function VukaPresentation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: "Youth Unemployment in SA", value: "46.6%", icon: Users },
    { label: "AI-Powered Feedback", value: "Real-time", icon: Zap },
    { label: "Practice Sessions", value: "Unlimited", icon: Target },
    { label: "Mobile-First Design", value: "100%", icon: Smartphone },
  ];

  const features = [
    {
      icon: Mic,
      title: "AI Voice Interview",
      description:
        "Practice with realistic voice-based interviews powered by Google Text-to-Speech and Speech Recognition",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Brain,
      title: "Smart Feedback",
      description:
        "Get instant AI analysis on content, delivery, and professionalism using Google Gemini 2.5 Flash",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Star,
      title: "STAR Method Prep",
      description:
        "AI-generated personalized STAR stories based on your CV to ace behavioral questions",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart2,
      title: "Performance Reports",
      description:
        "Detailed analytics on clarity, relevance, and confidence with actionable insights",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Target,
      title: "Job-Specific Questions",
      description:
        "Questions tailored to your CV and the specific job description you're applying for",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description:
        "Data-efficient, works on low-end devices, designed for the South African context",
      color: "from-indigo-500 to-violet-500",
    },
  ];

  const techStack = [
    {
      name: "Google Gemini 2.5 Flash",
      use: "LLM for question generation & feedback",
    },
    { name: "Groq Whisper", use: "Fast speech-to-text transcription" },
    { name: "Google Cloud TTS", use: "Natural South African voice synthesis" },
    { name: "FastAPI + Python", use: "High-performance backend" },
    { name: "React + Vite", use: "Modern, responsive frontend" },
    { name: "Tailwind CSS", use: "Mobile-first UI design" },
  ];

  const impact = [
    {
      metric: "Accessibility",
      value: "Free mentorship for all",
      description: "No cost barrier to interview preparation",
    },
    {
      metric: "Scale",
      value: "Unlimited practice",
      description: "Practice anytime, anywhere, as many times as needed",
    },
    {
      metric: "Personalization",
      value: "100% tailored",
      description: "Every question matched to your CV and target job",
    },
    {
      metric: "Data Efficiency",
      value: "<5MB per session",
      description: "Optimized for South African mobile data costs",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Vuka Coach
            </span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm">
            <a
              href="#problem"
              className="text-slate-300 hover:text-yellow-400 transition"
            >
              Problem
            </a>
            <a
              href="#solution"
              className="text-slate-300 hover:text-yellow-400 transition"
            >
              Solution
            </a>
            <a
              href="#features"
              className="text-slate-300 hover:text-yellow-400 transition"
            >
              Features
            </a>
            <a
              href="#tech"
              className="text-slate-300 hover:text-yellow-400 transition"
            >
              Technology
            </a>
            <a
              href="#impact"
              className="text-slate-300 hover:text-yellow-400 transition"
            >
              Impact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
            <span className="text-yellow-400 text-sm font-bold">
              The Vibe Coding Hackathon 2025 • Skill-Building & Education
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Vuka Coach
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
            Your Personal AI Interview Mentor
          </p>

          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Empowering South African youth with AI-driven, real-time interview
            coaching to bridge the skills gap and unlock job opportunities
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="#features"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20 flex items-center justify-center"
            >
              Explore Features <ChevronRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="#tech"
              className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition border border-slate-700 flex items-center justify-center"
            >
              View Technology
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-yellow-500/50 transition"
              >
                <stat.icon className="w-8 h-8 text-yellow-500 mb-3 mx-auto" />
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Problem</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              South Africa's youth face a crisis of opportunity, not capability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-950 border border-red-900/30 rounded-2xl p-8">
              <div className="w-12 h-12 bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-red-400">
                46.6% Unemployment
              </h3>
              <p className="text-slate-400">
                Nearly half of South African youth are unemployed, one of the
                highest rates globally
              </p>
            </div>

            <div className="bg-slate-950 border border-orange-900/30 rounded-2xl p-8">
              <div className="w-12 h-12 bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-orange-400">
                Access Gap
              </h3>
              <p className="text-slate-400">
                Many talented youth lack access to interview coaching and
                mentorship
              </p>
            </div>

            <div className="bg-slate-950 border border-yellow-900/30 rounded-2xl p-8">
              <div className="w-12 h-12 bg-yellow-900/20 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                Skills Mismatch
              </h3>
              <p className="text-slate-400">
                Job seekers struggle to present their skills effectively in
                interviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Solution
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              AI-powered interview coaching that's accessible, personalized, and
              effective
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-7 h-7 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Upload CV & Job Description
                  </h3>
                  <p className="text-slate-400">
                    Users provide their CV and target job description to
                    personalize the experience
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-7 h-7 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    AI Generates Custom Questions
                  </h3>
                  <p className="text-slate-400">
                    Gemini 2.5 Flash creates tailored interview questions and
                    STAR stories
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Real-Time Voice Coaching
                  </h3>
                  <p className="text-slate-400">
                    Practice with voice AI that listens, transcribes, and
                    provides instant feedback
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Comprehensive Performance Report
                  </h3>
                  <p className="text-slate-400">
                    Detailed analytics with strengths, weaknesses, and
                    improvement tips
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Every feature designed to maximize job readiness for South African
              youth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition group"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tech" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Powered Technology
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Built with cutting-edge AI and optimized for the South African
              context
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex items-start space-x-3">
                  <Code className="w-5 h-5 text-yellow-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">{tech.name}</h4>
                    <p className="text-sm text-slate-400">{tech.use}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8">
            <div className="flex items-start space-x-4">
              <Smartphone className="w-12 h-12 text-yellow-500 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">
                  South African Context
                </h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />{" "}
                    Mobile-first responsive design
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />{" "}
                    Data-efficient (audio compression, minimal API calls)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />{" "}
                    Works on low-end devices
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />{" "}
                    Optimized for South African internet speeds
                  </li>
                  {/* <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />{" "}
                    Natural South African English TTS voice
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Business Viability & Impact
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Scalable solution with clear path to sustainability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {impact.map((item, i) => (
              <div
                key={i}
                className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  {item.value}
                </div>
                <div className="text-sm font-bold text-slate-300 mb-2">
                  {item.metric}
                </div>
                <div className="text-xs text-slate-400">{item.description}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-950 border border-green-900/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-green-400">
                Revenue Model
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>
                    <strong>Freemium:</strong> 3 free practice sessions, premium
                    unlimited
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>
                    <strong>B2B:</strong> Universities, recruitment agencies,
                    corporates
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>
                    <strong>Government:</strong> SETA partnerships for skills
                    development
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>
                    <strong>Subscription:</strong> R49/month for individuals
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-blue-900/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">
                Market Opportunity
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>10M+ unemployed youth in South Africa</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Expand to broader African market (200M+ youth)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    Low customer acquisition cost via social/community
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>High retention through continuous learning</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Empowering Youth, One Interview at a Time
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Vuka Coach democratizes access to high-quality interview
            preparation, helping South African youth unlock their potential
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="https://github.com/yourusername/vuka-coach"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition border border-slate-700 flex items-center justify-center"
            >
              <Github className="mr-2 w-5 h-5" /> View on GitHub
            </a>
            <a
              href="#"
              className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition border border-slate-700 flex items-center justify-center"
            >
              <FileText className="mr-2 w-5 h-5" /> Download Pitch Deck
            </a>
            <a
              href="#impact"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20 flex items-center justify-center"
            >
              See Business Model
            </a>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Award className="w-8 h-8 text-yellow-500" />
              <h3 className="text-2xl font-bold">
                The Vibe Coding Hackathon 2025
              </h3>
            </div>
            <p className="text-slate-400 mb-4">
              Built in 36 hours to tackle youth unemployment through AI-powered
              skills development
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold border border-yellow-500/30">
                Innovation & Relevance
              </span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold border border-blue-500/30">
                Technical Excellence
              </span>
              <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold border border-green-500/30">
                Business Viability
              </span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold border border-purple-500/30">
                South African Context
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Vuka Coach
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            Wake up. Rise up. Succeed. 🇿🇦
          </p>
          <p className="text-slate-600 text-xs mt-4">
            © 2025 Vuka Coach • Melsoft Academy • The Vibe Coding Hackathon •
            Thuma Thina: Sinomtha Mzamo • Manqoba Young • Summer Ngcobo
          </p>
        </div>
      </footer>
    </div>
  );
}
