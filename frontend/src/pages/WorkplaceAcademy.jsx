import { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle, XCircle, Award, TrendingUp, Lock } from 'lucide-react';
import { getQuizModules, getQuizQuestions, submitQuiz } from '../services/api';
import './WorkplaceAcademy.css';

function WorkplaceAcademy() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const data = await getQuizModules();
      setModules(data);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const startModule = async (moduleId) => {
    try {
      const data = await getQuizQuestions(moduleId);
      setQuestions(data);
      setSelectedModule(moduleId);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const answers = questions.map((_, idx) => selectedAnswers[idx] || 0);
      const results = await submitQuiz({
        userId: 'user123', // In production, get from auth
        moduleId: selectedModule,
        answers
      });
      setQuizResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const resetQuiz = () => {
    setSelectedModule(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizResults(null);
  };

  if (loading) {
    return (
      <div className="workplace-academy">
        <div className="container">
          <div className="loading">Loading modules...</div>
        </div>
      </div>
    );
  }

  if (showResults && quizResults) {
    return (
      <div className="workplace-academy">
        <div className="container">
          <div className="quiz-results card">
            <div className="results-header">
              <Award className="award-icon" />
              <h1>Quiz Complete!</h1>
            </div>
            
            <div className="score-section">
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{quizResults.percentage}%</span>
                </div>
                <div className="score-details">
                  <p>{quizResults.score} out of {quizResults.total} correct</p>
                  <span className={`level-badge level-${quizResults.level.toLowerCase()}`}>
                    {quizResults.level} Level
                  </span>
                </div>
              </div>
            </div>
            
            {quizResults.feedback && (
              <div className="feedback-section">
                <h3>Your Feedback</h3>
                <p className="feedback-text">{quizResults.feedback.feedback}</p>
                
                {quizResults.feedback.strengths && quizResults.feedback.strengths.length > 0 && (
                  <div className="strengths">
                    <h4>Strengths:</h4>
                    <ul>
                      {quizResults.feedback.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {quizResults.feedback.areasToImprove && quizResults.feedback.areasToImprove.length > 0 && (
                  <div className="improvements">
                    <h4>Areas to Improve:</h4>
                    <ul>
                      {quizResults.feedback.areasToImprove.map((area, idx) => (
                        <li key={idx}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="question-review">
              <h3>Question Review</h3>
              {questions.map((q, idx) => {
                const userAnswer = selectedAnswers[idx];
                const isCorrect = q.options[userAnswer]?.correct;
                return (
                  <div key={q.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-header">
                      <span className="review-icon">
                        {isCorrect ? <CheckCircle /> : <XCircle />}
                      </span>
                      <span className="review-question">{q.question}</span>
                    </div>
                    <div className="review-explanation">{q.explanation}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="results-actions">
              <button className="btn btn-primary" onClick={resetQuiz}>
                Try Another Module
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedModule && questions.length > 0) {
    const question = questions[currentQuestion];
    const isLastQuestion = currentQuestion === questions.length - 1;
    const allAnswered = Object.keys(selectedAnswers).length === questions.length;
    const currentAnswer = selectedAnswers[currentQuestion];

    return (
      <div className="workplace-academy">
        <div className="container">
          <div className="quiz-container">
            <div className="quiz-header">
              <button className="btn btn-outline" onClick={resetQuiz}>
                ← Back to Modules
              </button>
              <div className="progress-info">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            
            <div className="question-card card">
              <div className="question-category">
                {question.category}
              </div>
              <h2 className="question-text">{question.question}</h2>
              
              <div className="options">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`option-btn ${currentAnswer === idx ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(currentQuestion, idx)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="option-text">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="quiz-navigation">
              <button
                className="btn btn-outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              
              {isLastQuestion ? (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={currentAnswer === undefined}
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workplace-academy">
      <div className="container">
        <div className="academy-header">
          <h1>Workplace Readiness Academy</h1>
          <p>Master professional skills through interactive, SA-specific scenarios</p>
        </div>
        
        <div className="modules-grid grid grid-2">
          {modules.map(module => (
            <div key={module.id} className="module-card card card-hover">
              <div className="module-icon">
                <GraduationCap />
              </div>
              <h3>{module.name}</h3>
              <p className="module-description">{module.description}</p>
              <div className="module-meta">
                <span className="question-count">{module.questionCount} questions</span>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => startModule(module.id)}
              >
                Start Module
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WorkplaceAcademy;
