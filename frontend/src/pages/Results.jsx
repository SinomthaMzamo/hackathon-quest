import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Download, TrendingUp, Target, FileText, Briefcase } from 'lucide-react';
import './Results.css';

function Results() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const report = {
    overallScore: 75,
    readinessLevel: 'Intermediate',
    strengths: [
      'Clear communication style',
      'Good understanding of role requirements',
      'Professional tone'
    ],
    weaknesses: [
      'Could provide more specific examples',
      'Reduce filler words',
      'Better structure for complex questions'
    ],
    saCulturalFit: 'Your responses show good understanding of SA workplace culture. Consider emphasizing teamwork and respect for diversity.',
    recommendations: [
      'Practice more industry-specific scenarios',
      'Work on reducing "um" and "uh" usage',
      'Prepare STAR method examples'
    ],
    cvSuggestions: 'Highlight your customer service experience and emphasize soft skills relevant to the role.',
    coverLetterSuggestions: 'Mention your understanding of SA market dynamics and commitment to professional growth.',
    matchingJobTypes: [
      'Customer Service Representative',
      'Retail Associate',
      'Call Center Agent'
    ],
    nextSteps: [
      'Complete Workplace Readiness modules',
      'Practice 2 more interview sessions',
      'Update CV with AI suggestions'
    ]
  };

  return (
    <div className="results">
      <div className="container">
        <div className="results-header">
          <h1>Your Interview Analysis</h1>
          <p>Comprehensive feedback tailored for the South African job market</p>
        </div>
        
        <div className="score-section card">
          <div className="score-display-large">
            <div className="score-circle-large">
              <span className="score-number-large">{report.overallScore}%</span>
            </div>
            <div className="score-info">
              <h2>Overall Score</h2>
              <span className="readiness-badge">{report.readinessLevel}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-2">
          <div className="strengths-card card">
            <h3>
              <TrendingUp />
              Strengths
            </h3>
            <ul>
              {report.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div className="weaknesses-card card">
            <h3>
              <Target />
              Areas to Improve
            </h3>
            <ul>
              {report.weaknesses.map((weakness, idx) => (
                <li key={idx}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="cultural-fit card">
          <h3>SA Cultural Fit Assessment</h3>
          <p>{report.saCulturalFit}</p>
        </div>
        
        <div className="recommendations card">
          <h3>Recommendations</h3>
          <ul>
            {report.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
        
        <div className="cv-section card">
          <h3>
            <FileText />
            CV & Cover Letter Suggestions
          </h3>
          <div className="cv-suggestions">
            <div className="cv-item">
              <h4>CV Optimization</h4>
              <p>{report.cvSuggestions}</p>
            </div>
            <div className="cv-item">
              <h4>Cover Letter Tips</h4>
              <p>{report.coverLetterSuggestions}</p>
            </div>
          </div>
        </div>
        
        <div className="job-matching card">
          <h3>
            <Briefcase />
            Matching Job Opportunities
          </h3>
          <p>Based on your interview performance, you're ready for:</p>
          <div className="job-tags">
            {report.matchingJobTypes.map((job, idx) => (
              <span key={idx} className="job-tag">{job}</span>
            ))}
          </div>
        </div>
        
        <div className="next-steps card">
          <h3>Next Steps</h3>
          <ul>
            {report.nextSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
        
        <div className="share-section">
          <div className="card">
            <h3>Share Your Achievement</h3>
            <p>Share your Interview Readiness Score on LinkedIn and inspire others!</p>
            <div className="share-actions">
              <button className="btn btn-primary">
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
        
        <div className="actions">
          <button className="btn btn-primary" onClick={() => navigate('/interview')}>
            Practice Another Interview
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/academy')}>
            Explore Workplace Academy
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;