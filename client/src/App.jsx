import React, { useState } from "react";
import Onboarding from "./components/Onboarding";
import InterviewRoom from "./components/InterviewRoom";
import { initSession } from "./api";

function App() {
  const [sessionData, setSessionData] = useState(null);

  const handleStartInterview = async (cvFile, cvText, jd) => {
    try {
      const data = await initSession(cvFile, cvText, jd);
      setSessionData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to start session. Please try again.");
    }
  };

  if (sessionData) {
    return <InterviewRoom sessionData={sessionData} />;
  }

  return <Onboarding onStart={handleStartInterview} />;
}

export default App;
