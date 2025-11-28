import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Play, Pause, CheckCircle, AlertCircle, Loader, Upload, FileText } from 'lucide-react';
import { startInterview, submitAnswer } from '../services/api';
import './InterviewCoach.css';

function InterviewCoach() {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // setup, interview, complete
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [finalReport, setFinalReport] = useState(null);
  
  // Setup form
  const [industry, setIndustry] = useState('');
  const [role, setRole] = useState('');
  const [language, setLanguage] = useState('en');
  const [cvFile, setCvFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Audio recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const accumulatedFinalTranscript = useRef(''); // Persists across recognition restarts
  
  // Audio metrics
  const [audioMetrics, setAudioMetrics] = useState({
    fillerWords: 0,
    pace: 'normal',
    tone: 'neutral'
  });

  useEffect(() => {
    // Initialize Web Speech API for transcription
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'en' ? 'en-ZA' : language;
      
      let accumulatedTranscript = '';
      
      recognitionRef.current.onresult = (event) => {
        let interimText = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Add final text to accumulated transcript (persists across restarts)
            accumulatedFinalTranscript.current += transcript + ' ';
          } else {
            // Interim results (still being spoken)
            interimText += transcript;
          }
        }
        
        // Combine accumulated final text with current interim
        transcriptRef.current = accumulatedFinalTranscript.current + interimText;
        analyzeFillerWords(transcriptRef.current);
      };
      
      recognitionRef.current.onend = () => {
        // When recognition ends, restart if still recording
        // accumulatedFinalTranscript.current persists, so transcript is preserved
        if (recognitionRef.current && isRecording) {
          recognitionRef.current.start();
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        // Don't reset transcript on error - accumulatedFinalTranscript persists
      };
    }
  }, [language]);

  const analyzeFillerWords = (text) => {
    const fillerWords = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'well'];
    const words = text.toLowerCase().split(/\s+/);
    const count = words.filter(word => fillerWords.includes(word)).length;
    setAudioMetrics(prev => ({ ...prev, fillerWords: count }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Reset transcript when starting new recording for a new question
      transcriptRef.current = '';
      accumulatedFinalTranscript.current = ''; // Reset accumulated transcript for new question
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // Stop any existing recognition
        // Small delay to ensure clean restart
        setTimeout(() => {
          if (recognitionRef.current && isRecording) {
            recognitionRef.current.start();
          }
        }, 100);
      }
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to continue');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        // Final transcript is already in transcriptRef.current
      }
    }
  };
  
  const handleCvUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setCvFile(file);
    setIsUploading(true);
    
    try {
      const text = await readFileAsText(file);
      setCvText(text);
    } catch (error) {
      console.error('Error reading CV:', error);
      alert('Error reading CV file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleJdUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setJdFile(file);
    setIsUploading(true);
    
    try {
      const text = await readFileAsText(file);
      setJdText(text);
    } catch (error) {
      console.error('Error reading JD:', error);
      alert('Error reading Job Description file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleStartInterview = async () => {
    if (!industry || !role) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsProcessing(true);
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsProcessing(false);
      // Silently fall back to demo mode without alert
      console.log('Request timed out, using demo mode with personalized questions');
      startDemoMode();
    }, 12000); // 12 second timeout
    
    try {
      const response = await startInterview({ 
        industry, 
        role, 
        language,
        cvText: cvText || null,
        jdText: jdText || null
      });
      clearTimeout(timeoutId);
      setSessionId(response.sessionId);
      setCurrentQuestion(response.question);
      setStep('interview');
      setIsProcessing(false);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error starting interview:', error);
      
      // Fallback to demo mode
      startDemoMode();
    }
  };
  
  const startDemoMode = () => {
    const demoSessionId = `demo_${Date.now()}`;
    
    // Create personalized questions based on CV and JD if available
    let demoQuestions = [];
    
    if (cvText && jdText) {
      // Highly personalized questions
      demoQuestions = [
        {
          question: `Based on your CV, I can see you have experience in ${cvText.substring(0, 100)}. Tell me why you're interested in this ${role} position and how your background aligns with the job requirements.`,
          expectedTopics: ['background', 'motivation', 'role alignment']
        },
        {
          question: `This role requires ${jdText.substring(0, 150)}. How does your experience from your CV prepare you for these specific requirements?`,
          expectedTopics: ['experience relevance', 'skill matching', 'qualifications']
        },
        {
          question: `Describe a challenging situation from your work experience that demonstrates your problem-solving abilities.`,
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
    } else if (cvText) {
      // Personalized with CV only
      demoQuestions = [
        {
          question: `Based on your CV, tell me about yourself and why you're interested in this ${role} position in the ${industry} industry.`,
          expectedTopics: ['background', 'motivation', 'relevant experience']
        },
        {
          question: `What do you know about the ${industry} industry in South Africa?`,
          expectedTopics: ['industry knowledge', 'SA context', 'market awareness']
        },
        {
          question: `Describe a time when you handled a difficult situation at work.`,
          expectedTopics: ['problem-solving', 'experience', 'STAR method']
        },
        {
          question: `How do you handle working in a diverse team environment?`,
          expectedTopics: ['teamwork', 'diversity', 'SA context']
        },
        {
          question: `Where do you see yourself in 5 years?`,
          expectedTopics: ['career goals', 'ambition', 'commitment']
        }
      ];
    } else if (jdText) {
      // Personalized with JD only
      demoQuestions = [
        {
          question: `Tell me about yourself and why you're interested in this ${role} position.`,
          expectedTopics: ['background', 'motivation', 'relevant experience']
        },
        {
          question: `This role requires ${jdText.substring(0, 150)}. How does your experience align with these requirements?`,
          expectedTopics: ['role alignment', 'qualifications', 'skill matching']
        },
        {
          question: `Describe a time when you handled a difficult situation at work.`,
          expectedTopics: ['problem-solving', 'experience', 'STAR method']
        },
        {
          question: `How do you handle working in a diverse team environment?`,
          expectedTopics: ['teamwork', 'diversity', 'SA context']
        },
        {
          question: `Where do you see yourself in 5 years?`,
          expectedTopics: ['career goals', 'ambition', 'commitment']
        }
      ];
    } else {
      // Default questions
      demoQuestions = [
        {
          question: `Tell me about yourself and why you're interested in this ${role} position in the ${industry} industry.`,
          expectedTopics: ['background', 'motivation', 'relevant experience']
        },
        {
          question: `What do you know about the ${industry} industry in South Africa?`,
          expectedTopics: ['industry knowledge', 'SA context', 'market awareness']
        },
        {
          question: `Describe a time when you handled a difficult situation at work or in a team setting.`,
          expectedTopics: ['problem-solving', 'experience', 'STAR method']
        },
        {
          question: `How do you handle working in a diverse team environment?`,
          expectedTopics: ['teamwork', 'diversity', 'SA context']
        },
        {
          question: `Where do you see yourself in 5 years, and how does this role fit into your career goals?`,
          expectedTopics: ['career goals', 'ambition', 'commitment']
        }
      ];
    }
    
    setSessionId(demoSessionId);
    setCurrentQuestion(demoQuestions[0]);
    setStep('interview');
    setIsProcessing(false);
  };

  const handleSubmitAnswer = async () => {
    if (!transcriptRef.current.trim()) {
      alert('Please provide an answer');
      return;
    }
    
    stopRecording();
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const response = await submitAnswer({
        sessionId,
        answer: transcriptRef.current,
        transcript: transcriptRef.current,
        audioMetrics
      });
      
      setAnswers(prev => [...prev, {
        question: currentQuestion,
        answer: transcriptRef.current,
        feedback: response.feedback
      }]);
      
      if (response.complete) {
        setFinalReport(response.report);
        setStep('complete');
        } else {
          setCurrentQuestion(response.nextQuestion);
          setFeedback(response.feedback);
          transcriptRef.current = '';
          accumulatedFinalTranscript.current = ''; // Reset for next question
          audioChunksRef.current = [];
          setAudioMetrics({ fillerWords: 0, pace: 'normal', tone: 'neutral' });
        }
    } catch (error) {
      console.error('Error submitting answer:', error);
      
      // Demo mode fallback
      if (sessionId?.startsWith('demo_')) {
        const demoQuestions = [
          {
            question: `What do you know about our company and the ${industry} industry in South Africa?`,
            expectedTopics: ['company knowledge', 'industry awareness']
          },
          {
            question: `Describe a time when you handled a difficult situation at work.`,
            expectedTopics: ['problem-solving', 'experience', 'STAR method']
          },
          {
            question: `How do you handle working in a diverse team environment?`,
            expectedTopics: ['teamwork', 'diversity', 'SA context']
          },
          {
            question: `Where do you see yourself in 5 years?`,
            expectedTopics: ['career goals', 'ambition', 'commitment']
          }
        ];
        
        setAnswers(prev => [...prev, {
          question: currentQuestion,
          answer: transcriptRef.current,
          feedback: 'Demo mode: In a real session, you would receive AI-powered feedback here.'
        }]);
        
        const currentAnswers = [...answers, {
          question: currentQuestion,
          answer: transcriptRef.current,
          feedback: 'Demo mode: In a real session, you would receive AI-powered feedback here.'
        }];
        setAnswers(currentAnswers);
        
        if (currentAnswers.length >= 5) {
          // Complete demo interview
          setFinalReport({
            overallScore: 75,
            readinessLevel: 'Intermediate',
            strengths: ['Good communication', 'Clear answers'],
            weaknesses: ['Could provide more examples'],
            saCulturalFit: 'Demo mode - AI analysis would appear here',
            recommendations: ['Practice more', 'Work on examples'],
            cvSuggestions: 'Demo mode',
            coverLetterSuggestions: 'Demo mode',
            matchingJobTypes: [role],
            nextSteps: ['Complete Workplace Readiness modules']
          });
          setStep('complete');
        } else {
          setCurrentQuestion(demoQuestions[currentAnswers.length] || demoQuestions[0]);
          setFeedback('Demo mode: Continue to next question');
          transcriptRef.current = '';
          accumulatedFinalTranscript.current = ''; // Reset for next question
          audioChunksRef.current = [];
          setAudioMetrics({ fillerWords: 0, pace: 'normal', tone: 'neutral' });
        }
      } else {
        alert(`Failed to process answer: ${error.message || 'Please check if the backend server is running'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewResults = () => {
    navigate(`/results/${sessionId}`);
  };

  if (step === 'setup') {
    return (
      <div className="interview-coach">
        <div className="container">
          <div className="interview-setup card">
            <h1>Start Your AI Interview Practice</h1>
            <p className="subtitle">Get personalized feedback tailored for the South African job market</p>
            
            <div className="setup-form">
              <div className="form-group">
                <label>Industry</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="">Select industry</option>
                  <option value="retail">Retail</option>
                  <option value="call-center">Call Center</option>
                  <option value="tech-support">Tech Support</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Role/Position</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Customer Service Representative"
                />
              </div>
              
              <div className="form-group">
                <label>Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="zu">isiZulu</option>
                  <option value="af">Afrikaans</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Upload Your CV (Optional but Recommended)</label>
                <p className="form-hint">Upload your CV to get personalized questions based on your experience</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleCvUpload}
                  className="file-input"
                />
                {cvFile && (
                  <div className="file-info">
                    <CheckCircle size={16} />
                    <span>{cvFile.name}</span>
                    {cvText && <span className="file-status">✓ Parsed</span>}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Upload Job Description (Optional but Recommended)</label>
                <p className="form-hint">Upload the job description to get questions tailored to the specific role</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleJdUpload}
                  className="file-input"
                />
                {jdFile && (
                  <div className="file-info">
                    <CheckCircle size={16} />
                    <span>{jdFile.name}</span>
                    {jdText && <span className="file-status">✓ Parsed</span>}
                  </div>
                )}
              </div>
              
              <button 
                className="btn btn-primary btn-large"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Start button clicked', { industry, role, language });
                  handleStartInterview();
                }}
                disabled={isProcessing || !industry || !role}
                type="button"
              >
                {isProcessing ? (
                  <>
                    <Loader className="spinner" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Mic />
                    Start Interview
                  </>
                )}
              </button>
              {(!industry || !role) && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>
                  Please fill in Industry and Role to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="interview-coach">
        <div className="container">
          <div className="interview-complete card">
            <CheckCircle className="success-icon" />
            <h1>Interview Complete!</h1>
            <p>Your AI analysis is ready</p>
            
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{finalReport?.overallScore || 0}</span>
                <span className="score-label">Score</span>
              </div>
              <div className="readiness-level">
                <span className="level-badge">{finalReport?.readinessLevel || 'Beginner'}</span>
              </div>
            </div>
            
            <button className="btn btn-primary btn-large" onClick={handleViewResults}>
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-coach">
      <div className="container">
        <div className="interview-session">
          <div className="question-card card">
            <div className="question-header">
              <span className="question-number">
                Question {answers.length + 1} of 5
              </span>
            </div>
            <h2 className="question-text">{currentQuestion?.question}</h2>
            
            {feedback && (
              <div className="quick-feedback">
                <AlertCircle size={18} />
                <span>{feedback}</span>
              </div>
            )}
          </div>
          
          <div className="recording-section card">
            <div className="recording-controls">
              {!isRecording ? (
                <button 
                  className="btn-record btn-primary"
                  onClick={startRecording}
                  disabled={isProcessing}
                >
                  <Mic size={24} />
                  Start Recording
                </button>
              ) : (
                <button 
                  className="btn-record btn-danger"
                  onClick={stopRecording}
                >
                  <MicOff size={24} />
                  Stop Recording
                </button>
              )}
            </div>
            
            <div className="transcript-display">
              <h3>Your Answer:</h3>
              <div className="transcript-text" key={answers.length}>
                {transcriptRef.current || 'Start recording to see your answer...'}
              </div>
              
              {audioMetrics.fillerWords > 0 && (
                <div className="metrics">
                  <span>Filler words: {audioMetrics.fillerWords}</span>
                </div>
              )}
            </div>
            
            <button 
              className="btn btn-primary btn-large"
              onClick={handleSubmitAnswer}
              disabled={!transcriptRef.current.trim() || isProcessing || isRecording}
            >
              {isProcessing ? (
                <>
                  <Loader className="spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle />
                  Submit Answer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewCoach;
