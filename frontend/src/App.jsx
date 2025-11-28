import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import InterviewCoach from './pages/InterviewCoach';
import WorkplaceAcademy from './pages/WorkplaceAcademy';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview" element={<InterviewCoach />} />
          <Route path="/academy" element={<WorkplaceAcademy />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results/:sessionId" element={<Results />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
