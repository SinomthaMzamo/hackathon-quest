import { Link } from 'react-router-dom';
import { Mic, GraduationCap, TrendingUp, Award, Users, Zap, Target } from 'lucide-react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Master Interviews & Workplace Skills
              <span className="gradient-text"> with AI</span>
            </h1>
            <p className="hero-subtitle">
              The complete platform for South African youth to build interview confidence 
              and workplace professionalism through AI-powered coaching.
            </p>
            <div className="hero-actions">
              <Link to="/interview" className="btn btn-primary btn-large">
                <Mic size={20} />
                Start Interview Practice
              </Link>
              <Link to="/academy" className="btn btn-outline btn-large">
                <GraduationCap size={20} />
                Explore Academy
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">100+</div>
                <div className="stat-label">Practice Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-number">5</div>
                <div className="stat-label">Workplace Modules</div>
              </div>
              <div className="stat">
                <div className="stat-number">SA</div>
                <div className="stat-label">Context-Aware</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why VoiceCoach AI?</h2>
          <div className="grid grid-3">
            <div className="feature-card card card-hover">
              <div className="feature-icon">
                <Mic />
              </div>
              <h3>AI Voice Interview Coach</h3>
              <p>
                Practice real interviews with AI that analyzes your answers, tone, pace, 
                and provides SA-specific feedback. Get personalized CV and cover letter suggestions.
              </p>
            </div>
            
            <div className="feature-card card card-hover">
              <div className="feature-icon">
                <GraduationCap />
              </div>
              <h3>Workplace Readiness Academy</h3>
              <p>
                Master workplace professionalism through gamified quizzes on dress code, 
                communication, digital etiquette, and office politics - all tailored for SA context.
              </p>
            </div>
            
            <div className="feature-card card card-hover">
              <div className="feature-icon">
                <TrendingUp />
              </div>
              <h3>Track Your Progress</h3>
              <p>
                See your improvement over time with detailed analytics, shareable certificates, 
                and personalized recommendations for growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Choose Your Path</h3>
              <p>Start with interview practice or workplace skills training</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Practice & Learn</h3>
              <p>Get real-time AI feedback and SA-specific coaching</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Improve & Apply</h3>
              <p>Get matched with job opportunities and track your readiness</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Career?</h2>
            <p>Join thousands of South African youth building their professional skills</p>
            <Link to="/interview" className="btn btn-primary btn-large">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
