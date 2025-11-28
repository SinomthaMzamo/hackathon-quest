import { Link, useLocation } from 'react-router-dom';
import { Mic, GraduationCap, Home, BarChart3 } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Mic className="brand-icon" />
          <span>VoiceCoach AI</span>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link 
            to="/interview" 
            className={`nav-link ${isActive('/interview') ? 'active' : ''}`}
          >
            <Mic size={18} />
            <span>Interview</span>
          </Link>
          <Link 
            to="/academy" 
            className={`nav-link ${isActive('/academy') ? 'active' : ''}`}
          >
            <GraduationCap size={18} />
            <span>Academy</span>
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            <span>Progress</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
