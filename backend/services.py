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

# Using 1.5-flash because 2.5 is not stable/public in all regions yet
llm_model = genai.GenerativeModel('gemini-2.5-flash', generation_config=generation_config)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
tts_client = texttospeech.TextToSpeechClient()

# --- HELPER FUNCTIONS ---

def read_file_content(file_content: bytes, filename: str) -> str:
    filename = filename.lower()
    text = ""
    try:
        print(f"Parsing file: {filename}")
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
        text = text.strip()
        print(f"Extracted {len(text)} characters.")
        return text
    except Exception as e:
        print(f"Error parsing file: {e}")
        return ""

def generate_questions_from_cv(cv_text: str, job_desc: str):
    if not cv_text or len(cv_text) < 50:
        cv_text = "Candidate did not provide a detailed CV."

    prompt = f"""
    Role: You are 'Vuka', an expert South African Youth Career Coach.
    Task: Create 3 highly specific interview questions based on the CV and Job Description.
    
    CV Context: {cv_text[:3000]} 
    Job Context: {job_desc[:3000]}
    
    Requirements:
    1. One Behavioral Question (Look at their specific past roles).
    2. One Technical/Skill-based Question (Match a skill in CV to JD).
    3. One Situational Question (Real world SA workplace scenario).
    
    Output Format: JSON Array of strings.
    """
    
    try:
        response = llm_model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"LLM Error: {e}")
        return [
            "Tell me about yourself and how your experience fits this role.",
            "Describe a challenge you faced in a previous project.",
            "Why do you want to work for this specific company?"
        ]

def transcribe_audio(file_path: str):
    try:
        # Check file size before sending
        if os.path.getsize(file_path) < 1000: # Less than 1kb is definitely silence
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
    # Handle empty/short audio answers gracefully
    if not user_answer or len(user_answer) < 2:
        return {
            "feedback_text": "I couldn't hear you clearly.",
            "improvement_tip": "Please hold the microphone button down while speaking.",
            "better_answer_example": "N/A"
        }

    prompt = f"""
    Role: South African Career Coach. Supportive but constructive.
    
    Question: "{current_question}"
    User Answer: "{user_answer}"
    
    Task: Analyze the answer.
    
    Output JSON Schema:
    {{
        "feedback_text": "Speak directly to the user. 2 sentences maximum. Start with positive reinforcement.",
        "improvement_tip": "1 specific actionable tip on what to fix.",
        "better_answer_example": "A short, refined example of how to say it better."
    }}
    """
    
    try:
        response = llm_model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"Analysis Error: {e}")
        return {
            "feedback_text": "Good effort.",
            "improvement_tip": "Try to be more specific.",
            "better_answer_example": "..."
        }

def text_to_speech_sa(text: str):
    if not text: return None
    
    try:
        synthesis_input = texttospeech.SynthesisInput(text=text)
        
        # FIX: Removing specific "name" to avoid 400 Errors. 
        # Letting Google pick the default 'en-ZA' voice.
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-ZA"
        )
        
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        
        response = tts_client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )
        return base64.b64encode(response.audio_content).decode('utf-8')
        
    except Exception as e:
        print(f"TTS Error (SA): {e}")
        
        # FALLBACK: If SA fails, try US English just so the app doesn't break
        try:
            voice = texttospeech.VoiceSelectionParams(language_code="en-US")
            response = tts_client.synthesize_speech(
                 input=synthesis_input, voice=voice, audio_config=audio_config
            )
            return base64.b64encode(response.audio_content).decode('utf-8')
        except Exception as e2:
            print(f"TTS Error (Fallback): {e2}")
            return None