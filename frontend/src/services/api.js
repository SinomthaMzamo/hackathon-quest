import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interview Coach APIs
export const startInterview = async (data) => {
  const response = await api.post('/interview/start', data);
  return response.data;
};

export const submitAnswer = async (data) => {
  const response = await api.post('/interview/answer', data);
  return response.data;
};

export const generateCV = async (data) => {
  const response = await api.post('/generate-cv', data);
  return response.data;
};

// Workplace Academy APIs
export const getQuizModules = async () => {
  const response = await api.get('/quiz/modules');
  return response.data;
};

export const getQuizQuestions = async (moduleId) => {
  const response = await api.get(`/quiz/${moduleId}`);
  return response.data;
};

export const submitQuiz = async (data) => {
  const response = await api.post('/quiz/submit', data);
  return response.data;
};

// Progress APIs
export const getUserProgress = async (userId) => {
  const response = await api.get(`/progress/${userId}`);
  return response.data;
};

export default api;
