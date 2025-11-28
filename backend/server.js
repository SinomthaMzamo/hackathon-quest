import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Store user sessions (in production, use a database)
const userSessions = new Map();

// ========== INTERVIEW COACH ENDPOINTS ==========

// Helper function to extract key info from CV/JD
function extractKeyInfo(text) {
  if (!text) return null;
  
  // Extract skills, experience, education from CV
  const skillsMatch = text.match(/(?:skills|competencies|abilities)[:\s]*(.+?)(?:\n\n|\n[A-Z]|$)/i);
  const experienceMatch = text.match(/(?:experience|work history|employment)[:\s]*(.+?)(?:\n\n|\n[A-Z]|$)/i);
  const educationMatch = text.match(/(?:education|qualifications|qualifications)[:\s]*(.+?)(?:\n\n|\n[A-Z]|$)/i);
  
  return {
    skills: skillsMatch ? skillsMatch[1].substring(0, 200) : null,
    experience: experienceMatch ? experienceMatch[1].substring(0, 300) : null,
    education: educationMatch ? educationMatch[1].substring(0, 200) : null,
    summary: text.substring(0, 500) // First 500 chars as summary
  };
}

// Start interview session
app.post('/api/interview/start', async (req, res) => {
  try {
    const { userId = 'user', industry, role, language = 'en', cvText, jdText } = req.body;
    const sessionId = `session_${Date.now()}_${userId}`;
    
    // Extract information from CV and JD
    const cvInfo = extractKeyInfo(cvText);
    const jdInfo = extractKeyInfo(jdText);
    
    // Build context for personalized questions
    let contextPrompt = `Generate 5 personalized interview questions for a ${role} position in ${industry} industry in South Africa.`;
    
    if (cvInfo) {
      contextPrompt += `\n\nCandidate's CV Summary:\n`;
      if (cvInfo.skills) contextPrompt += `Skills: ${cvInfo.skills}\n`;
      if (cvInfo.experience) contextPrompt += `Experience: ${cvInfo.experience}\n`;
      if (cvInfo.education) contextPrompt += `Education: ${cvInfo.education}\n`;
    }
    
    if (jdInfo) {
      contextPrompt += `\n\nJob Description Summary:\n${jdInfo.summary}`;
      contextPrompt += `\n\nGenerate questions that:\n`;
      contextPrompt += `1. Reference specific requirements from the job description\n`;
      contextPrompt += `2. Ask about relevant experience from the candidate's CV\n`;
      contextPrompt += `3. Are tailored to the South African job market context\n`;
    } else {
      contextPrompt += ` Make them relevant to SA context.`;
    }
    
    contextPrompt += `\n\nFormat as JSON array: [{"question": "...", "expectedTopics": ["..."]}]`;
    
    // Default questions if OpenAI fails or isn't configured
    const defaultQuestions = [
      {
        question: cvInfo 
          ? `Based on your experience in ${cvInfo.experience ? cvInfo.experience.substring(0, 50) : 'your field'}, tell me why you're interested in this ${role} position.`
          : `Tell me about yourself and why you're interested in this ${role} position in the ${industry} industry.`,
        expectedTopics: ['background', 'motivation', 'relevant experience']
      },
      {
        question: jdInfo
          ? `This role requires ${jdInfo.summary.substring(0, 100)}. How does your experience align with these requirements?`
          : `What do you know about the ${industry} industry in South Africa?`,
        expectedTopics: ['industry knowledge', 'SA context', 'role alignment']
      },
      {
        question: cvInfo && cvInfo.experience
          ? `You mentioned experience with ${cvInfo.experience.substring(0, 80)}. Describe a challenging situation you handled in this context.`
          : `Describe a time when you handled a difficult situation at work or in a team setting.`,
        expectedTopics: ['problem-solving', 'experience', 'STAR method']
      },
      {
        question: `How do you handle working in a diverse team environment, especially in the South African workplace context?`,
        expectedTopics: ['teamwork', 'diversity', 'SA workplace culture']
      },
      {
        question: `Where do you see yourself in 5 years, and how does this ${role} position fit into your career goals?`,
        expectedTopics: ['career goals', 'ambition', 'commitment']
      }
    ];
    
    let questions = defaultQuestions;
    
    // Try to use OpenAI if available, but don't fail if it's not
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-api-key-here') {
      try {
        const completion = await Promise.race([
          openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: contextPrompt }],
            temperature: 0.7
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('OpenAI timeout')), 8000)
          )
        ]);
        
        const parsed = JSON.parse(completion.choices[0].message.content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          questions = parsed;
        }
      } catch (openaiError) {
        console.log('OpenAI not available, using personalized default questions:', openaiError.message);
        // Continue with personalized default questions
      }
    }
    
    userSessions.set(sessionId, {
      userId,
      industry,
      role,
      language,
      questions,
      answers: [],
      currentQuestion: 0,
      startTime: Date.now(),
      cvText,
      jdText,
      cvInfo,
      jdInfo
    });
    
    // Return first question immediately
    res.json({ 
      sessionId, 
      question: questions[0],
      totalQuestions: questions.length,
      personalized: !!(cvText || jdText)
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ error: 'Failed to start interview: ' + error.message });
  }
});

