import React, { useState } from "react";
import {
  Upload,
  Briefcase,
  ChevronRight,
  Loader2,
  FileText,
  Type,
} from "lucide-react";

export default function Onboarding({ onStart }) {
  const [activeTab, setActiveTab] = useState("upload"); // 'upload' or 'text'
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState("");
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jdText) {
      alert("Please enter a Job Description");
      return;
    }
    if (activeTab === "upload" && !cvFile) {
      alert("Please upload a file");
      return;
    }
    if (activeTab === "text" && !cvText) {
      alert("Please paste your CV text");
      return;
    }

    setIsLoading(true);
    // Pass file as null if text mode, pass text as null if file mode
    await onStart(
      activeTab === "upload" ? cvFile : null,
      activeTab === "text" ? cvText : null,
      jdText
    );
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
            Vuka Coach
          </h1>
          <p className="text-slate-400">Your Personal AI Interview Mentor</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-800"
        >
          {/* Job Description (Always Visible) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Briefcase className="inline w-4 h-4 mr-2 text-yellow-500" />
              Target Job Description
            </label>
            <textarea
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none h-24 resize-none transition-all"
              placeholder="Paste the job ad here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>

          {/* CV Section - TABS */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <span className="text-yellow-500 mr-2">●</span>
              Your CV / Resume
            </label>

            {/* Tab Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-lg mb-4 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex-1 flex items-center justify-center py-2 text-sm rounded-md transition-all ${
                  activeTab === "upload"
                    ? "bg-slate-800 text-white shadow"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Upload className="w-4 h-4 mr-2" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`flex-1 flex items-center justify-center py-2 text-sm rounded-md transition-all ${
                  activeTab === "text"
                    ? "bg-slate-800 text-white shadow"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Type className="w-4 h-4 mr-2" /> Paste Text
              </button>
            </div>

            {/* Input Area based on Tab */}
            {activeTab === "upload" ? (
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-yellow-500/50 transition-colors bg-slate-950/50">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  id="cv-upload"
                  className="hidden"
                  onChange={(e) => setCvFile(e.target.files[0])}
                />
                <label htmlFor="cv-upload" className="cursor-pointer block">
                  {cvFile ? (
                    <div className="text-green-400 flex flex-col items-center max-w-xs mx-auto text-center">
                      <FileText className="w-8 h-8 mb-2" />
                      {/* Truncate long filenames */}
                      <span
                        className="text-sm font-bold truncate w-40"
                        title={cvFile.name} // show full filename on hover
                      >
                        {cvFile.name}
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        Click to change
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center max-w-xs mx-auto text-center">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm break-words">
                        Click to upload PDF, DOCX, TXT
                      </span>
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <textarea
                required={activeTab === "text"}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none h-32 resize-none"
                placeholder="Paste your full CV experience here..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center shadow-lg shadow-yellow-500/20"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              <>
                Start Interview <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
