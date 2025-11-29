import os
import json
import base64
import io
import google.generativeai as genai
from google.cloud import texttospeech
from groq import Groq
from pypdf import PdfReader
from docx import Document
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

generation_config = {
    "temperature": 1,
    "response_mime_type": "application/json",
}

# Using 1.5-flash
llm_model = genai.GenerativeModel('gemini-2.5-flash', generation_config=generation_config)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
tts_client = texttospeech.TextToSpeechClient()

# --- HELPER FUNCTIONS ---
def read_file_content(file_content: bytes, filename: str) -> str:
    filename = filename.lower()
    text = ""
    try:
        if filename.endswith('.pdf'):
            pdf_reader = PdfReader(io.BytesIO(file_content))
            for page in pdf_reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        elif filename.endswith('.docx'):
            doc = Document(io.BytesIO(file_content))
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            text = file_content.decode('utf-8', errors='ignore')
        return text.strip()
    except Exception as e:
        print(f"Error parsing file: {e}")
        return ""

def generate_questions_from_cv(cv_text: str, job_desc: str):
    if not cv_text or len(cv_text) < 50:
        cv_text = "Candidate did not provide a detailed CV."

    prompt = f"""
    Role: You are 'Vuka', an expert South African Youth Career Coach.
    Task: Create 5 specific interview questions based on the CV and Job Description.

    CV Context: {cv_text[:3000]} 
    Job Context: {job_desc[:3000]}

    Requirements:
    1. Questions should vary between Behavioral, Technical, and Situational.
    2. Keep them concise.

    Output Format: JSON Array of strings.
    """

    try:
        response = llm_model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"LLM Error (Questions): {e}")
        return [
            "Tell me about yourself.",
            "What are your strengths?",
            "Describe a challenge you faced.",
            "Why do you want this job?",
            "Where do you see yourself in 5 years?"
        ]

def generate_star_stories(cv_text: str, job_desc: str):
    """
    Generates suggested STAR method stories based on the user's CV
    that would fit the specific Job Description.
    """
    prompt = f"""
    Role: Career Coach.
    Task: Analyze the CV and Job Description. Identify 3 potential "STAR" stories (Situation, Task, Action, Result) 
    that the candidate could use during the interview to prove they are a fit for the job.

    CV: {cv_text[:3000]}
    Job: {job_desc[:3000]}

    Output JSON Schema:
    [
        {{
            "title": "Title of the story (e.g., Leadership in Crisis)",
            "situation": "Brief context",
            "task": "What needed to be done",
            "action": "What the candidate did (Active voice)",
            "result": "The positive outcome"
        }}
    ]
    """
    try:
        response = llm_model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"LLM Error (STAR): {e}")
        return []

def generate_performance_report(history: list):
    """
    Analyzes the entire session history to produce a final report.
    """
    history_text = json.dumps(history)
    
    prompt = f"""
    Role: Senior Interview Assessor.
    Task: Generate a final performance report based on these Q&A pairs.

    Session Data: {history_text}

    Output JSON Schema:
    {{
        "overall_score": 75, (Integer 0-100)
        "summary": "A paragraph summarizing the candidate's performance.",
        "strengths": ["Strength 1", "Strength 2"],
        "areas_for_improvement": ["Weakness 1", "Weakness 2"],
        "metrics": {{
            "clarity": 8, (1-10)
            "relevance": 7, (1-10)
            "confidence": 6 (1-10)
        }}
    }}
    """
    try:
        response = llm_model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"LLM Error (Report): {e}")
        return {
            "overall_score": 0,
            "summary": "Could not generate report.",
            "strengths": [],
            "areas_for_improvement": [],
            "metrics": {"clarity": 0, "relevance": 0, "confidence": 0}
        }

def transcribe_audio(file_path: str):
    try:
        if os.path.getsize(file_path) < 1000:
            return ""
        
        with open(file_path, "rb") as audio_file:
            transcription = groq_client.audio.transcriptions.create(
                file=(file_path, audio_file.read()),
                model="whisper-large-v3",
                response_format="json",
                language="en"
            )
        return transcription.text
    except Exception as e:
        print(f"Groq STT Error: {e}")
        return ""

def analyze_answer(current_question, user_answer):
    if not user_answer or len(user_answer) < 2:
        return {
            "feedback_text": "I couldn't hear you clearly.",
            "improvement_tip": "Please speak clearly into the mic.",
            "better_answer_example": "N/A"
        }

    prompt = f"""
    Role: Career Coach.
    Question: "{current_question}"
    Answer: "{user_answer}"
    
    Task: Analyze.
    Output JSON:
    {{
        "feedback_text": "2 sentences max. Constructive feedback.",
        "improvement_tip": "One actionable tip.",
        "better_answer_example": "Short example answer."
    }}
    """
    try:
        response = llm_model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"Analysis Error: {e}")
        return {
            "feedback_text": "Good attempt.", 
            "improvement_tip": "Be more specific.", 
            "better_answer_example": "..."
        }

def text_to_speech_sa(text: str):
    if not text: return None
    try:
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(language_code="en-ZA")
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
        response = tts_client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
        return base64.b64encode(response.audio_content).decode('utf-8')
    except Exception as e:
        print(f"TTS Error: {e}")
        return None