// Submit answer and get next question
app.post('/api/interview/answer', async (req, res) => {
  try {
    const { sessionId, answer, transcript, audioMetrics } = req.body;
    const session = userSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Analyze the answer
    const analysis = await analyzeAnswer(
      answer,
      transcript,
      audioMetrics,
      session.questions[session.currentQuestion],
      session.industry,
      session.role,
      session.cvInfo,
      session.jdInfo
    );
    
    session.answers.push({
      question: session.questions[session.currentQuestion],
      answer,
      transcript,
      audioMetrics,
      analysis
    });
    
    session.currentQuestion++;
    
    // Check if interview is complete
    if (session.currentQuestion >= session.questions.length) {
      const finalReport = await generateFinalReport(session);
      return res.json({ 
        complete: true, 
        report: finalReport,
        sessionId 
      });
    }
    
    res.json({ 
      complete: false,
      nextQuestion: session.questions[session.currentQuestion],
      feedback: analysis.quickFeedback
    });
  } catch (error) {
    console.error('Error processing answer:', error);
    res.status(500).json({ error: 'Failed to process answer' });
  }
});

// Analyze answer with multi-modal analysis
async function analyzeAnswer(answer, transcript, audioMetrics, question, industry, role, cvInfo, jdInfo) {
  let prompt = `You are an expert interview coach for South African job seekers. Analyze this interview answer:

Question: ${question.question}
Answer: ${answer}
Transcript: ${transcript}
Audio Metrics: ${JSON.stringify(audioMetrics)}`;

  if (cvInfo) {
    prompt += `\n\nCandidate's Background:\n`;
    if (cvInfo.skills) prompt += `Skills: ${cvInfo.skills}\n`;
    if (cvInfo.experience) prompt += `Experience: ${cvInfo.experience}\n`;
  }
  
  if (jdInfo) {
    prompt += `\n\nJob Requirements:\n${jdInfo.summary}`;
  }

  prompt += `\n\nProvide analysis in this JSON format:
{
  "contentScore": 0-10,
  "relevanceScore": 0-10,
  "clarityScore": 0-10,
  "culturalFit": 0-10,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "saSpecificFeedback": "...",
  "improvementTips": ["..."],
  "quickFeedback": "..."
}

Focus on:
- Relevance to SA job market and ${industry} industry
- How well the answer aligns with the candidate's CV and job requirements
- Cultural appropriateness for SA workplace
- Clarity and structure
- Specific actionable improvements`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });
  
  return JSON.parse(completion.choices[0].message.content);
}

