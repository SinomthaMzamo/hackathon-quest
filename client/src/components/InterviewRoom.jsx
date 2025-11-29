import React, { useState, useEffect, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import {
  Mic,
  Square,
  Volume2,
  ArrowRight,
  RotateCcw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Play,
} from "lucide-react";
import { sendAudioAnswer, fetchNextQuestion } from "../api";

export default function InterviewRoom({ sessionData }) {
  const [currentQuestion, setCurrentQuestion] = useState(
    sessionData.first_question
  );

  // Store audio base64 strings so we can replay them
  const [questionAudio, setQuestionAudio] = useState(sessionData.audio_base64);
  const [feedbackAudio, setFeedbackAudio] = useState(null);

  const [feedback, setFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const audioRef = useRef(new Audio());

  // Helper: Play Audio safely
  const playAudio = (b64Audio) => {
    if (!b64Audio) return;
    // Stop any currently playing audio before starting new
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    audioRef.current.src = `data:audio/mp3;base64,${b64Audio}`;
    audioRef.current.play().catch((e) => console.log("Auto-play blocked", e));
  };

  // Effect: Auto-play the FIRST question on load
  useEffect(() => {
    if (sessionData.audio_base64) {
      playAudio(sessionData.audio_base64);
    }
  }, [sessionData]);

  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: async (blobUrl, blob) => {
        setIsProcessing(true);
        try {
          const result = await sendAudioAnswer(sessionData.session_id, blob);

          setFeedback({
            transcription: result.transcription,
            analysis: result.feedback,
          });

          // Save and Play Feedback Audio
          setFeedbackAudio(result.audio_base64);
          playAudio(result.audio_base64);
        } catch (err) {
          alert("Error processing answer.");
          console.error(err);
        } finally {
          setIsProcessing(false);
        }
      },
    });

  const handleNextQuestion = async () => {
    setIsProcessing(true);
    setFeedback(null);
    setFeedbackAudio(null);

    try {
      const result = await fetchNextQuestion(sessionData.session_id);

      if (result.is_finished) {
        setIsFinished(true);
      } else {
        setCurrentQuestion(result.next_question);

        // Save and Play New Question Audio
        setQuestionAudio(result.audio_base64);
        playAudio(result.audio_base64);
      }
    } catch (err) {
      alert("Error fetching next question");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTryAgain = () => {
    setFeedback(null);
    setFeedbackAudio(null);
    clearBlobUrl();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-6 font-sans">
      {/* Header */}
      <div className="w-full max-w-lg flex justify-between items-center mb-10 border-b border-slate-800 pb-4">
        <span className="text-yellow-500 font-bold text-xl">Vuka Coach</span>
        <div className="flex items-center space-x-2">
          <span
            className={`w-2 h-2 rounded-full ${
              status === "recording"
                ? "bg-red-500 animate-pulse"
                : "bg-green-500"
            }`}
          ></span>
          <span className="text-xs text-slate-400 font-medium">
            LIVE SESSION
          </span>
        </div>
      </div>

      <div className="w-full max-w-lg flex-1 flex flex-col">
        {/* --- QUESTION SECTION --- */}
        {!isFinished && (
          <div className="text-center space-y-6 mb-8 relative">
            {/* Visualizer / Avatar */}
            <div
              className={`
                    mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
                    ${
                      status === "recording"
                        ? "bg-red-500/20 scale-110 shadow-lg shadow-red-500/20"
                        : "bg-yellow-500/10"
                    }
                `}
            >
              <Volume2
                className={`w-10 h-10 ${
                  status === "recording"
                    ? "text-red-500 animate-pulse"
                    : "text-yellow-500"
                }`}
              />
            </div>

            {/* Question Text + Replay Button */}
            <div className="relative group">
              <h2 className="text-2xl font-bold leading-snug text-slate-100 min-h-[4rem] px-4">
                {currentQuestion}
              </h2>

              {/* Replay Question Button */}
              <button
                onClick={() => playAudio(questionAudio)}
                className="absolute -right-2 top-0 p-2 text-slate-500 hover:text-yellow-500 transition-colors opacity-50 hover:opacity-100"
                title="Replay Question"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        )}

        {/* --- FEEDBACK SECTION --- */}
        {feedback && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 mb-6 animate-in slide-in-from-bottom-5 backdrop-blur-sm relative">
            {/* Replay Feedback Button */}
            <button
              onClick={() => playAudio(feedbackAudio)}
              className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-green-500 hover:text-green-400 hover:bg-slate-700 transition-all shadow-sm"
              title="Replay Coach Feedback"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* User Transcription (Small) */}
            <div className="border-l-2 border-slate-700 pl-3 opacity-70">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                You Said
              </p>
              <p className="text-slate-300 italic text-sm line-clamp-2">
                "{feedback.transcription}"
              </p>
            </div>

            {/* AI Feedback (Main) */}
            <div>
              <p className="text-[10px] text-green-500 uppercase font-bold mb-2">
                Coach Feedback
              </p>
              <p className="text-white font-medium text-lg leading-relaxed">
                {feedback.analysis.feedback_text}
              </p>
            </div>

            {/* Tip Box */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-xl text-sm flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Pro Tip:</strong> {feedback.analysis.improvement_tip}
              </span>
            </div>
          </div>
        )}

        {/* --- CONTROLS SECTION --- */}
        <div className="flex-1 flex items-end justify-center pb-8">
          {isFinished ? (
            <div className="text-center space-y-4 animate-in zoom-in">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Session Complete!</h2>
              <p className="text-slate-400">You did great. Keep practicing!</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-full font-bold transition-colors"
              >
                Start New Session
              </button>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center space-y-3 text-yellow-500">
              <Loader2 className="w-12 h-12 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Processing...
              </span>
            </div>
          ) : feedback ? (
            /* CHOICES: Try Again OR Next */
            <div className="flex space-x-4 w-full">
              <button
                onClick={handleTryAgain}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all border border-slate-700"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Retry
              </button>
              <button
                onClick={handleNextQuestion}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-green-900/20"
              >
                Next <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          ) : (
            /* RECORD BUTTON */
            <div className="text-center group">
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`
                            w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl relative
                            ${
                              status === "recording"
                                ? "bg-red-500 scale-110 shadow-red-500/40"
                                : "bg-gradient-to-br from-yellow-400 to-yellow-600 hover:scale-105 shadow-yellow-500/30 text-black"
                            }
                        `}
              >
                {status === "recording" ? (
                  <Square className="w-8 h-8 fill-current text-white" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </button>
              <p className="text-slate-600 text-[10px] font-bold uppercase mt-6 tracking-widest transition-colors group-hover:text-slate-400">
                {status === "recording" ? "Release to Send" : "Hold to Speak"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
