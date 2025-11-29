const API_URL = "http://localhost:8000";

export const initSession = async (cvFile, cvText, jobDescription) => {
  const formData = new FormData();
  if (cvFile) formData.append("cv_file", cvFile);
  if (cvText) formData.append("cv_text", cvText);
  formData.append("job_description", jobDescription);

  const response = await fetch(`${API_URL}/init-session`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to init session");
  return response.json();
};

export const sendAudioAnswer = async (sessionId, audioBlob) => {
  const formData = new FormData();
  formData.append("session_id", sessionId);
  formData.append("audio_file", audioBlob, "answer.wav");

  const response = await fetch(`${API_URL}/process-answer`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to process answer");
  return response.json();
};

// --- NEW FUNCTIONS ---

export const setQuestionIndex = async (sessionId, index) => {
  const formData = new FormData();
  formData.append("session_id", sessionId);
  formData.append("index", index);

  const response = await fetch(`${API_URL}/set-question`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to set question");
  return response.json();
};

export const fetchReport = async (sessionId) => {
  const formData = new FormData();
  formData.append("session_id", sessionId);

  const response = await fetch(`${API_URL}/generate-report`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to generate report");
  return response.json();
};