// Generate final interview report
async function generateFinalReport(session) {
  const allAnswers = session.answers.map(a => ({
    question: a.question.question,
    answer: a.answer,
    analysis: a.analysis
  }));
  
  const prompt = `Generate a comprehensive interview report for a South African job seeker:

Industry: ${session.industry}
Role: ${session.role}
Answers: ${JSON.stringify(allAnswers)}

Create a JSON report:
{
  "overallScore": 0-100,
  "readinessLevel": "Beginner/Intermediate/Advanced",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "saCulturalFit": "...",
  "recommendations": ["..."],
  "cvSuggestions": "...",
  "coverLetterSuggestions": "...",
  "matchingJobTypes": ["..."],
  "nextSteps": ["..."]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4
  });
  
  return JSON.parse(completion.choices[0].message.content);
}

// Generate CV/cover letter
app.post('/api/generate-cv', async (req, res) => {
  try {
    const { interviewReport, userInfo } = req.body;
    
    const prompt = `Based on this interview performance report, generate an optimized CV and cover letter for South African job market:

Report: ${JSON.stringify(interviewReport)}
User Info: ${JSON.stringify(userInfo)}

Generate:
{
  "cv": {
    "summary": "...",
    "skills": ["..."],
    "experience": "...",
    "formattingTips": ["..."]
  },
  "coverLetter": {
    "template": "...",
    "personalizationTips": ["..."]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5
    });
    
    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error('Error generating CV:', error);
    res.status(500).json({ error: 'Failed to generate CV' });
  }
});

// ========== WORKPLACE READINESS QUIZ ENDPOINTS ==========

const quizModules = {
  dressCode: [
    {
      id: 1,
      question: "What is NOT appropriate to wear at work?",
      options: [
        { text: "A cotton dress", correct: false },
        { text: "Bum shorts", correct: true },
        { text: "Smart casual pants", correct: false },
        { text: "Collared shirt", correct: false }
      ],
      explanation: "Bum shorts are too casual for most workplaces. In SA corporate culture, smart casual is the standard unless specified otherwise.",
      category: "dressCode"
    },
    {
      id: 2,
      question: "You're working at a corporate office in Sandton. What should you wear?",
      options: [
        { text: "Sneakers and jeans", correct: false },
        { text: "Smart casual (chinos + collared shirt)", correct: true },
        { text: "Traditional attire", correct: true },
        { text: "Gym wear", correct: false }
      ],
      explanation: "Both smart casual and traditional attire are acceptable in SA corporate culture. The key is looking professional and respectful.",
      category: "dressCode"
    }
  ],
  communication: [
    {
      id: 1,
      question: "What's better to say if you didn't hear properly in an interview?",
      options: [
        { text: "I beg your pardon?", correct: true },
        { text: "Come again?", correct: false },
        { text: "Huh?", correct: false },
        { text: "What?", correct: false }
      ],
      explanation: "'I beg your pardon?' is the most professional and polite way to ask for clarification in a formal setting like an interview.",
      category: "communication"
    },
    {
      id: 2,
      question: "Your manager asks you to do something you don't understand. Best response?",
      options: [
        { text: "Huh?", correct: false },
        { text: "Could you please explain that again?", correct: true },
        { text: "Nod and figure it out later", correct: false },
        { text: "I don't get it", correct: false }
      ],
      explanation: "Asking politely for clarification shows professionalism and prevents mistakes. It's better to ask than to do something wrong.",
      category: "communication"
    }
  ],
  workplaceTopics: [
    {
      id: 1,
      question: "What's more appropriate to talk about at work?",
      options: [
        { text: "Personal relationship problems", correct: false },
        { text: "Work-related projects and goals", correct: true },
        { text: "Gossip about colleagues", correct: false },
        { text: "Political opinions", correct: false }
      ],
      explanation: "Keep conversations professional and focused on work. Personal problems, gossip, and politics can create uncomfortable situations.",
      category: "workplaceTopics"
    },
    {
      id: 2,
      question: "A colleague gossips about your manager. You should:",
      options: [
        { text: "Join in the conversation", correct: false },
        { text: "Politely change the subject", correct: true },
        { text: "Report them immediately", correct: false },
        { text: "Listen but don't participate", correct: false }
      ],
      explanation: "Politely redirecting the conversation maintains professionalism without creating conflict. Avoid gossip to protect your reputation.",
      category: "workplaceTopics"
    }
  ],
  digitalEtiquette: [
    {
      id: 1,
      question: "When should you use WhatsApp vs email for work communication?",
      options: [
        { text: "WhatsApp for urgent, email for formal", correct: true },
        { text: "Always use WhatsApp", correct: false },
        { text: "Always use email", correct: false },
        { text: "It doesn't matter", correct: false }
      ],
      explanation: "Use WhatsApp for quick, urgent messages with colleagues you know well. Use email for formal communications, documentation, and with superiors.",
      category: "digitalEtiquette"
    }
  ],
  officePolitics: [
    {
      id: 1,
      question: "A colleague takes credit for your work. You should:",
      options: [
        { text: "Confront them publicly", correct: false },
        { text: "Speak privately with your manager", correct: true },
        { text: "Do nothing", correct: false },
        { text: "Get revenge", correct: false }
      ],
      explanation: "Address the issue professionally through proper channels. Document your contributions and discuss privately with your manager.",
      category: "officePolitics"
    }
  ]
};

