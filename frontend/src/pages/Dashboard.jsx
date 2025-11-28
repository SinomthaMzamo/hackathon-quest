import { useState, useEffect } from 'react';
import { TrendingUp, Award, Mic, GraduationCap, Share2, Download, CheckCircle } from 'lucide-react';
import { getUserProgress } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [progress, setProgress] = useState({
    xp: 0,
    level: 1,
    badges: [],
    completedModules: [],
    interviewSessions: 0
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await getUserProgress('user123');
      setProgress(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const calculateLevelProgress = () => {
    const xpForNextLevel = progress.level * 100;
    const currentLevelXP = (progress.level - 1) * 100;
    const progressXP = progress.xp - currentLevelXP;
    const percentage = (progressXP / (xpForNextLevel - currentLevelXP)) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  const shareCertificate = () => {
    // In production, generate and share certificate
    alert('Certificate sharing feature coming soon!');
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dashboard-title">Your Progress</h1>
        
        <div className="stats-grid grid grid-3">
          <div className="stat-card card">
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-value">{progress.xp}</div>
            <div className="stat-label">Total XP</div>
          </div>
          
          <div className="stat-card card">
            <div className="stat-icon">
              <Award />
            </div>
            <div className="stat-value">Level {progress.level}</div>
            <div className="stat-label">Current Level</div>
          </div>
          
          <div className="stat-card card">
            <div className="stat-icon">
              <Mic />
            </div>
            <div className="stat-value">{progress.interviewSessions}</div>
            <div className="stat-label">Interviews Completed</div>
          </div>
        </div>
        
        <div className="level-progress card">
          <div className="level-header">
            <h2>Level Progress</h2>
            <span>Level {progress.level}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${calculateLevelProgress()}%` }}
            />
          </div>
          <p className="progress-text">
            {progress.xp} XP / {progress.level * 100} XP to Level {progress.level + 1}
          </p>
        </div>
        
        <div className="achievements-section">
          <h2>Badges & Achievements</h2>
          <div className="badges-grid grid grid-3">
            {progress.badges.length > 0 ? (
              progress.badges.map((badge, idx) => (
                <div key={idx} className="badge-card card">
                  <Award className="badge-icon" />
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                </div>
              ))
            ) : (
              <div className="no-badges">
                <p>Complete interviews and quizzes to earn badges!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="completed-modules card">
          <h2>Completed Modules</h2>
          {progress.completedModules.length > 0 ? (
            <div className="modules-list">
              {progress.completedModules.map((module, idx) => (
                <div key={idx} className="module-item">
                  <GraduationCap className="module-icon" />
                  <span>{module}</span>
                  <CheckCircle className="check-icon" />
                </div>
              ))}
            </div>
          ) : (
            <p className="no-modules">Start completing modules to see your progress here!</p>
          )}
        </div>
        
        <div className="share-section card">
          <h2>Share Your Achievement</h2>
          <p>Generate and share your Interview Readiness Certificate on LinkedIn</p>
          <div className="share-actions">
            <button className="btn btn-primary" onClick={shareCertificate}>
              <Share2 />
              Share Certificate
            </button>
            <button className="btn btn-outline">
              <Download />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
