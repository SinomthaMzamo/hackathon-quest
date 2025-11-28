# VoiceCoach AI - Interview & Workplace Readiness Platform

AI-powered interview coach and workplace readiness training platform designed specifically for South African youth to tackle youth unemployment.

## 🎯 Features

### 1. AI Voice Interview Coach
- Real-time voice interview practice with AI analysis
- Multi-modal analysis: content, tone, pace, filler words
- SA-specific feedback and cultural coaching
- Industry-specific interview scenarios
- CV and cover letter generation based on performance
- Job matching after practice

### 2. Workplace Readiness Academy
- Gamified professional skills training
- SA-specific workplace scenarios
- Modules covering:
  - Dress Code & Appearance
  - Communication Etiquette
  - Workplace Topics & Boundaries
  - Digital Communication
  - Office Politics & Conflict Resolution
- Progress tracking with badges and certificates

### 3. Progress Dashboard
- XP and leveling system
- Badge achievements
- Shareable certificates
- Detailed analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (for AI features)

### Installation

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**
```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

3. **Start development servers:**
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

### Manual Start (if needed)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
voicecoach-ai/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── backend/           # Node.js/Express backend
│   ├── server.js
│   └── package.json
└── package.json       # Root package.json
```

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router
- Vite
- Lucide React (icons)
- PWA support

### Backend
- Node.js
- Express
- OpenAI API (GPT-4)
- Web Speech API (browser-based)

## 🎨 Key Features Implementation

### Voice Interview
- Uses browser Web Speech API for transcription
- Real-time filler word detection
- Audio recording with MediaRecorder API
- AI-powered analysis with OpenAI GPT-4

### Workplace Quizzes
- Scenario-based multiple choice questions
- Immediate feedback with explanations
- SA-specific content and cultural context
- Gamification with levels and badges

### AI Analysis
- Multi-dimensional scoring (content, relevance, clarity, cultural fit)
- Personalized feedback
- CV/cover letter suggestions
- Job matching recommendations

## 📱 Mobile & PWA

- Fully responsive design
- Progressive Web App (PWA) support
- Works offline (with service worker)
- Mobile-first approach

## 🔧 Environment Variables

Create `backend/.env`:
```
OPENAI_API_KEY=your-api-key-here
PORT=3001
NODE_ENV=development
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables
npm start
```

## 📝 Hackathon Submission

### Deliverables Checklist:
- ✅ Working prototype
- ✅ GitHub repository (public)
- ✅ 5-minute pitch deck (create separately)
- ✅ YouTube presentation (record separately)

### Key Differentiators:
1. **SA-Specific Context**: All content tailored for South African job market
2. **Multi-Modal AI**: Beyond basic chatbots - analyzes voice, tone, content
3. **Workplace Readiness**: Unique focus on professionalism gaps
4. **Gamification**: Makes learning engaging and shareable
5. **Complete Solution**: Interview practice → Skills training → Job matching

## 🎯 Judging Criteria Alignment

- **Innovation & Relevance (30%)**: Directly addresses youth unemployment with unique AI approach
- **Technical Execution (25%)**: Multi-modal AI, voice processing, scalable architecture
- **Business Viability (25%)**: Clear product-market fit, monetization potential
- **Presentation (20%)**: Professional UI/UX, clear value proposition

## 🤝 Contributing

This is a hackathon project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - Hackathon Project

## 🙏 Acknowledgments

Built for The Vibe Coding Hackathon 2025
Theme: AI-Accelerated Solutions for Youth Economic Empowerment in South Africa