// Get quiz modules
app.get('/api/quiz/modules', (req, res) => {
  const modules = Object.keys(quizModules).map(key => ({
    id: key,
    name: formatModuleName(key),
    questionCount: quizModules[key].length,
    description: getModuleDescription(key)
  }));
  res.json(modules);
});

// Get questions for a module
app.get('/api/quiz/:moduleId', (req, res) => {
  const { moduleId } = req.params;
  const questions = quizModules[moduleId] || [];
  res.json(questions);
});

// Submit quiz answers
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const { userId, moduleId, answers } = req.body;
    const questions = quizModules[moduleId] || [];
    
    let score = 0;
    const results = questions.map((q, idx) => {
      const userAnswer = answers[idx];
      const correct = q.options[userAnswer]?.correct || false;
      if (correct) score++;
      
      return {
        questionId: q.id,
        correct,
        explanation: q.explanation
      };
    });
    
    const percentage = Math.round((score / questions.length) * 100);
    const level = percentage >= 80 ? 'Gold' : percentage >= 60 ? 'Silver' : 'Bronze';
    
    // Generate personalized feedback
    const prompt = `A user scored ${percentage}% on the ${moduleId} workplace readiness module. 
    Generate encouraging, actionable feedback in JSON:
    {
      "feedback": "...",
      "strengths": ["..."],
      "areasToImprove": ["..."],
      "nextSteps": ["..."]
    }`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6
    });
    
    const aiFeedback = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      score,
      total: questions.length,
      percentage,
      level,
      results,
      feedback: aiFeedback
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to process quiz' });
  }
});

// Helper functions
function formatModuleName(key) {
  const names = {
    dressCode: 'Dress Code & Appearance',
    communication: 'Communication Etiquette',
    workplaceTopics: 'Workplace Topics & Boundaries',
    digitalEtiquette: 'Digital Communication',
    officePolitics: 'Office Politics & Conflict'
  };
  return names[key] || key;
}

function getModuleDescription(key) {
  const descs = {
    dressCode: 'Learn what to wear in different workplace settings',
    communication: 'Master professional communication skills',
    workplaceTopics: 'Understand appropriate workplace conversations',
    digitalEtiquette: 'Navigate email, WhatsApp, and digital communication',
    officePolitics: 'Handle workplace conflicts and politics professionally'
  };
  return descs[key] || '';
}

// Get user progress
app.get('/api/progress/:userId', (req, res) => {
  // In production, fetch from database
  res.json({
    xp: 0,
    level: 1,
    badges: [],
    completedModules: [],
    interviewSessions: 0
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
