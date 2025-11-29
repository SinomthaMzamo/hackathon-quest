import React, { useState, useEffect, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import {
  Mic, Square, Volume2, ArrowRight, RotateCcw, Loader2,
  CheckCircle, AlertCircle, Play, List, Star, BarChart2, X, ChevronLeft, Pause
} from "lucide-react";
import { sendAudioAnswer, setQuestionIndex, fetchReport } from "../api";

export default function InterviewRoom({ sessionData }) {
  // --- STATE ---
  const [questions, setQuestions] = useState(sessionData.questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [starStories] = useState(sessionData.star_stories || []);

  // Audio
  const [currentAudio, setCurrentAudio] = useState(
    sessionData.current_audio_base64
  );
  const [feedbackAudio, setFeedbackAudio] = useState(null);

  // Logic
  const [feedback, setFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // UI View
  const [activeTab, setActiveTab] = useState("interview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const audioRef = useRef(new Audio());

  // --- AUDIO HELPERS ---
  const playAudio = (b64) => {
    if (!b64) return;

    if (
      !audioRef.current.paused &&
      audioRef.current.src.includes(b64.slice(0, 10))
    ) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = `data:audio/mp3;base64,${b64}`;
    audioRef.current.onended = () => setIsPlaying(false);
    audioRef.current.onpause = () => setIsPlaying(false);
    audioRef.current.onplay = () => setIsPlaying(true);

    audioRef.current.play().catch((e) => console.log("Audio play err", e));
  };

  // --- RECORDING HOOK ---
  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: async (blobUrl, blob) => {
        // Redundant safety check: ensure processing is still true
        setIsProcessing(true);
        try {
          const result = await sendAudioAnswer(sessionData.session_id, blob);
          setFeedback({
            transcription: result.transcription,
            analysis: result.feedback,
          });
          setFeedbackAudio(result.audio_base64);
          playAudio(result.audio_base64);
        } catch (err) {
          console.error(err);
          alert("Error sending audio");
        } finally {
          setIsProcessing(false);
        }
      },
    });

  // --- WRAPPER HANDLERS (THE FIX) ---

  const handleStartRecording = (e) => {
    if (e && e.cancelable) e.preventDefault(); // Stop ghost clicks

    // Clear previous state immediately
    setFeedback(null);
    setFeedbackAudio(null);
    audioRef.current.pause();
    setIsPlaying(false);

    startRecording();
  };

  const handleStopRecording = (e) => {
    if (e && e.cancelable) e.preventDefault();

    // CRITICAL FIX: Set isProcessing to TRUE immediately.
    // This fills the gap between releasing the button and the 'onStop' callback firing.
    // It prevents the UI from reverting to "Listen to the question..."
    setIsProcessing(true);

    stopRecording();
  };

  // --- HANDLERS ---
  const handleJumpToQuestion = async (index) => {
    if (index === currentIndex) {
      setIsSidebarOpen(false);
      return;
    }

    setIsProcessing(true);
    setFeedback(null);
    setFeedbackAudio(null);
    audioRef.current.pause();
    setIsPlaying(false);

    try {
      const res = await setQuestionIndex(sessionData.session_id, index);
      setCurrentIndex(res.index);
      setCurrentAudio(res.audio_base64);
      setActiveTab("interview");
      setIsSidebarOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      handleJumpToQuestion(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setIsProcessing(true);
    try {
      const data = await fetchReport(sessionData.session_id);
      setReportData(data);
      setShowReport(true);
      audioRef.current.pause();
    } catch (e) {
      alert("Could not generate report yet. Did you answer any questions?");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToPractice = () => {
    setShowReport(false);
  };

  // --- REPORT VIEW ---
  if (showReport && reportData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 overflow-y-auto font-sans">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-500">
              Performance Report
            </h1>
            <div className="flex space-x-3 w-full md:w-auto">
              <button
                onClick={handleBackToPractice}
                className="flex-1 md:flex-none bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-700"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Practice
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 md:flex-none bg-red-900/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-900/40 transition-colors border border-red-900/30"
              >
                Exit Session
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="col-span-2 md:col-span-1 bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800 text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
                {reportData.overall_score}%
              </div>
              <div className="text-xs md:text-sm text-slate-400 uppercase tracking-wide">
                Overall Score
              </div>
            </div>
            {Object.entries(reportData.metrics).map(([key, val]) => (
              <div
                key={key}
                className="bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
                  {val}/10
                </div>
                <div className="text-xs md:text-sm text-slate-400 uppercase tracking-wide">
                  {key}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-800">
            <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center text-slate-200">
              <BarChart2 className="mr-2 w-5 h-5" /> Summary
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {reportData.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-green-900/30">
              <h3 className="text-lg font-bold text-green-400 mb-4">
                Strengths
              </h3>
              <ul className="space-y-3">
                {reportData.strengths.map((s, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-red-900/30">
              <h3 className="text-lg font-bold text-red-400 mb-4">
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {reportData.areas_for_improvement.map((w, i) => (
                  <li key={i} className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-3 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN INTERVIEW VIEW ---
  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden relative">
      {/* MOBILE BACKDROP */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
            fixed md:relative z-40 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col
            ${
              isSidebarOpen
                ? "translate-x-0 w-80 shadow-2xl"
                : "-translate-x-full md:translate-x-0 w-80 md:w-0 overflow-hidden"
            }
        `}
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-yellow-500 text-lg">Question List</h2>
            <p className="text-xs text-slate-400">Select to jump ahead</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpToQuestion(idx)}
              disabled={isProcessing}
              className={`w-full text-left p-3 rounded-lg text-sm transition-all group ${
                idx === currentIndex
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                  : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <div className="flex items-start">
                <span
                  className={`mr-2 font-mono opacity-50 ${
                    idx === currentIndex ? "text-yellow-500" : ""
                  }`}
                >
                  {idx + 1}.
                </span>
                <span className="line-clamp-2 group-hover:text-slate-200">
                  {q}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleFinish}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-all border border-slate-700"
          >
            <BarChart2 className="w-4 h-4 mr-2" /> Finish & Report
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative w-full">
        {/* HEADER */}
        <div className="h-16 md:h-20 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 bg-slate-950/90 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 focus:outline-none"
            >
              <List className="w-6 h-6" />
            </button>

            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 shrink-0">
              <button
                onClick={() => setActiveTab("interview")}
                className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all flex items-center whitespace-nowrap ${
                  activeTab === "interview"
                    ? "bg-yellow-500 text-black shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Mic className="w-3 h-3 md:w-4 md:h-4 inline mr-1.5" />
                <span>Interview</span>
              </button>
              <button
                onClick={() => setActiveTab("star")}
                className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all flex items-center whitespace-nowrap ${
                  activeTab === "star"
                    ? "bg-purple-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Star className="w-3 h-3 md:w-4 md:h-4 inline mr-1.5" />
                <span>STAR Prep</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-2 shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "recording"
                  ? "bg-red-500 animate-pulse"
                  : "bg-green-500"
              }`}
            ></span>
            <span className="text-[10px] md:text-xs text-slate-400 font-bold tracking-wider hidden xs:inline-block">
              LIVE
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
          {activeTab === "star" ? (
            // STAR PREP
            <div className="w-full max-w-5xl space-y-6 animate-in fade-in">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  STAR Stories
                </h2>
                <p className="text-sm md:text-base text-slate-400">
                  Use these generated stories to structure your answers
                  effectively.
                </p>
              </div>
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-8">
                {starStories.map((story, i) => (
                  <div
                    key={i}
                    className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-xl hover:border-purple-500/50 transition-colors shadow-lg shadow-black/20"
                  >
                    <div className="bg-purple-900/20 text-purple-400 text-[10px] font-bold uppercase py-1 px-3 rounded-full w-fit mb-4 border border-purple-500/20">
                      Story {i + 1}
                    </div>
                    <h3 className="font-bold text-base md:text-lg mb-3 text-slate-100 line-clamp-2">
                      {story.title}
                    </h3>
                    <div className="space-y-3 text-xs md:text-sm text-slate-400">
                      <p>
                        <strong className="text-slate-200">S:</strong>{" "}
                        {story.situation}
                      </p>
                      <p>
                        <strong className="text-slate-200">T:</strong>{" "}
                        {story.task}
                      </p>
                      <p>
                        <strong className="text-slate-200">A:</strong>{" "}
                        {story.action}
                      </p>
                      <div className="pt-2 border-t border-slate-800 mt-2">
                        <p className="text-green-400">
                          <strong className="text-green-300">Result:</strong>{" "}
                          {story.result}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // INTERVIEW
            <div className="w-full max-w-xl flex flex-col h-full justify-between animate-in slide-in-from-bottom-4 py-2">
              {/* Question Area - UPDATED FOR MANUAL PLAY */}
              <div className="text-center space-y-4 md:space-y-6 mt-2 md:mt-8">
                {/* Central Play Button */}
                <button
                  onClick={() => playAudio(currentAudio)}
                  className={`
                                    mx-auto w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all shadow-xl
                                    ${
                                      status === "recording"
                                        ? "bg-red-500/20 scale-110 shadow-lg shadow-red-500/20 cursor-default"
                                        : "bg-yellow-500 hover:bg-yellow-400 text-black cursor-pointer hover:scale-105"
                                    }
                                `}
                  disabled={status === "recording"}
                >
                  {status === "recording" ? (
                    <Mic className="w-6 h-6 md:w-10 md:h-10 text-red-500 animate-pulse" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 md:w-10 md:h-10 text-black fill-current" />
                  ) : (
                    <Play className="w-6 h-6 md:w-10 md:h-10 text-black fill-current ml-1" />
                  )}
                </button>

                <div className="relative px-2">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-slate-100">
                    {questions[currentIndex]}
                  </h2>
                  {!isPlaying && status !== "recording" && (
                    <p className="text-xs text-yellow-500 mt-3 font-bold uppercase tracking-widest animate-pulse">
                      Tap Button to Listen
                    </p>
                  )}
                </div>
              </div>

              {/* Feedback Area */}
              <div className="flex-1 flex items-center justify-center py-6 md:py-8 w-full">
                {feedback ? (
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-5 md:p-6 backdrop-blur-sm relative shadow-xl">
                    <button
                      onClick={() => playAudio(feedbackAudio)}
                      className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-green-500 hover:bg-slate-700 shadow-sm border border-slate-700"
                    >
                      {isPlaying &&
                      feedbackAudio &&
                      audioRef.current.src.includes(
                        feedbackAudio.slice(0, 10)
                      ) ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <div className="mb-4 pr-8">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                        You Said
                      </p>
                      <p className="text-slate-300 italic text-xs md:text-sm line-clamp-3">
                        "{feedback.transcription}"
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-green-500 uppercase font-bold mb-2">
                        Coach Feedback
                      </p>
                      <p className="text-white font-medium text-sm md:text-lg leading-relaxed">
                        {feedback.analysis.feedback_text}
                      </p>
                    </div>
                    <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-xl text-xs md:text-sm flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                      <span>
                        <strong>Tip:</strong>{" "}
                        {feedback.analysis.improvement_tip}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-600 text-xs md:text-sm italic">
                    {isProcessing
                      ? "Analyzing your answer..."
                      : "Listen to the question, then record your answer."}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="pb-4 md:pb-8 w-full">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-yellow-500 animate-spin" />
                  </div>
                ) : feedback ? (
                  <div className="flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-x-4">
                    <button
                      onClick={() => {
                        setFeedback(null);
                        clearBlobUrl();
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 md:py-4 rounded-xl font-bold flex items-center justify-center border border-slate-700 transition-all"
                    >
                      <RotateCcw className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Retry
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 text-white py-3 md:py-4 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-green-900/20 transition-all"
                    >
                      Next <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center select-none touch-none">
                    <button
                      onMouseDown={handleStartRecording}
                      onMouseUp={handleStopRecording}
                      onTouchStart={handleStartRecording}
                      onTouchEnd={handleStopRecording}
                      className={`
                        w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl 
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
                        <Mic className="w-8 h-8 md:w-10 md:h-10" />
                      )}
                    </button>

                    <p className="text-slate-500 text-[10px] font-bold uppercase mt-4 tracking-widest text-center">
                      {status === "recording"
                        ? "Release to Send"
                        : "Hold to Speak"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}