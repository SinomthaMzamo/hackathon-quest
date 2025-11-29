import axios from "axios";

const API_URL = "http://localhost:8000";

export const initSession = async (cvFile, cvText, jobDescription) => {
  const formData = new FormData();

  // Always send JD
  formData.append("job_description", jobDescription);

  // Send either file OR text
  if (cvFile) {
    formData.append("cv_file", cvFile);
  } else if (cvText) {
    formData.append("cv_text", cvText);
  }

  const response = await axios.post(`${API_URL}/init-session`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const sendAudioAnswer = async (sessionId, audioBlob) => {
  const formData = new FormData();
  formData.append("session_id", sessionId);
  // Naming it .wav helps the backend identify it as audio
  formData.append("audio_file", audioBlob, "answer.wav");

  const response = await axios.post(`${API_URL}/process-answer`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


export const fetchNextQuestion = async (sessionId) => {
  const formData = new FormData();
  formData.append("session_id", sessionId);
  const response = await axios.post(`${API_URL}/next-question`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};