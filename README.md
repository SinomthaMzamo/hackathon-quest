# 🎤 Vuka Coach

> **Your Personal AI Interview Mentor**

Empowering South African youth with AI-driven, real-time interview coaching to bridge the skills gap and unlock job opportunities.

[![The Vibe Coding Hackathon 2025](https://img.shields.io/badge/Hackathon-Vibe%202025-yellow?style=for-the-badge)](https://melsoft.academy)
[![Built in 36 Hours](https://img.shields.io/badge/Built%20in-36%20Hours-orange?style=for-the-badge)](https://github.com/yourusername/vuka-coach)
[![AI Powered](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)](https://github.com/yourusername/vuka-coach)

---

## 🎯 The Problem

South Africa faces one of the **highest youth unemployment rates** in the world at **46.6%**. Millions of talented, ambitious young people are locked out of the economy due to:

- 🚫 **Lack of access** to quality interview coaching
- 💰 **High cost** of professional mentorship
- 📚 **Skills gap** in presenting experience effectively
- 🌍 **Geographic barriers** to career services

## 💡 Our Solution

**Vuka Coach** (Vuka means "wake up/arise" in isiZulu/isiXhosa) is an AI-powered interview coaching platform that provides:

✅ **Personalized Interview Questions** - Tailored to your CV and target job  
✅ **Real-Time Voice Coaching** - Practice with AI that listens and responds  
✅ **Instant Feedback** - Analysis on content, delivery, and professionalism  
✅ **STAR Method Prep** - AI-generated stories to structure your answers  
✅ **Performance Reports** - Detailed analytics with actionable insights  
✅ **Mobile-First Design** - Optimized for South African context

---

## 🚀 Key Features

### 1. 📄 CV & Job Description Analysis
Upload your CV (PDF, DOCX, TXT) or paste text, along with the job description you're targeting. Our AI analyzes both to create a personalized interview experience.

### 2. 🤖 AI-Generated Questions
Powered by **Google Gemini 2.5 Flash**, Vuka Coach generates 5-10 behavioral, technical, and situational questions specifically matched to your background and the role.

### 3. 🎙️ Voice-Based Practice
- **Text-to-Speech**: Hear questions spoken in natural South African English
- **Speech-to-Text**: Answer questions by speaking into your device
- **Real-time transcription** using Groq Whisper API

### 4. 💬 Instant AI Feedback
Get immediate, constructive feedback on:
- **Content Quality** - Relevance to the question
- **Delivery** - Pace, filler words, clarity
- **Professionalism** - Tone and structure
- **Improvement Tips** - Specific, actionable advice

### 5. ⭐ STAR Story Generator
AI creates personalized STAR method stories (Situation, Task, Action, Result) from your CV to help you answer behavioral questions effectively.

### 6. 📊 Performance Reports
After your practice session, receive a comprehensive report with:
- Overall score and confidence rating
- Strengths and areas for improvement
- Metrics: Clarity, Relevance, Confidence (scored 1-10)
- Better answer examples

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini 2.5 Flash** - LLM for question generation and feedback analysis
- **Groq Whisper Large V3** - Ultra-fast speech-to-text transcription
- **Google Cloud Text-to-Speech** - Natural South African English voices
- **pypdf & python-docx** - CV file parsing

### Frontend
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon system
- **react-media-recorder** - Browser audio recording

### AI Models
```
├── Google Gemini 2.5 Flash (gemini-2.5-flash)
│   ├── Question Generation
│   ├── STAR Story Creation
│   ├── Answer Analysis
│   └── Performance Reports
├── Groq Whisper Large V3
│   └── Speech-to-Text Transcription
└── Google Cloud TTS
    └── South African English Synthesis
```

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Cloud Account (for TTS)
- Google AI API Key (for Gemini)
- Groq API Key (for Whisper)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vuka-coach.git
cd vuka-coach/backend
```

2. **Create virtual environment**
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file**
```env
GOOGLE_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/gcloud-service-account.json
```

5. **Run the backend**
```bash
python main.py
```
Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to client directory**
```bash
cd ../client
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

---

## 🎮 Usage

1. **Open the app** at `http://localhost:5173`
2. **Upload your CV** (PDF/DOCX/TXT) or paste CV text
3. **Paste the job description** for the role you're targeting
4. **Click "Start Interview"** - AI generates personalized questions
5. **Practice:**
   - Click play button to hear the question
   - Hold the microphone button to record your answer
   - Receive instant AI feedback
6. **Review STAR stories** in the STAR Prep tab
7. **Generate report** after practicing to see your performance analytics

---

## 🏗️ Project Structure

```
vuka-coach/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── services.py             # AI integration services
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables (not in repo)
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Onboarding.jsx      # CV/JD input screen
│   │   │   └── InterviewRoom.jsx   # Main interview interface
│   │   ├── api.js              # Backend API calls
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🇿🇦 South African Context

### Mobile-First Design
- Responsive layouts optimized for mobile devices
- Touch-friendly controls
- Works on low-end devices

### Data Efficiency
- Audio compression for minimal data usage
- Efficient API calls (batch processing)
- Optimized for slow internet speeds
- Average session: **<5MB data**

### Accessibility
- Clear, simple UI
- Large tap targets
- High contrast for outdoor visibility
- Progressive Web App (PWA) ready

### Future: Multilingual Support
Foundation built for South Africa's 11 official languages:
- English (current)
- isiZulu, isiXhosa, Afrikaans (planned)
- Sesotho, Setswana, Sepedi (planned)
- And more...

---

## 📈 Business Model

### Revenue Streams
1. **Freemium Model**
   - 3 free practice sessions
   - Premium: Unlimited sessions at R49/month

2. **B2B Partnerships**
   - Universities and colleges
   - Recruitment agencies
   - Corporate HR departments

3. **Government Contracts**
   - SETA partnerships for skills development
   - Youth employment programs

4. **API Licensing**
   - Integration into career platforms
   - White-label solutions

### Market Opportunity
- **10M+** unemployed youth in South Africa
- **200M+** youth across Africa (expansion market)
- Low customer acquisition cost via social/community channels
- High retention through continuous learning

---

## 🏆 Hackathon Criteria

### ✅ Innovation & Relevance (30%)
- Directly tackles youth unemployment through skills development
- Novel use of voice AI for interview coaching
- Personalized STAR story generation from CV analysis

### ✅ Technical Execution (25%)
- Full-stack working prototype
- Three AI models integrated (Gemini, Whisper, TTS)
- Real-time voice processing
- Scalable FastAPI + React architecture

### ✅ Business Viability (25%)
- Clear revenue model (Freemium + B2B)
- Large addressable market (10M+ SA youth)
- Low operational costs (API-based)
- Strong product-market fit

### ✅ User-Centric Design (20%)
- Mobile-first, data-efficient
- Designed for South African context
- Accessible to low-income youth
- Intuitive interface

---

## 🚀 Future Roadmap

### Phase 1: MVP (Current)
- ✅ CV/JD input
- ✅ AI question generation
- ✅ Voice-based practice
- ✅ Real-time feedback
- ✅ Performance reports

### Phase 2: Enhanced Features (Q2 2025)
- 🔄 Video interview practice
- 🔄 Industry-specific question banks
- 🔄 Peer practice matching
- 🔄 Progress tracking over time

### Phase 3: Scale & Localization (Q3 2025)
- 🔄 Multi-language support (Zulu, Xhosa, Afrikaans)
- 🔄 Mobile app (iOS/Android)
- 🔄 Offline mode
- 🔄 WhatsApp bot integration

### Phase 4: Enterprise & Expansion (Q4 2025)
- 🔄 University partnerships
- 🔄 Corporate B2B platform
- 🔄 Pan-African expansion
- 🔄 AI career counseling

---

## 👥 Team

Built with ❤️ by passionate developers committed to solving youth unemployment through technology.

---

## 📄 License

This project was created for The Vibe Coding Hackathon 2025.

---

## 🙏 Acknowledgments

- **Melsoft Academy** - For organizing The Vibe Coding Hackathon 2025
- **Google AI** - For Gemini API access
- **Groq** - For ultra-fast Whisper inference
- **South African Youth** - Our inspiration and users


---

<div align="center">

### 🌟 Vuka Coach - Wake Up. Rise Up. Succeed. 🇿🇦

**Built in 36 hours for The Vibe Coding Hackathon 2025**

*Empowering South African youth, one interview at a time*

</div>
