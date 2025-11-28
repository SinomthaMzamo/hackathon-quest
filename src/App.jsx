import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Target, Clock, Users, Code, Brain, Rocket, CheckCircle, Circle, Star, Award, TrendingUp, AlertTriangle } from 'lucide-react';

const HackathonQuestDashboard = () => {
  const [timeRemaining, setTimeRemaining] = useState(36 * 60 * 60); // 36 hours in seconds
  const [completedQuests, setCompletedQuests] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(true);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const toggleQuest = (questId) => {
    setCompletedQuests((prev) =>
      prev.includes(questId)
        ? prev.filter((id) => id !== questId)
        : [...prev, questId]
    );
  };

  const calculateProgress = () => {
    return Math.round((completedQuests.length / totalQuests) * 100);
  };

  const totalQuests = 24; // We'll define this based on all checkboxes
  const xpEarned = completedQuests.length * 42;

  // Team Stats
  const teamStats = [
    {
      label: "Time Remaining",
      value: formatTime(timeRemaining),
      icon: Clock,
      color: "from-red-500 to-orange-500",
    },
    {
      label: "Progress",
      value: `${calculateProgress()}%`,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "XP Earned",
      value: xpEarned,
      icon: Star,
      color: "from-yellow-500 to-amber-500",
    },
    {
      label: "Quests Done",
      value: `${completedQuests.length}/${totalQuests}`,
      icon: CheckCircle,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  // Quest Phases
  const questPhases = [
    {
      id: "phase1",
      name: "🎯 Phase 1: Foundation",
      hours: "0-8h",
      difficulty: "Medium",
      quests: [
        {
          id: "q1",
          text: "Core platform architecture designed",
          priority: "critical",
        },
        {
          id: "q2",
          text: "AI integration strategy finalized",
          priority: "critical",
        },
        { id: "q3", text: "Database schema created", priority: "high" },
        {
          id: "q4",
          text: "Authentication system implemented",
          priority: "high",
        },
        { id: "q5", text: "Basic UI framework set up", priority: "medium" },
      ],
    },
    {
      id: "phase2",
      name: "⚡ Phase 2: Core Features",
      hours: "8-24h",
      difficulty: "Hard",
      quests: [
        {
          id: "q6",
          text: "CV Builder with AI enhancement live",
          priority: "critical",
        },
        {
          id: "q7",
          text: "Job matching algorithm working",
          priority: "critical",
        },
        { id: "q8", text: "Skills marketplace functional", priority: "high" },
        { id: "q9", text: "Interview prep chatbot deployed", priority: "high" },
        {
          id: "q10",
          text: "Application tracking dashboard",
          priority: "medium",
        },
      ],
    },
    {
      id: "phase3",
      name: "🚀 Phase 3: Polish & Deploy",
      hours: "24-36h",
      difficulty: "Boss Fight",
      quests: [
        {
          id: "q11",
          text: "Mobile responsiveness perfected",
          priority: "critical",
        },
        { id: "q12", text: "Demo data populated", priority: "critical" },
        { id: "q13", text: "Pitch deck completed", priority: "critical" },
        {
          id: "q14",
          text: "GitHub repo cleaned & documented",
          priority: "high",
        },
        { id: "q15", text: "Video demo recorded", priority: "high" },
      ],
    },
  ];

  // Features Breakdown
  const features = [
    {
      name: "📝 CV Builder Pro",
      difficulty: "Medium",
      impact: "High",
      aiPower: 90,
      description:
        "AI-powered CV builder that tailors resumes to specific job descriptions",
      techStack: ["React", "OpenAI API", "PDF Generation"],
      status: "In Progress",
    },
    {
      name: "🎯 Smart Job Matching",
      difficulty: "Hard",
      impact: "Critical",
      aiPower: 95,
      description: "ML algorithm matching youth skills with opportunities",
      techStack: ["Python", "Scikit-learn", "RAG", "Vector DB"],
      status: "Planning",
    },
    {
      name: "💼 Skills Marketplace",
      difficulty: "Medium",
      impact: "High",
      aiPower: 70,
      description: "Platform connecting service providers with clients",
      techStack: ["Next.js", "Stripe", "WebSockets"],
      status: "Not Started",
    },
    {
      name: "🤖 Interview Coach AI",
      difficulty: "Hard",
      impact: "High",
      aiPower: 85,
      description: "AI chatbot for interview preparation and practice",
      techStack: ["LangChain", "Voice AI", "RAG"],
      status: "Planning",
    },
    {
      name: "📊 Application Tracker",
      difficulty: "Easy",
      impact: "Medium",
      aiPower: 40,
      description: "Dashboard to manage job applications",
      techStack: ["React", "Chart.js", "LocalStorage"],
      status: "Not Started",
    },
  ];

  // Team Roles
  const teamRoles = [
    {
      role: "🧙‍♂️ AI Sorcerer",
      skills: "LLM Integration, Prompt Engineering",
      power: 95,
    },
    {
      role: "⚔️ Frontend Paladin",
      skills: "React, UI/UX, Animations",
      power: 88,
    },
    { role: "🛡️ Backend Guardian", skills: "APIs, Database, Auth", power: 92 },
    { role: "🎨 Design Mage", skills: "Figma, User Flow, Branding", power: 85 },
    {
      role: "📢 Pitch Bard",
      skills: "Storytelling, Video, Presentation",
      power: 90,
    },
  ];

  // Judging Criteria Breakdown
  const judgingCriteria = [
    {
      category: "Innovation & Relevance",
      weight: 30,
      judge: "Panel",
      color: "bg-purple-500",
    },
    {
      category: "Technical Execution",
      weight: 25,
      judge: "Derek Gardiner",
      color: "bg-blue-500",
    },
    {
      category: "Business Viability",
      weight: 25,
      judge: "Ezra & Larreth",
      color: "bg-green-500",
    },
    {
      category: "Presentation",
      weight: 20,
      judge: "Matshepo Soto",
      color: "bg-orange-500",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Boss Fight":
        return "text-red-400";
      case "Hard":
        return "text-orange-400";
      case "Medium":
        return "text-yellow-400";
      default:
        return "text-green-400";
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } transition-colors duration-300`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Vibe Hackathon 2025
                </h1>
                <p className="text-sm text-gray-400">
                  AI-Accelerated Youth Empowerment Quest
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-400">Prize Pool</div>
                <div className="text-xl font-bold text-green-400">R10,000</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 relative">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {teamStats.map((stat, idx) => (
            <div key={idx} className="relative group">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
              ></div>
              <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-8 h-8 text-gray-400" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {["overview", "quests", "features", "team", "judging"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${
                selectedTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {selectedTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-purple-500/30">
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <Target className="w-8 h-8 mr-3 text-purple-400" />
                  Mission Briefing
                </h2>
                <p className="text-lg text-gray-300 mb-4">
                  Welcome to the ultimate 36-hour coding quest! Your mission:
                  Build an AI-powered platform that tackles youth unemployment
                  in South Africa.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-3 text-green-400">
                      💡 Problem Identified
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>
                        • Lack of consolidated platform for jobs/skills/clients
                      </li>
                      <li>• No support for job search preparation</li>
                      <li>• Skills gap and training access issues</li>
                      <li>• Youth unemployment crisis in SA</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-3 text-blue-400">
                      🎯 Our Solution
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• AI-powered job matching platform</li>
                      <li>• Smart CV builder & interview prep</li>
                      <li>• Skills marketplace connecting clients</li>
                      <li>• Application tracking dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30">
                <h3 className="text-xl font-bold mb-4 flex items-center text-yellow-400">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  Critical Success Factors
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="font-bold text-red-400 mb-2">
                      ⚠️ High Risk
                    </div>
                    <p className="text-sm text-gray-300">
                      Scope creep - stay focused on core AI features
                    </p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="font-bold text-orange-400 mb-2">
                      ⚡ Time Critical
                    </div>
                    <p className="text-sm text-gray-300">
                      Demo must work flawlessly - test early
                    </p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="font-bold text-green-400 mb-2">
                      ✅ Key Win
                    </div>
                    <p className="text-sm text-gray-300">
                      Show real AI value, not just a wrapper
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quests Tab */}
          {selectedTab === "quests" && (
            <div className="space-y-6 animate-fadeIn">
              {questPhases.map((phase) => (
                <div
                  key={phase.id}
                  className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">
                          {phase.name}
                        </h3>
                        <p className="text-gray-400">{phase.hours}</p>
                      </div>
                      <div
                        className={`text-xl font-bold ${getDifficultyColor(
                          phase.difficulty
                        )}`}
                      >
                        {phase.difficulty}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {phase.quests.map((quest) => (
                      <div
                        key={quest.id}
                        onClick={() => toggleQuest(quest.id)}
                        className="flex items-center space-x-4 p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-gray-600 cursor-pointer transition-all group"
                      >
                        {completedQuests.includes(quest.id) ? (
                          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-600 group-hover:text-gray-400 flex-shrink-0" />
                        )}
                        <span
                          className={`flex-grow ${
                            completedQuests.includes(quest.id)
                              ? "line-through text-gray-500"
                              : "text-gray-200"
                          }`}
                        >
                          {quest.text}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                            quest.priority
                          )}`}
                        >
                          {quest.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Features Tab */}
          {selectedTab === "features" && (
            <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-all group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {feature.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {feature.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          feature.status === "In Progress"
                            ? "bg-blue-500/20 text-blue-400"
                            : feature.status === "Planning"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {feature.status}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* AI Power Meter */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400 flex items-center">
                            <Brain className="w-4 h-4 mr-1" />
                            AI Power Level
                          </span>
                          <span className="text-sm font-bold text-purple-400">
                            {feature.aiPower}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                            style={{ width: `${feature.aiPower}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Difficulty & Impact */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                          <div className="text-xs text-gray-400 mb-1">
                            Difficulty
                          </div>
                          <div
                            className={`font-bold ${getDifficultyColor(
                              feature.difficulty
                            )}`}
                          >
                            {feature.difficulty}
                          </div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                          <div className="text-xs text-gray-400 mb-1">
                            Impact
                          </div>
                          <div
                            className={`font-bold ${
                              feature.impact === "Critical"
                                ? "text-red-400"
                                : feature.impact === "High"
                                ? "text-orange-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {feature.impact}
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <div className="text-xs text-gray-400 mb-2">
                          Tech Stack
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {feature.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Team Tab */}
          {selectedTab === "team" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/30">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Users className="w-8 h-8 mr-3 text-indigo-400" />
                  Your Quest Party
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamRoles.map((member, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all group"
                    >
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">
                          {member.role.split(" ")[0]}
                        </div>
                        <h3 className="text-xl font-bold text-indigo-400">
                          {member.role.split(" ").slice(1).join(" ")}
                        </h3>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-2">Skills</div>
                        <p className="text-sm text-gray-300">{member.skills}</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">
                            Power Level
                          </span>
                          <span className="text-sm font-bold text-yellow-400">
                            {member.power}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                            style={{ width: `${member.power}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategy Tips */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center text-cyan-400">
                  <Zap className="w-6 h-6 mr-2" />
                  Pro Strategies
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30">
                    <div className="font-bold text-cyan-400 mb-2">
                      ⚡ Parallel Development
                    </div>
                    <p className="text-sm text-gray-300">
                      Split into sub-teams: AI integration, frontend, backend.
                      Sync every 4 hours.
                    </p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30">
                    <div className="font-bold text-cyan-400 mb-2">
                      🎯 MVP First
                    </div>
                    <p className="text-sm text-gray-300">
                      Get one feature fully working before expanding. Demo {">"} Features.
                    </p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30">
                    <div className="font-bold text-cyan-400 mb-2">
                      🤖 AI Integration
                    </div>
                    <p className="text-sm text-gray-300">
                      Use OpenAI/Gemini APIs. Don't build from scratch. Prompt
                      engineering is key.
                    </p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/30">
                    <div className="font-bold text-cyan-400 mb-2">
                      📹 Document Everything
                    </div>
                    <p className="text-sm text-gray-300">
                      Screen record demos. Take screenshots. You need content
                      for the pitch!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Judging Tab */}
          {selectedTab === "judging" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-8 border border-orange-500/30">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                  <Award className="w-8 h-8 mr-3 text-orange-400" />
                  How to Win: Judging Breakdown
                </h2>

                <div className="space-y-4 mb-8">
                  {judgingCriteria.map((criteria, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold">
                            {criteria.category}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Judge: {criteria.judge}
                          </p>
                        </div>
                        <div className="text-3xl font-bold text-white">
                          {criteria.weight}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${criteria.color}`}
                          style={{ width: `${criteria.weight}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Strategy for Each Criteria */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                    <h4 className="font-bold text-purple-400 mb-3 text-lg">
                      🎨 Innovation & Relevance (30%)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ Show real AI magic, not just API calls</li>
                      <li>✓ Address actual youth unemployment pain points</li>
                      <li>
                        ✓ Demonstrate unique approach vs existing solutions
                      </li>
                      <li>
                        ✓ Use South African context (languages, data costs)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                    <h4 className="font-bold text-blue-400 mb-3 text-lg">
                      ⚙️ Technical Execution (25%)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ Clean, documented code on GitHub</li>
                      <li>✓ Scalable architecture (even if basic)</li>
                      <li>✓ Demo must work without crashes</li>
                      <li>✓ Show technical depth in AI integration</li>
                    </ul>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                    <h4 className="font-bold text-green-400 mb-3 text-lg">
                      💰 Business Viability (25%)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ Clear revenue model (freemium, subscriptions)</li>
                      <li>✓ Define target market size</li>
                      <li>✓ Show path to sustainability</li>
                      <li>✓ Address go-to-market strategy</li>
                    </ul>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
                    <h4 className="font-bold text-orange-400 mb-3 text-lg">
                      🎤 Presentation (20%)
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>✓ Tell a story: problem → solution → impact</li>
                      <li>✓ Show live demo with real data</li>
                      <li>✓ Professional deck (not too wordy)</li>
                      <li>✓ Passion and energy in delivery</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submission Checklist */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-red-500/30">
                <h3 className="text-xl font-bold mb-4 flex items-center text-red-400">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Final Submission Checklist
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Project name & one-line pitch submitted",
                    "GitHub repo is public with README",
                    "5-minute pitch deck (PDF) ready",
                    "Live demo video recorded on YouTube",
                    "All code pushed and documented",
                    "Demo data populated",
                    "Team members confirmed",
                    "Submission before 5:00 PM Saturday",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-600 text-red-500 focus:ring-red-500"
                      />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/75 transition-all hover:scale-110"
          >
            <Code className="w-6 h-6 text-white" />
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-full shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/75 transition-all hover:scale-110"
          >
            <Rocket className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-400 mb-2">
              Built for{" "}
              <span className="text-purple-400 font-bold">
                Melsoft Vibe Hackathon 2025
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Let's build the future of youth empowerment in South Africa 🇿🇦
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Powered by AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">R10,000 Prize</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-400">36 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HackathonQuestDashboard;