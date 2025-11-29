import uuid
import shutil
import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services import (
    generate_questions_from_cv, 
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

    questions = generate_questions_from_cv(final_cv_text, job_description)
    
    first_q_text = questions[0]
    intro_text = f"Vuka here, your copilot in your journey to land your dream job! Let's start. {first_q_text}"
    audio_b64 = text_to_speech_sa(intro_text)
    
    sessions[session_id] = {
        "questions": questions,
        "current_index": 0
    }
    
    return {
        "session_id": session_id,
        "first_question": first_q_text,
        "audio_base64": audio_b64,
        "total_questions": len(questions)
    }

@app.post("/process-answer")
async def process_answer(
    session_id: str = Form(...), 
    audio_file: UploadFile = File(...)
):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    current_q_index = session['current_index']
    questions = session['questions']
    current_question = questions[current_q_index]

    # 1. Transcribe
    temp_filename = f"temp_{session_id}.wav"
    
    # Save file
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(audio_file.file, buffer)
    
    # Check for empty recording (User clicked too fast)
    file_size = os.path.getsize(temp_filename)
    if file_size < 5000: # 5KB is extremely short/empty
        if os.path.exists(temp_filename): os.remove(temp_filename)
        return {
            "transcription": "",
            "feedback": {
                "feedback_text": "I couldn't hear you.",
                "improvement_tip": "Please make sure to hold the button while speaking.",
                "better_answer_example": "..."
            },
            "audio_base64": None
        }

    user_answer_text = transcribe_audio(temp_filename)
    if os.path.exists(temp_filename):
        os.remove(temp_filename)
    
    # 2. Analyze
    analysis = analyze_answer(current_question, user_answer_text)
    
    # 3. Generate Audio
    spoken_feedback = f"{analysis['feedback_text']} Here is a tip: {analysis['improvement_tip']}"
    feedback_audio_b64 = text_to_speech_sa(spoken_feedback)
    
    return {
        "transcription": user_answer_text,
        "feedback": analysis, 
        "audio_base64": feedback_audio_b64
    }

@app.post("/next-question")
async def next_question(session_id: str = Form(...)):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    questions = session['questions']
    
    session['current_index'] += 1
    new_index = session['current_index']
    
    is_finished = False
    next_q_text = ""
    audio_b64 = None

    if new_index < len(questions):
        next_q_text = questions[new_index]
        audio_b64 = text_to_speech_sa(next_q_text)
    else:
        is_finished = True
        next_q_text = "Interview Complete!"
    
    return {
        "is_finished": is_finished,
        "next_question": next_q_text,
        "audio_base64": audio_b64,
        "progress": f"{new_index + 1}/{len(questions)}"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)