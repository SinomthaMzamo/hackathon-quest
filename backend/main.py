import uuid
import shutil
import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services import (
    generate_questions_from_cv,
    generate_star_stories,
    generate_performance_report,
    transcribe_audio,
    analyze_answer,
    text_to_speech_sa,
    read_file_content
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (Use a DB in production)
sessions = {}

@app.post("/init-session")
async def init_session(
    cv_file: UploadFile = File(None),
    cv_text: str = Form(None),
    job_description: str = Form(...)
):
    session_id = str(uuid.uuid4())

    final_cv_text = ""
    if cv_file:
        content = await cv_file.read()
        final_cv_text = read_file_content(content, cv_file.filename)
    elif cv_text:
        final_cv_text = cv_text

    if not final_cv_text.strip():
        final_cv_text = "No CV content provided."

    # Generate content
    questions = generate_questions_from_cv(final_cv_text, job_description)
    star_stories = generate_star_stories(final_cv_text, job_description)

    # Initial Audio
    first_q_text = questions[0]
    intro_text = f"Vuka here. I've prepared {len(questions)} questions for you. Let's begin with: {first_q_text}"
    audio_b64 = text_to_speech_sa(intro_text)

    sessions[session_id] = {
        "questions": questions,
        "star_stories": star_stories,
        "current_index": 0,
        "history": {} # Stores { "question_index": { "q": str, "a": str, "feedback": obj } }
    }

    return {
        "session_id": session_id,
        "questions": questions, # Send all questions to frontend
        "star_stories": star_stories,
        "current_index": 0,
        "current_audio_base64": audio_b64
    }

@app.post("/set-question")
async def set_question(
    session_id: str = Form(...),
    index: int = Form(...)
):
    """Allows user to jump to a specific question"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    questions = session['questions']
    
    if index < 0 or index >= len(questions):
        raise HTTPException(status_code=400, detail="Invalid index")

    session['current_index'] = index
    question_text = questions[index]
    
    # Generate audio for this specific question
    audio_b64 = text_to_speech_sa(question_text)
    
    return {
        "index": index,
        "question": question_text,
        "audio_base64": audio_b64
    }

@app.post("/process-answer")
async def process_answer(
    session_id: str = Form(...),
    audio_file: UploadFile = File(...)
):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    current_index = session['current_index']
    current_question = session['questions'][current_index]

    # Transcribe
    temp_filename = f"temp_{session_id}_{current_index}.wav"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(audio_file.file, buffer)

    user_answer_text = transcribe_audio(temp_filename)
    if os.path.exists(temp_filename):
        os.remove(temp_filename)

    # Analyze
    analysis = analyze_answer(current_question, user_answer_text)

    # Save to history
    session['history'][str(current_index)] = {
        "question": current_question,
        "answer": user_answer_text,
        "analysis": analysis
    }

    # Generate Feedback Audio
    spoken_feedback = f"{analysis['feedback_text']}"
    feedback_audio_b64 = text_to_speech_sa(spoken_feedback)

    return {
        "transcription": user_answer_text,
        "feedback": analysis, 
        "audio_base64": feedback_audio_b64
    }

@app.post("/generate-report")
async def generate_report(session_id: str = Form(...)):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    history_list = list(session['history'].values())
    
    if not history_list:
        return {"error": "No answers recorded yet."}

    report = generate_performance_report(history_list)
    
    return report

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)